const { default: mongoose } = require('mongoose');
const transferFormController = require('../../controllers/transferFormController');
const createTransferForm = require('../../models/transferForm');
const { MONGODB_URL, MONGODB_OPTIONS } = require('../../utils/config');

const loyaltyProgramId = "integrationTestMock";

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
beforeAll(async () => {
    await mongoose.connect(MONGODB_URL, MONGODB_OPTIONS);
})

beforeEach(async () => {
    const MockTransactionModel = createTransferForm(loyaltyProgramId);
    await MockTransactionModel.deleteMany({});
})

afterEach(async () => {
    const MockTransactionModel = createTransferForm(loyaltyProgramId);
    await MockTransactionModel.deleteMany({});

    try {
        await MockTransactionModel.collection.drop();
    }
    catch (error) {
        // do nothing 
    }
})



describe('transferFormController', () => {
    test("saveTransactionToDb saves a document to db", async () => {

        const mockSystemId = "mock"

        const mockTransactionData = {
            memberName: "MockUser",
            membershipId: "01",
            transferDate: "11-11-11",
            transferAmount: 2000,
            notificationMethod: "1",
            referenceNumber: "210200011",
            emailAddress: "Mock@email.com",
            phoneNumber: "88100110",
            systemId: "mock",
            partnerCode: "DBSSG"
        };

        const MockTransactionModel = createTransferForm(loyaltyProgramId);

        await transferFormController.saveTransactionToDb(loyaltyProgramId, mockTransactionData);

        // Now, we find the same document via systemId

        const retrievedTransaction = await MockTransactionModel.findOne({ systemId: mockSystemId });

        // Verify that the retrieved Transaction is equivalent to our original

        delete retrievedTransaction._id;

        expect(retrievedTransaction).toMatchObject(mockTransactionData);

    })

    test("saveTransactionToDb throws error when transaction is missing fields", async () => {

        const mockTransactionData = {
            memberName: "MockUser",
            transferAmount: 2000,
            partnerCode: "DBSSG"
        };


        expect.assertions(1);
        try {
            // Since our transaction data is incomplete, mongoose validate hook will throw a ValidationError when .save() is called in saveTransactionToDb
            const res = await transferFormController.saveTransactionToDb(loyaltyProgramId, mockTransactionData);
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        }

    })

    test("submitTransferForm returns status code 500 if the submission fails", async () => {
        const request = {body: null}
        const response = new MockResponse();
        next = jest.fn();

        jest.spyOn(transferFormController, 'postTransaction').mockRejectedValue(new Error);

        await transferFormController.submitTransferForm(request, response, next);

        expect(response.status).toEqual(500);


    })

})
