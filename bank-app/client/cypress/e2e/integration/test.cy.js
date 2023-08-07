describe('Loyalty Programs', () => {

    it('successful loads', () => {
      cy.visit('http://localhost:3000/login'); // Visit your app's URL
  
    });

    it('successful login', () => {
      cy.visit('http://localhost:3000/login'); // Visit your app's URL
     
      cy.contains('Login').click();
      
      cy.get("#loginId").type("john123");
      cy.get("#password").type("password");
      cy.get('form').submit()
      
    });

    it('successful click transfer button', () => {
      cy.visit('http://localhost:3000/login'); // Visit your app's URL
     
      cy.contains('Login').click();
      
      cy.get("#loginId").type("john123");
      cy.get("#password").type("password");
      cy.get('form').submit()
      cy.contains("Transfer").click();
      
      
    });

    it('successful fill up transfer form and click submit', () => {
      cy.visit('http://localhost:3000/login'); // Visit your app's URL
     
      cy.contains('Login').click();
      
      cy.get("#loginId").type("john123");
      cy.get("#password").type("password");
      cy.get('form').submit()

      cy.get('.loyalty-box h3').contains('GoJet Points').parent().as('loyaltyBox');
      cy.get('@loyaltyBox').contains("Transfer").click();
      cy.get("#memberName").type("john");
      cy.get("#membershipId").type("123456789A");
      cy.get("#membershipIdConfirmation").type("123456789A");
      cy.get("#transferAmount").type("1");
      cy.get('[data-testid="submit-button"]').click();
      cy.get('.overlay').should('be.visible').contains('div', 'Transaction submitted successfully! You have ');
    });

    it('filling wrong membership ID should fail submission', () => {
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

    it('transaction history should display the transaction', () => {
      
      cy.visit('http://localhost:3000/login'); // Visit your app's URL
     
      cy.contains('Login').click();

      cy.get("#loginId").type("john123");
      cy.get("#password").type("password");
      cy.get('form').submit()
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
        
        cy.contains("Close").click();
        cy.contains('Transactions').click();
    
        // Check if the reference number is displayed on the transaction history page
        cy.get('[data-testid="marketplace-container-test"]').contains(referencenumber).should('be.visible');
        }
      });
      
    });
  });
  