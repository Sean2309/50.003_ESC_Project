const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('../utils/config');
const { createObjectCsvWriter } = require('csv-writer');
const {
  getModel,
  getDataFromCollection,
  groupData,
  writeGroupedDataToCsv,
  writeCollectionsToCsv,
  uploadFilesToServer,
  main,
  queryFromDBandUpload
} = require('../controllers/accrualFileController');
const {clearFolder} = require('../controllers/clearFolder')

jest.mock('fs', () => {
  return {
    mkdirSync: jest.fn(),
    readdirSync: jest.fn(),
    rmdirSync: jest.fn(),
    existsSync: jest.fn(),
    openSync: jest.fn(),
    closeSync: jest.fn(),
    unlinkSync: jest.fn(),
  };
});
jest.mock('mongoose');
jest.mock('../utils/config');
jest.mock('csv-writer', () => ({
  createObjectCsvWriter: jest.fn(),
}));

// Mock Mongoose document
class MockDocument {
    constructor(data) {
      Object.assign(this, data);
    }
  
    get(field) {
      return this[field];
    }
}

// Mock data
const mockData = {
  'collection1': [
    {
      _id: "649fb6ad87d672d8f30e98e5",
      transferDate: "2023-07-23",
      referenceNumber: "3av456b",
      partnerCode: "DBSSG",
      membershipId: "2342345bc",
      memberName: "Thomas Doe",
      transferAmount: 100000,
      outcomeCode: "0002"
    },
    {
      _id: "759fb6ad87d672d8f30e99b6",
      transferDate: "2023-07-23",
      referenceNumber: "4bx456c",
      partnerCode: "HSBC",
      membershipId: "1231235cd",
      memberName: "Jane Doe",
      transferAmount: 200000
    },
    {
      _id: "869fb6ad87d672d8f30e99d8",
      transferDate: "2023-07-24",
      referenceNumber: "6dy456e",
      partnerCode: "HSBC",
      membershipId: "8908908ij",
      memberName: "Jane Smith",
      transferAmount: 350000
    },
    {
      _id: "879fb6ad87d672d8f30e99e9",
      transferDate: "2023-07-23",
      referenceNumber: "7ez456f",
      partnerCode: "DBSSG",
      membershipId: "9109109kl",
      memberName: "John Doe",
      transferAmount: 400000
    }
  ],
  'collection2': [
    {
      _id: "859fb6ad87d672d8f30e99c7",
      transferDate: "2023-07-23",
      referenceNumber: "5cy456d",
      partnerCode: "DBSSG",
      membershipId: "5675675ef",
      memberName: "Richard Roe",
      transferAmount: 300000
    }
  ]
};

