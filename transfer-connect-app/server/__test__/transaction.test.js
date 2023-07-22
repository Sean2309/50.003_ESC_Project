const transactionController = require('../controllers/transactionController');
const createTransactionModel = require('../models/transaction');

const loyaltyProgramId = 'mockId';

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
}

// =========== Test Suite and Cases ======== //

describe('createTransaction function', () => {
    const TransactionModel = createTransactionModel(loyaltyProgramId);

    test('should create a Transaction model with collection name of loyaltyProgramId', () => {
        // ensure the model has collection name of loyaltyProgramId
        expect(TransactionModel.collection.name).toEqual(loyaltyProgramId);
    })

    test('transaction instance should have all present fields given by mockTransactionData', () => {

        // mock form data to simulate sending of data from bank app client
        const mockTransactionData = {
            memberName: "mockUser",
            membershipId: "01",
            transferDate: "11-11-11",
            transferAmount: 2000,
            notificationMethod: "1",
            referenceNumber: "210200011D",
            emailAddress: "mock@email.com",
            phoneNumber: "88100110",
        };

        // create a document and immediately convert it back to a plain object, 
        const transaction = (new TransactionModel(mockTransactionData)).toObject();

        // delete _id key that is created for each mongodb document
        delete transaction._id;

        expect(transaction).toMatchObject(mockTransactionData);
    })
})

describe('transactionController', () => {
    // mock form data to simulate sending of data from bank app client
    const mockTransactionData = {
        memberName: "mockUser",
        membershipId: "01",
        transferDate: "11-11-11",
        transferAmount: 2000,
        notificationMethod: "1",
        emailAddress: "mock@email.com",
        phoneNumber: "88100110",
        referenceNumber: "100101101D"
    };

    test('submitTransaction POST handler successfully responds to POST request with correct body and params', async () => {
        const mockRequest = {
            body: mockTransactionData,
            params: {
                loyaltyProgramId: loyaltyProgramId
            }
        };
        
        const mockResponse = new MockResponse();

        jest.spyOn(transactionController, 'saveTransactionToDb').mockResolvedValueOnce();

        await transactionController.submitTransaction(mockRequest, mockResponse);
        
        expect(mockResponse.status).toEqual(201);
        expect(mockResponse.data).toEqual({ systemCode: "101" });

    })

})
