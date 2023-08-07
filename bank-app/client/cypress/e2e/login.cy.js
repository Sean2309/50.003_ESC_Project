// This cypress test file tests login functionality, authentication, and token existence checks
describe('/login', () => {
    const url = 'http://localhost:3000'
    const bankAppServer = 'http://localhost:3001'

    beforeEach(() => {
        cy.visit(url + '/login');
    })

    it('shows login page', () => {
        // labels
        cy.contains('label', 'User ID:')
        cy.contains('label', 'Password:')
        // input fields
        cy.get('#loginId').should('be.visible');
        cy.get('#password').should('be.visible');
    })
    it('requires loginId', () => {
        cy.get('#password').type('password');

        cy.get('[type="submit"]').click();
        cy.get('#loginId').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill out this field.');
        })
    })
    it('requires password', () => {
        cy.get('#loginId').type('john123');

        cy.get('[type="submit"]').click();
        cy.get('#password').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill out this field.');
        })
    })
    it('links to /marketplace', () => {
        cy
            .contains('Marketplace')
            .should('have.attr', 'href', '/marketplace');
    })
    it('links to /transactions', () => {
        cy
            .contains('Transactions')
            .should('have.attr', 'href', '/transactions');
    })
    it('navigates to /marketplace on successful login', () => {
        cy.get("#loginId").type("john123");
        cy.get("#password").type("password");
        cy.get('form').submit();

        cy.url().should('include', '/marketplace');
    })
    it('navigating to /marketplace redirects to /login if not logged in', () => {
        cy
            .contains('Marketplace')
            .click();

        cy.url().should('include', 'login');
    })
    it('navigating to /transactions redirects to /login if not logged in', () => {
        cy
            .contains('Transactions')
            .click();

        cy.url().should('include', 'login');
    })

    it('successful login contains token in cookies, status code 200', () => {
        cy.request({
            method: 'POST',
            form: true,
            url: `${bankAppServer}/login`,
            body: { 'loginId': 'john123', 'password': 'password' }
        })
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.headers['set-cookie']).to.exist;
            })
    })
})