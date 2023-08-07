/* This cypress test file tests marketplace functionality:
    1. showing of loyalty programs
    2. showing of user's number of points
    3. clicking on 'Transfer' opens forms
    4. clicking on 'Close' closes forms

    5. client-sided form validation
        - missing inputs
        - incorrect membershipid
        - incorrect membershipid format
    6. successful form submission
*/

describe('/marketplace', () => {
    const url = 'http://localhost:3000'

    beforeEach(() => {
        cy.visit(url + '/login');

        cy.get("#loginId").type("john123");
        cy.get("#password").type("password");
        cy.get('form').submit()
    })

    it('should show loyalty programs', () => {
        cy.get('.loyalty-box h3').contains('GoJet Points').parent().as('GoJet');
        cy.get('.loyalty-box h3').contains('Asia Miles').parent().as('AsiaMiles');
    })

    it('should show user points', () => {
        cy.get('#pointsHeader').should($sentence => {
            const sentenceContent = $sentence.text();

            const regexPattern = /You currently have (\d+) abcPoints/;

            const match = sentenceContent.match(regexPattern);

            expect(match).to.not.be.null;
        })
    })

    it('clicking on Transfer button opens the transfer form', () => {
        cy.contains('Transfer').click();

        cy.contains('label', 'Primary Cardholder Name:')
        cy.contains('label', 'Membership ID:')
        cy.contains('label', 'Confirm Membership ID:')
        cy.contains('label', 'Transfer Amount:')
        // input fields
        cy.get('#membershipIdConfirmation').should('be.visible');
        cy.get('#transferAmount').should('be.visible');
        cy.get('#memberName').should('be.visible');
        cy.get('#membershipId').should('be.visible');
    })
    
    it('clicking on Close button closes the transfer form', () => {
        cy.contains('Transfer').click();
        cy.contains('Close').click();
        
        // input fields
        cy.get('#membershipIdConfirmation').should('not.exist');
        cy.get('#transferAmount').should('not.exist');
        cy.get('#memberName').should('not.exist');
        cy.get('#membershipId').should('not.exist');
    })

    it('requires primary cardholder name', () => {
        cy.contains('Transfer').click();

        cy.get('[type="submit"]').click();
        cy.get('#memberName').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill out this field.');
        })
    })

    it('requires membershipId', () => {
        cy.contains('Transfer').click();
        
        cy.get('#memberName').type('john low');

        cy.get('[type="submit"]').click();
        cy.get('#membershipId').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill out this field.');
        })
    })

    it('requires membershipId confirmation field', () => {
        cy.contains('Transfer').click();
        
        cy.get('#memberName').type('john low');
        cy.get('#membershipId').type('12345');

        cy.get('[type="submit"]').click();
        cy.get('#membershipIdConfirmation').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill out this field.');
        })
    })

    it('requires transfer amount', () => {
        cy.contains('Transfer').click();
        
        cy.get('#memberName').type('john low');
        cy.get('#membershipId').type('12345');
        cy.get('#membershipIdConfirmation').type('12345');

        cy.get('[type="submit"]').click();
        cy.get('#transferAmount').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill out this field.');
        })
    })
    
    it('entering transfer amount should not exceed user points', () => {
        let points;

        cy.get('#pointsHeader').should($sentence => {
            const sentenceContent = $sentence.text();

            const regexPattern = /You currently have (\d+) abcPoints/;

            const match = sentenceContent.match(regexPattern);

            expect(match).to.not.be.null;
            
            points = parseInt(match[1]);
        })
        
        cy.contains('Transfer').click();
        
        cy.get('#transferAmount').type('100000000000');
        
        cy.get('#transferAmount').then(($input) => {
            cy.wrap(parseInt($input.val())).should('be.lte', points);
        }) 
    })

    it('should successfully submit form and display points left', () => {
        cy.get('.loyalty-box h3').contains('GoJet Points').parent().as('loyaltyBox');
        cy.get('@loyaltyBox').contains("Transfer").click();
        cy.get("#memberName").type("john");
        cy.get("#membershipId").type("123456789A");
        cy.get("#membershipIdConfirmation").type("123456789A");
        cy.get("#transferAmount").type("1");
        cy.get('[data-testid="submit-button"]').click();
        cy.get('.overlay').should('be.visible').contains('div', 'Transaction submitted successfully! You have ');
    });

    it('not matching membership ID should fail submission', () => {
        cy.visit('http://localhost:3000/login'); // Visit your app's URL

        cy.contains('Login').click();

        cy.get("#loginId").type("john123");
        cy.get("#password").type("password");
        cy.get('form').submit()

        cy.get('.loyalty-box h3').contains('GoJet Points').parent().as('loyaltyBox');
        cy.get('@loyaltyBox').contains("Transfer").click();
        cy.get("#memberName").type("john");
        cy.get("#membershipId").type("123456789A");
        cy.get("#membershipIdConfirmation").type("123456789B");
        cy.get("#transferAmount").type("1");
        cy.get('[data-testid="submit-button"]').click();
        cy.get('.overlay').should('be.visible').contains('div', 'Membership ID did not match.');
    });

    it('not entering correct membership ID should fail submission', () => {
        cy.visit('http://localhost:3000/login'); // Visit your app's URL

        cy.contains('Login').click();

        cy.get("#loginId").type("john123");
        cy.get("#password").type("password");
        cy.get('form').submit()

        cy.get('.loyalty-box h3').contains('GoJet Points').parent().as('loyaltyBox');
        cy.get('@loyaltyBox').contains("Transfer").click();
        cy.get("#memberName").type("john");
        cy.get("#membershipId").type("123");
        cy.get("#membershipIdConfirmation").type("123");
        cy.get("#transferAmount").type("1");
        cy.get('[data-testid="submit-button"]').click();
        cy.get('.overlay').should('be.visible').contains('div', 'Incorrect Membership ID format.');
    });
})
