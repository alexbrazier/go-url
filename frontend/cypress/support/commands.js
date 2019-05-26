import faker from 'faker';

Cypress.Commands.add('getHandle', e2eHandle => {
  return cy.get(`[data-e2e="${e2eHandle}"]`);
});

Cypress.Commands.add('openAddModal', () => {
  cy.getHandle('add-button').click();

  cy.getHandle('modal').contains('h6', 'Add new url');
});

Cypress.Commands.add(
  'enterUrlDetails',
  ({ key = faker.random.uuid(), url = faker.internet.url() } = {}) => {
    cy.get('input#key').type(key);

    cy.get('input#url').type(url);
  },
);
Cypress.Commands.add('submitModal', (expectedAlert) => {
  cy.getHandle('submit')
    .contains('span', 'Add')
    .click();

  if (expectedAlert) {
    cy.getHandle('alert').contains(expectedAlert);
  }
});
