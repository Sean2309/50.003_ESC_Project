const transactionEnquiryController = require('../controllers/transactionEnquiryController');

//Before testing, follow instructions in README to setup database

//////////processRoute tests ///////////

//assert bank_name output

//assert loyalty_program_name output

//assert id_list with one input

//assert id_list with two inputs with commas


//assert id_list inputs without comma

//catch id_list no input

//catch id_list no input with comma

//catch empty parameters for bank_name

//catch empty parameters for loyalty_program_name

//catch invalid database connection

//catch invalid collection connection


describe("processRoute test-suite", () => {
    test ("summing of two positive numbers", () => {
        const result = mymath.sum(1,2);
        expect(result).toBe(3);
    });
    test ("summing of two negative numbers", () => {
        const result = mymath.sum(-3,-2);
        expect(result).toBe(-5);
    });
})
