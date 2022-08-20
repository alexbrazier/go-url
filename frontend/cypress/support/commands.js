import { faker } from '@faker-js/faker';
import { getKey } from './utils';

Cypress.Commands.add('getHandle', (e2eHandle) => {
  return cy.get(`[data-e2e="${e2eHandle}"]`);
});

Cypress.Commands.add('openAddModal', () => {
  cy.getHandle('add-button').click();

  cy.getHandle('modal').contains('Add new url');
});

Cypress.Commands.add(
  'enterUrlDetails',
  ({ key = getKey(), url = faker.internet.url() } = {}) => {
    cy.get('input#key').clear().type(key);

    cy.get('input#url').clear().type(url, { parseSpecialCharSequences: false });
  },
);
Cypress.Commands.add('submitModal', (expectedAlert) => {
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

Cypress.Commands.add('getResult', (key) => {
  cy.visit(`/go/${key}`);
  return cy.getHandle('Search Results').contains('td', key).parent();
});

Cypress.Commands.add('openEdit', (key) => {
  cy.getResult(key).find('button').click();
  cy.getHandle('modal').contains(`Edit ${key}`);
});
