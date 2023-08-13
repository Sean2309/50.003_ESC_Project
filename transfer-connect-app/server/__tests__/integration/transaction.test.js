// Import required modules and dependencies
const { default: mongoose } = require('mongoose');
const transactionController = require('../../controllers/transactionController');
const { MONGODB_OPTIONS } = require('../../utils/config');
const createTransactionModel = require('../../models/transaction');
const loyaltyProgramId = 'MockId';
MONGODB_URL="mongodb+srv://user1:1234@cluster0.5iybncp.mongodb.net/TESTDB?retryWrites=true&w=majority";

// Mock Response class to simulate responses
class MockResponse {
    constructor() {
        this.status;
        this.data;
    }

    status(statusCode) {
        this.status = statusCode;
        return this;
    }

    json(data) {
        this.data = data;
        return this;
    }
    
    sendStatus(statusCode) {
        this.status = statusCode;
        return this;
    }
}

// =========== Test Suite and Cases ======== //

// Before all test cases, connect to the MongoDB database
beforeAll(async () => {
    await mongoose.connect(MONGODB_URL, MONGODB_OPTIONS);
})

// Before each test case, clear the mock transaction collection
beforeEach(async () => {
    const MockTransactionModel = createTransactionModel(loyaltyProgramId);
    await MockTransactionModel.deleteMany({});
})

// After each test case, clear the mock transaction collection and drop the collection if needed
afterEach(async () => {
    const MockTransactionModel = createTransactionModel(loyaltyProgramId);
    await MockTransactionModel.deleteMany({});

    try {
        await MockTransactionModel.collection.drop();
    }
    catch (error) {
        // If dropping the collection fails, do nothing
    }
})


// Describe a test suite for the transactionController module
describe('transactionController', () => {
    // Test case: saveTransactionToDb saves a document to the database
    test("saveTransactionToDb saves a document to db", async () => {
         // Mock systemId and transaction data
        const mockSystemId = "1001";

        const mockTransactionData = {
            memberName: "MockUser",
            membershipId: "01",
            transferDate: "11-11-11",
            transferAmount: 2000,
            notificationMethod: "1",
            referenceNumber: "210200011",
            emailAddress: "Mock@email.com",
            phoneNumber: "88100110",
            systemId: mockSystemId,
            partnerCode: "DBSSG"
        };

        // Create a mock transaction model
        const MockTransactionModel = createTransactionModel(loyaltyProgramId);

        // Call the saveTransactionToDb method
        await transactionController.saveTransactionToDb(loyaltyProgramId, mockTransactionData);
        
        // Retrieve the saved transaction from the database
        const retrievedTransaction = await MockTransactionModel.findOne({systemId: mockSystemId });
    
        // Verify that the retrieved transaction matches the original data    
        delete retrievedTransaction._id;
        expect(retrievedTransaction).toMatchObject(mockTransactionData);

    })  
    // Test case: saveTransactionToDb throws error when transaction is missing fields
    test("saveTransactionToDb throws error when transaction is missing fields", async () => {
        // Mock incomplete transaction data
        const mockTransactionData = {
            memberName: "MockUser",
            transferAmount: 2000,
            partnerCode: "DBSSG"
        };
        
         // Expect the validation error to be thrown
        expect.assertions(1);
        try {
          // Since our transaction data is incomplete, mongoose validate hook will throw a ValidationError when .save() is called in saveTransactionToDb
          const res = await transactionController.saveTransactionToDb(loyaltyProgramId, mockTransactionData);
        } catch (error) {
          expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        }
        

        
    })
     // Test case: submitTransaction throws error when transaction is missing fields
    test("submitTransaction throws error when transaction is missing fields", async () => {
        // Mock incomplete transaction data
        const mockTransactionData = {
            memberName: "MockUser",
            transferAmount: 2000,
            partnerCode: "DBSSG"
        };
        // Mock request and response objects
        const request = { body: mockTransactionData, params: { loyaltyProgramId: loyaltyProgramId } };
        const response = new MockResponse();
        
        // Call the submitTransaction method and expect a 500 status
        await transactionController.submitTransaction(request, response)
        expect(response.status).toEqual(500);
 
    })

    // Test case: submitTransaction successfully saves a transaction to the database and responds with systemId and status code 201
    test("submitTransaction successfully saves a transaction to db and responds with systemId and satus code 201", async () => {
        // Mock systemId, transaction data, and a generated mockSystemId
        const mockTransactionData = {
            memberName: "MockUser",
            membershipId: "01",
            transferDate: "11-11-11",
            transferAmount: 2000,
            notificationMethod: "1",
            referenceNumber: "210200011",
            emailAddress: "Mock@email.com",
            phoneNumber: "88100110",
            partnerCode: "DBSSG"
        };
        
        const mockSystemId = "1001";
        
        // Mock the generateSystemId function to return the mockSystemId
        jest.spyOn(transactionController, 'generateSystemId').mockReturnValueOnce(mockSystemId);

         // Mock request and response objects
        const request = { body: mockTransactionData, params: { loyaltyProgramId: loyaltyProgramId } };
        const response = new MockResponse();
        
        // Call the submitTransaction method
        await transactionController.submitTransaction(request, response);
        
        // Expect the response status to be 201
        expect(response.status).toEqual(201);

        // Expect the response data systemId to match the mockSystemId
        expect(response.data.systemId).toEqual(mockSystemId);
    
        // Retrieve the saved transaction from the database
        const MockTransactionModel = createTransactionModel(loyaltyProgramId);
        retrievedTransaction = await MockTransactionModel.findOne({ systemId: mockSystemId });
        
        // Verify that the retrieved transaction matches the expected data
        delete retrievedTransaction._id;
        mockTransactionData.systemId = mockSystemId;
        expect(retrievedTransaction).toMatchObject(mockTransactionData);
    })

})
