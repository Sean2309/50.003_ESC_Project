/* 
    this cypress test suite simply checks if transactions appear in the history
*/

describe('/transaction', () => {
    const url = 'http://localhost:3000'

    beforeEach(() => {
        cy.visit(url + '/login');

        cy.get("#loginId").type("john123");
        cy.get("#password").type("password");
        cy.get('form').submit()
    })

    it('should display transactions if present, else no transactions message', () => {
        cy.contains('Transactions').click();

        cy.get('div').then(($div) => {
            if (!($div.text().includes('No transactions to be found :('))) {
                cy.wrap($div).children('div').should('exist');
            }
        })
    })

    it('submitting a new transaction should appear in /transactions', () => {
        cy.contains('Marketplace').click();

        cy.get('.loyalty-box h3').contains('GoJet Points').parent().as('loyaltyBox');
        cy.get('@loyaltyBox').contains("Transfer").click();
        cy.get("#memberName").type("john");
        cy.get("#membershipId").type("123456789A");
        cy.get("#membershipIdConfirmation").type("123456789A");
        cy.get("#transferAmount").type("1");
        cy.get('[data-testid="submit-button"]').click();
        cy.get('#referenceNumberDisplay').should('be.visible')



        let referencenumber;
        cy.get('[data-testid="reference-number-display"]').invoke('text').then((text) => {
            const regex = /(\d+)/;
            const match = text.match(regex);
            if (match) {
                referencenumber = match[0];

                cy.contains('Close').click();
                // nav to /transactions again
                cy.contains('Transactions').click();

                // Check if the reference number is displayed on the transaction history page
                cy.get('[data-testid="marketplace-container-test"]').contains(referencenumber).should('be.visible');
            }
        });

    })

})