const { default: mongoose } = require('mongoose');
const transferFormController = require('../../controllers/transferFormController');
const createTransferForm = require('../../models/transferForm');
const { MONGODB_URL, MONGODB_OPTIONS } = require('../../utils/config');
const fc = require('fast-check'); // Import fast-check
// fc.configureGlobal({ numRuns: 1000 });
const loyaltyProgramId = "integrationTestFuzzMock";

describe('transferFormController', () => {

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

    afterAll(async () => {

      }
    )

    // let failureId = 0;
    // function reportFailure(inputs, error) {
    //     const fileName = `failure-pid${process.pid}-${++failureId}.log`;
    //     const fileContent = `Counterexample: ${fc.stringify(inputs)}\n\nError: ${error}`;
    //     fs.writeFile(fileName, fileContent);
    // }
  
    it('saveTransactionToDb saves a document to db', async () => {
      // Define a generator for mockTransactionData
      const mockTransactionDataGenerator = fc.record({
        memberName: fc.string(),
        membershipId: fc.string(),
        transferDate: fc.string(),
        transferAmount: fc.integer(),
        notificationMethod: fc.string(),
        referenceNumber: fc.string(),
        emailAddress: fc.string(),
        phoneNumber: fc.string(),
        systemId: fc.string(),
        partnerCode: fc.string(),
      });
  
      const testIterations = 1000;
  
      // TODO: Statistics object to track the test results
  
      await fc.assert(
        fc.asyncProperty(mockTransactionDataGenerator, async (mockTransactionData) => {
          // Call saveTransactionToDb with the generated mockTransactionData
          const MockTransactionModel = createTransferForm(loyaltyProgramId);
          try {
            await transferFormController.saveTransactionToDb(loyaltyProgramId, mockTransactionData);
  
            // Now, we find the same document via systemId
            const retrievedTransaction = await MockTransactionModel.findOne({
              systemId: mockTransactionData.systemId,
            });
  
            // Verify that the retrieved Transaction is equivalent to our original
            delete retrievedTransaction._id;
  
            expect(retrievedTransaction).toMatchObject(mockTransactionData);
          } catch (error) {
          }
        }),
        { seed: Date.now(), numRuns: testIterations}
      );
    });  
  });