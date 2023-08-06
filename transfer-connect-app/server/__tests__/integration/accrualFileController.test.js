const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const dateUtil = require('../../controllers/date');
const config = require('../../utils/config');
const File = require('files.com/lib/models/File').default;
const {
  getModel,
  getDataFromCollection,
  groupData,
  writeGroupedDataToCsv,
} = require('../../controllers/accrualFileController');
const {clearFolder} = require('../../controllers/clearFolder')
const accrualFileController = require('../../controllers/accrualFileController');
const accrual_files_dir = path.join(__dirname, '../../controllers/accrual_files');

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
jest.mock('../../utils/config');
jest.mock('csv-writer', () => ({
  createObjectCsvWriter: jest.fn(() => ({
    writeRecords: jest.fn().mockResolvedValue(),
  })),
}));
jest.mock('../../controllers/date', () => ({
  getFormattedDate: jest.fn()
}));
jest.mock('files.com/lib/models/File', () => ({
  default: {
    uploadFile: jest.fn(),
  },
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

    testDir = '../../controllers/clearFolder';
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

describe('Integration tests', () => {
  describe('writeGroupedDataToCsv function check', () => {
    const testGroupedData = {
      'partner1': [
        { 
          membershipId: '123',
          memberName: 'John Doe',
          transferDate: '2023-07-23',
          transferAmount: '1000',
          referenceNumber: 'ref123',
          partnerCode: 'partner1' 
        }
      ]
    };
    const testCollection = 'testCollection';
    const csvWriter = {
      writeRecords: jest.fn().mockResolvedValue()
    };
    const filePath = path.join('accrual_files', `${testCollection}_partner1.csv`);

    beforeEach(() => {
      createObjectCsvWriter.mockReturnValue(csvWriter);
      fs.existsSync.mockReturnValue(true);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('createObjectCsvWriter should be called with correct params', async () => {
      await writeGroupedDataToCsv(testGroupedData, testCollection);
      expect(createObjectCsvWriter).toHaveBeenCalledWith({
        path: path.resolve(__dirname, "../..", "controllers", "accrual_files", "testCollection_partner1.csv"),
        header: [
          {id: 'membershipId', title: 'Membership ID'},
          {id: 'memberName', title: 'Member name'},
          {id: 'transferDate', title: 'Transfer date'},
          {id: 'transferAmount', title: 'Transfer Amount'},
          {id: 'referenceNumber', title: 'Reference number'},
          {id: 'partnerCode', title: 'Partner code'},
        ],
      });
      
    });

    test('writeRecords should be called with correct data', async () => {
      await writeGroupedDataToCsv(testGroupedData, testCollection);

      expect(csvWriter.writeRecords).toHaveBeenCalledWith(testGroupedData['partner1']);
    });
  });

  describe('writeCollectionsToCsv function check', () => {
    const stringToday = '2023-08-03';
    const mockData = [{test: 'data'}];
    const mockGroups = {partner1: mockData};

    beforeEach(() => {
      dateUtil.getFormattedDate.mockReturnValue(stringToday);
      config.mongoDBCollections = ['testCollection1', 'testCollection2'];
      accrualFileController.getModel = jest.fn();
      accrualFileController.getDataFromCollection = jest.fn().mockResolvedValue(mockData);
      accrualFileController.groupData = jest.fn().mockReturnValue(mockGroups);
      accrualFileController.writeGroupedDataToCsv = jest.fn().mockResolvedValue();
      console.log = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should correctly retrieve, group and write data for each collection', async () => {
      await accrualFileController.writeCollectionsToCsv();
    
      for (const collection of config.collections) {
        expect(accrualFileController.getModel).toHaveBeenCalledWith(collection);
        expect(accrualFileController.getDataFromCollection).toHaveBeenCalledWith(accrualFileController.getModel(collection), stringToday);
        expect(accrualFileController.groupData).toHaveBeenCalledWith(mockData);
        expect(accrualFileController.writeGroupedDataToCsv).toHaveBeenCalledWith(mockGroups, collection);
      }
    });    
  });

  describe('uploadFilesToServer function', () => {
    let controller;

    beforeEach(() => {
      // Setup the mocks before each test
      fs.readdirSync.mockImplementation(() => ['collection1_1.csv', 'collection2_2.csv']);
      File.uploadFile.mockResolvedValue(true);
      dateUtil.getFormattedDate.mockReturnValue('20230803');
      config.collections = ['collection1', 'collection2'];
      config.kaligoURL = '<mocked-kaligo-url>';
      config.kaligoAPIKey = '<mocked-api-key>';
    });

    it('should upload files to the server', async () => {
      await accrualFileController.uploadFilesToServer();

      expect(fs.readdirSync).toHaveBeenCalledWith(accrual_files_dir);
      expect(File.uploadFile).toHaveBeenCalledTimes(2);
      expect(File.uploadFile).toHaveBeenCalledWith(
        '/transfer_connect_sutd_case_study_2023/c4i1/Accrual/collection1/1_ACCRUAL_20230803.csv',
        path.join(accrual_files_dir, 'collection1_1.csv'),
        { mkdir_parents: true }
      );
      expect(File.uploadFile).toHaveBeenCalledWith(
        '/transfer_connect_sutd_case_study_2023/c4i1/Accrual/collection2/2_ACCRUAL_20230803.csv',
        path.join(accrual_files_dir, 'collection2_2.csv'),
        { mkdir_parents: true }
      );
    });
  });
});