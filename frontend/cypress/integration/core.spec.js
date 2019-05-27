/// <reference types="Cypress" />
import faker from 'faker';

context('Core', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have redirected to /go', () => {
    cy.location('pathname').should('eq', '/go');
  });

  it('should render most popular table', () => {
    cy.getHandle('Most Popular').contains('h3', 'Most Popular');
  });

  it('should redirect to app if not found', () => {
    const key = faker.random.uuid();
    const url = faker.internet.url();
    cy.visit(`/${key}`);
    cy.getHandle('alert').contains('was not found');
    cy.getHandle('Search Results').contains(
      'No results found. Help others by adding it.',
    );

    cy.addUrl({ key, url });
    cy.getResult(key);
  });

  it('should increase count when clicking on link', () => {
    const key = faker.random.uuid();
    const url = faker.internet.url();

    cy.addUrl({ key, url });
    // Check count is 0
    cy.getResult(key)
      .find('td')
      .eq(2)
      .should('have.text', '0');
    cy.getResult(key)
      .contains(url)
      .then($a => {
        const href = $a.prop('href');
        cy.request({ url: href, followRedirect: false });
      });

    cy.visit('/');
    cy.getResult(key)
      .find('td')
      .eq(2)
      .should('have.text', '1');
  });
});
