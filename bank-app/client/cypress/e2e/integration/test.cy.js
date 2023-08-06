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
      cy.get("#transferAmount").type("100");
      cy.get('[data-testid="submit-button"]').click();
    });

  });
  