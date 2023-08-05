describe('Loyalty Programs', () => {
    it('Should display loyalty programs data', () => {
      cy.visit('http://localhost:3000'); // Visit your app's URL
  
      // Assuming there's a button or link to view loyalty programs
      cy.contains('Login').click();
  
      // Assert that the loyalty programs data is visible on the page
      cy.get('form').submit()

      cy.get("#loginId").type("john123");
      cy.get("#password").type("password");
      cy.get('form').submit()
    });
  });
  