/// <reference types="Cypress" />

context('Core', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should have redirected to /go', () => {
    cy.location('pathname').should('eq', '/go');
  });

  it('should render most popular table', () => {
    cy.get('[data-e2e="main-table"]')
      .contains('h3', 'Most Popular');
  });
});
