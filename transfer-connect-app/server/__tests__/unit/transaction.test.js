// Import required modules and dependencies
const transactionController = require('../../controllers/transactionController');
const createTransactionModel = require('../../models/transaction');
const mongoose = require('mongoose');

const loyaltyProgramId = 'mockId';

// Mock Response class to simulate responses
class MockResponse {
    constructor() {
        this.status;
        this.data;
    }

    // Simulate response status setting
    status(statusCode) {
        this.status = statusCode;
        return this;
    }

    // Simulate JSON response data setting
    json(data) {
        this.data = data;
        return this;
    }
}

// =========== Test Suite and Cases ======== //

// Describe a test suite for the createTransaction function
describe('createTransaction function', () => {
    // Create a TransactionModel with the given loyaltyProgramId
    const TransactionModel = createTransactionModel(loyaltyProgramId);

    // Test case: TransactionModel should have the collection name of loyaltyProgramId
    test('should create a Transaction model with a collection name of loyaltyProgramId', () => {
        // Ensure the model has a collection name of loyaltyProgramId
        expect(TransactionModel.collection.name).toEqual(loyaltyProgramId);
    })

    // Test case: Transaction instance should have all fields from mockTransactionData
    test('transaction instance should have all present fields given by mockTransactionData', () => {
        // Mock form data to simulate sending of data from bank app client
        const mockTransactionData = {
            memberName: "mockUser",
            membershipId: "01",
            transferDate: "11-11-11",
            transferAmount: 2000,
            notificationMethod: "1",
            referenceNumber: "210200011D",
            emailAddress: "mock@email.com",
            phoneNumber: "88100110",
            systemId: "mock",
            partnerCode: "DBSSG"
        };

        // Create a document and convert it to a plain object
        const transaction = (new TransactionModel(mockTransactionData)).toObject();

        // Delete the _id key created for each MongoDB document
        delete transaction._id;

        // Expect the transaction object to match the mockTransactionData
        expect(transaction).toMatchObject(mockTransactionData);
    })

    // Test case: TransactionModel should throw an error if required fields are missing
    test('TransactionModel throws error if required fields are not present', async () => {
        // Mock form data to simulate sending of data from bank app client
        const mockTransactionData = {
            memberName: "mockUser",
            membershipId: "01",
            systemId: "mock"
        };

        // Create a TransactionModel instance
        const transaction = new TransactionModel(mockTransactionData);

        // Validate and expect an instance of ValidationError
        error = transaction.validateSync();
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    })
})

// Describe a test suite for the transactionController
describe('transactionController', () => {
    // Mock form data to simulate sending of data from bank app client
    const mockTransactionData = {
        memberName: "mockUser",
        membershipId: "01",
        transferDate: "11-11-11",
        transferAmount: 2000,
        notificationMethod: "1",
        emailAddress: "mock@email.com",
        phoneNumber: "88100110",
        referenceNumber: "100101101D",
        partnerCode: "DBSSG",
        systemId: "MOCK"
    };

    // Test case: submitTransaction POST handler responds with correct status
    test('submitTransaction POST handler successfully responds to POST request with correct body and params', async () => {
        // Create a mock request object with the mockTransactionData and loyaltyProgramId
        const mockRequest = {
            body: mockTransactionData,
            params: {
                loyaltyProgramId: loyaltyProgramId
            }
        };

        // Create a mock response object
        const mockResponse = new MockResponse();

        // Mock the saveTransactionToDb function to resolve
        jest.spyOn(transactionController, 'saveTransactionToDb').mockResolvedValueOnce();

        // Call the submitTransaction handler and expect a status of 201
        await transactionController.submitTransaction(mockRequest, mockResponse);
        expect(mockResponse.status).toEqual(201);
    })
});
