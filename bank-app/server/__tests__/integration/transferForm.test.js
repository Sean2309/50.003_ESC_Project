const { default: mongoose } = require('mongoose');
const transferFormController = require('../../controllers/transferFormController');
const createTransferForm = require('../../models/transferForm');
const { MONGODB_URL } = require('../../utils/config');

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

beforeEach(async () => {
    await mongoose.connect(MONGODB_URL).catch((err) => console.error('error'));
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
        
        const retrievedTransaction = await MockTransactionModel.findOne( {systemId: mockSystemId } );
        
        // Verify that the retrieved Transaction is equivalent to our original
        
        delete retrievedTransaction._id;
        
        expect(retrievedTransaction).toMatchObject(mockTransactionData);

    })

    //test("saveTransactionToDb throws error when transaction is missing fields", async () => {

    //    const mockTransactionData = {
    //        memberName: "MockUser",
    //        transferAmount: 2000,
    //        partnerCode: "DBSSG"
    //    };
    //    
    //    
    //    expect.assertions(1);
    //    try {
    //      // Since our transaction data is incomplete, mongoose validate hook will throw a ValidationError when .save() is called in saveTransactionToDb
    //      const res = await transactionController.saveTransactionToDb(loyaltyProgramId, mockTransactionData);
    //    } catch (error) {
    //      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    //    }
    //    
    //})
    //
    //test("submitTransaction throws error when transaction is missing fields", async () => {

    //    const mockTransactionData = {
    //        memberName: "MockUser",
    //        transferAmount: 2000,
    //        partnerCode: "DBSSG"
    //    };
    //    
    //    const request = { body: mockTransactionData, params: { loyaltyProgramId: loyaltyProgramId } };
    //    
    //    const response = new MockResponse();
    //    
    //    await transactionController.submitTransaction(request, response)
    //    
    //    expect(response.status).toEqual(500);
 
    //})
    //
    //test("submitTransaction successfully saves a transaction to db and responds with systemId and satus code 201", async () => {

    //    const mockTransactionData = {
    //        memberName: "MockUser",
    //        membershipId: "01",
    //        transferDate: "11-11-11",
    //        transferAmount: 2000,
    //        notificationMethod: "1",
    //        referenceNumber: "210200011",
    //        emailAddress: "Mock@email.com",
    //        phoneNumber: "88100110",
    //        partnerCode: "DBSSG"
    //    };
    //    
    //    const mockSystemId = "1001";
    //    
    //    jest.spyOn(transactionController, 'generateSystemId').mockReturnValueOnce(mockSystemId);

    //    const request = { body: mockTransactionData, params: { loyaltyProgramId: loyaltyProgramId } };
    //    
    //    const response = new MockResponse();
    //    
    //    await transactionController.submitTransaction(request, response);
    //    
    //    expect(response.status).toEqual(201);

    //    expect(response.data.systemId).toEqual(mockSystemId);
    //
    //    const MockTransactionModel = createTransactionModel(loyaltyProgramId);
    //    
    //    retrievedTransaction = await MockTransactionModel.findOne({ systemId: mockSystemId });
    //    
    //    delete retrievedTransaction._id;
    //    
    //    mockTransactionData.systemId = mockSystemId;
    //    
    //    expect(retrievedTransaction).toMatchObject(mockTransactionData);
    //    
    //    


    //})

})
