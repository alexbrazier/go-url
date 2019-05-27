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
Cypress.Commands.add('submitModal', expectedAlert => {
  cy.getHandle('submit').click();

  if (expectedAlert) {
    cy.getHandle('alert').contains(expectedAlert);
  }
});

Cypress.Commands.add('addUrl', ({ key, url } = {}) => {
  cy.openAddModal();

  cy.enterUrlDetails({ key, url });

  cy.submitModal('Successfully set');
});

Cypress.Commands.add('getResult', key => {
  cy.visit(`/go/${key}`);
  return cy
    .getHandle('Search Results')
    .contains('td', key)
    .parent();
});

Cypress.Commands.add('openEdit', key => {
  cy.getResult(key)
    .find('button')
    .click();
  cy.get('h6').contains(`Edit ${key}`);
});
