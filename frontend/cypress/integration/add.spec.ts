/// <reference types="Cypress" />

import faker from 'faker';

context('Add', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should open modal when add button clicked and not allow invalid urls', () => {
    cy.openAddModal();

    cy.enterUrlDetails({ url: faker.random.uuid() });

    cy.submitModal('provided are invalid');
  });

  it('should allow the user to cancel', () => {
    cy.openAddModal();

    cy.getHandle('cancel').click();
  });

  it('should allow valid urls', () => {
    cy.openAddModal();

    cy.enterUrlDetails();

    cy.submitModal('Successfully set');
  });

  it('should not allow key with invalid characters', () => {
    cy.openAddModal();

    cy.enterUrlDetails({ key: 'test$hello' });

    cy.submitModal('The key provided is not valid');
  });

  it('should allow url with params included', () => {
    cy.openAddModal();

    cy.enterUrlDetails({ url: `${faker.internet.url()}/{{$1}}/test` });

    cy.submitModal('Successfully set');
  });

  it('should allow valid alias', () => {
    cy.openAddModal();

    const key = faker.random.uuid();

    cy.enterUrlDetails({ key });

    cy.submitModal('Successfully set');

    // Should allow alias to be set
    cy.openAddModal();
    const key2 = faker.random.uuid();
    cy.enterUrlDetails({ key: key2, url: key });

    cy.submitModal('Successfully set');

    // Should not allow alias of alias
    cy.openAddModal();
    cy.enterUrlDetails({ url: key2 });

    cy.submitModal('You cannot alias an alias');
  });
});