describe('Unit tests', () => {
  beforeEach(() => {
    mongoose.connection = { // Mock mongoose.connection object
      close: jest.fn(),
    };

    testDir = '../controllers/clearFolder';
  });

  afterEach(() => {
    jest.resetAllMocks();    
  });

  test('getModel function should return a Mongoose model', () => {
    // Mock the mongoose.model method to return a model with the given collection name
    mongoose.model = jest.fn((collection, schema) => {
      // For the test, we can return a model that uses the mockData
      return {
        collection: { name: collection },
        find: jest.fn().mockResolvedValue(mockData[collection]), // Mock the find method to return data from mockData
      };
    });
  
    // Get the keys (collection names) from mockData
    const collectionNames = Object.keys(mockData);
  
    // Iterate over the collection names and test each one
    collectionNames.forEach((collectionName) => {
      const model = getModel(collectionName);
  
      // Expect that the model's collection name matches the expected collection name.
      expect(model.collection.name).toBe(collectionName);
  
      // Check if the find method returns the data from the mockData
      return model.find().then((result) => {
        expect(result).toEqual(mockData[collectionName]);
      });
    });
  });
  
  
  
  test('should return undefined if the collection name is not provided', () => {
    const model = getModel();
    expect(model).toBeUndefined();
  });

  test('getDataFromCollection function should query the correct collection', async () => {
    // This mocks the "find" function to mimic the behavior of MongoDB's find operation
    const mockFind = jest.fn().mockImplementation((query) => {
      const filteredData = [];
  
      // Iterate over each collection in mockData
      for (let collectionName in mockData) {
        const collection = mockData[collectionName];
        
        // Filter the documents in the current collection
        const filteredCollection = collection.filter(doc =>
          (!doc.outcomeCode) && (doc.transferDate === query.transferDate)
        );
        
        filteredData.push(...filteredCollection);
      }
  
      return Promise.resolve(filteredData);
    });
  
    const mockModel = { find: mockFind };
    const stringToday = '2023-07-23';
    const result = await getDataFromCollection(mockModel, stringToday);
  
    // Expect that the find function was called with the correct arguments
    expect(mockFind).toHaveBeenCalledWith({
      outcomeCode: { $exists: false },
      transferDate: stringToday
    });
  
    // Hardcoded expected result
    const expectedResultGetData = [
      {
        _id: "759fb6ad87d672d8f30e99b6",
        transferDate: "2023-07-23",
        referenceNumber: "4bx456c",
        partnerCode: "HSBC",
        membershipId: "1231235cd",
        memberName: "Jane Doe",
        transferAmount: 200000
      },
      {
        _id: "879fb6ad87d672d8f30e99e9",
        transferDate: "2023-07-23",
        referenceNumber: "7ez456f",
        partnerCode: "DBSSG",
        membershipId: "9109109kl",
        memberName: "John Doe",
        transferAmount: 400000
      },
      {
        _id: "859fb6ad87d672d8f30e99c7",
        transferDate: "2023-07-23",
        referenceNumber: "5cy456d",
        partnerCode: "DBSSG",
        membershipId: "5675675ef",
        memberName: "Richard Roe",
        transferAmount: 300000
      }
    ];
  
    expect(result).toEqual(expectedResultGetData);
  });
  
  test('groupData function should group data by partnerCode', () => {
    // Convert array of docs to a single array to mimic getDataFromCollection's output
    const ungroupedData = [].concat(...Object.values(mockData)).map((document) => new MockDocument(document));
    const result = groupData(ungroupedData);
  
    // Hardcoded expected result
    const expectedResultGroup = {
      'DBSSG': [
        {
          _id: "649fb6ad87d672d8f30e98e5",
          transferDate: "2023-07-23",
          referenceNumber: "3av456b",
          partnerCode: "DBSSG",
          membershipId: "2342345bc",
          memberName: "Thomas Doe",
          transferAmount: 100000,
          outcomeCode: "0002"
        },
        {
          _id: "879fb6ad87d672d8f30e99e9",
          transferDate: "2023-07-23",
          referenceNumber: "7ez456f",
          partnerCode: "DBSSG",
          membershipId: "9109109kl",
          memberName: "John Doe",
          transferAmount: 400000
        },
        {
          _id: "859fb6ad87d672d8f30e99c7",
          transferDate: "2023-07-23",
          referenceNumber: "5cy456d",
          partnerCode: "DBSSG",
          membershipId: "5675675ef",
          memberName: "Richard Roe",
          transferAmount: 300000
        }
      ],
      'HSBC': [
        {
          _id: "759fb6ad87d672d8f30e99b6",
          transferDate: "2023-07-23",
          referenceNumber: "4bx456c",
          partnerCode: "HSBC",
          membershipId: "1231235cd",
          memberName: "Jane Doe",
          transferAmount: 200000
        },
        {
          _id: "869fb6ad87d672d8f30e99d8",
          transferDate: "2023-07-24",
          referenceNumber: "6dy456e",
          partnerCode: "HSBC",
          membershipId: "8908908ij",
          memberName: "Jane Smith",
          transferAmount: 350000
        }
      ]
    };
    expect(result).toMatchObject(expectedResultGroup);
  });

  test('should delete all files in a directory', async () => {
    // Mock fs.readdirSync to return an array of 5 files
    fs.readdirSync.mockReturnValue(['file1', 'file2', 'file3', 'file4', 'file5']);
    // Before clearFolder, there should be 5 files in the directory
    let files = fs.readdirSync(testDir);
    expect(files.length).toBe(5);
  
    await clearFolder(testDir);
  
    // Mock fs.readdirSync to return an empty array after clearFolder
    fs.readdirSync.mockReturnValueOnce([]);
  
    // After clearFolder, the directory should be empty
    files = fs.readdirSync(testDir);
    expect(files.length).toBe(0);
    expect(fs.unlinkSync).toHaveBeenCalledTimes(5); // Expect that unlinkSync was called 5 times to remove the files
  });
});

