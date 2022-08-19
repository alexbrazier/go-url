/// <reference types="Cypress" />

import { faker } from '@faker-js/faker';
import { getKey } from '../support/utils';

context('Edit', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should open modal when edit button clicked', () => {
    const key = getKey();
    const url = faker.internet.url();
    cy.addUrl({ key, url });

    cy.openEdit(key);

    cy.get('input#url').should('have.value', url);
    cy.get('input#url').clear().type(getKey());
    cy.submitModal('provided are invalid');
    const newUrl = faker.internet.url();
    cy.get('input#url').clear().type(newUrl);
    cy.submitModal('Successfully set');

    cy.getResult(key).contains(newUrl);
  });
});