const mockWriteRecords = jest.fn().mockResolvedValue();

describe('Integration tests', () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true); // Mock that the directory already exists
    fs.mkdirSync.mockClear(); // Clear any previous calls to mkdirSync
    fs.unlinkSync.mockClear(); // Clear any previous calls to unlinkSync
    createObjectCsvWriter.mockClear(); // Clear any previous calls to createObjectCsvWriter
    mockWriteRecords.mockClear(); // Clear any previous calls to writeRecords

    createObjectCsvWriter.mockImplementation(() => {
      return {
        writeRecords: mockWriteRecords,
      };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();    
  });

  test('writeGroupedDataToCsv function should correctly create csv files with the correct headers', async () => {
    // Mock the csvWriter
    const mockCsvWriter = {
      writeRecords: jest.fn().mockResolvedValue(),
    };
    createObjectCsvWriter.mockReturnValue(mockCsvWriter);
  
    // Call the function with the given mock data
    const collection = 'collection1';
    const groupedData = groupData(mockData[collection]);
    await writeGroupedDataToCsv(groupedData, collection);
  
    // Expect that createCsvWriter was called with the correct arguments
    for (let partnerCode in groupedData) {
      expect(createObjectCsvWriter).toHaveBeenCalledWith({
        path: path.join('accrual_files', `${collection}_${partnerCode}.csv`),
        header: [
          { id: 'membershipId', title: 'Membership ID' },
          { id: 'memberName', title: 'Member name' },
          { id: 'transferDate', title: 'Transfer date' },
          { id: 'transferAmount', title: 'Transfer Amount' },
          { id: 'referenceNumber', title: 'Reference number' },
          { id: 'partnerCode', title: 'Partner code' },
        ],
      });
  
      // Expect that writeRecords was called with the correct data for the partner code
      expect(mockCsvWriter.writeRecords).toHaveBeenCalledWith(groupedData[partnerCode]);
    }
  }); 
});

// test('writeCollectionsToCsv function should correctly fetch, group, and write data for each collection', async () => {
//   // Mock getModel, getDataFromCollection, groupData, writeGroupedDataToCsv functions
//   const mockGetModel = jest.fn().mockReturnValue({ find: jest.fn().mockResolvedValue([]) });
//   const mockGetDataFromCollection = jest.fn().mockReturnValue({ find: jest.fn().mockResolvedValue([])});
//   const mockGroupData = jest.fn().mockReturnValue({ find: jest.fn().mockResolvedValue([])});
//   const mockWriteGroupedDataToCsv = jest.fn().mockReturnValue({ find: jest.fn().mockResolvedValue([])});

//   // Call the function
//   await writeCollectionsToCsv();

//   // Expect that each helper function was called the correct number of times
//   for (const collection of config.mongoDBCollections) {
//     expect(mockGetModel).toHaveBeenCalledWith(collection);
//     expect(mockGetDataFromCollection).toHaveBeenCalledWith(expect.anything(), '2023-07-23'); // We're not testing the model here, so we don't care what it is
//     expect(mockGroupData).toHaveBeenCalledWith([]);
//     expect(mockWriteGroupedDataToCsv).toHaveBeenCalledWith({}, collection);
//   }
// });

// test('uploadFilesToServer should correctly upload files', async () => {
//   // Mocking this function depends on how you're uploading the files
// });