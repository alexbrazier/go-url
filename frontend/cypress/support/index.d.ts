/// <reference types="cypress" />

interface IKeyUrl {
  key?: string;
  url: string;
}
declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Get DOM element from e2e test handle
     * @example
     * cy.getHandle('submit')
     */
    getHandle(e2eHandle: string): Chainable<any>;
    openAddModal(): Chainable<any>;
    enterUrlDetails(details?: IKeyUrl): Chainable<any>;
    submitModal(expectedAlert?: string): Chainable<any>;
    addUrl(details?: IKeyUrl): Chainable<any>;
    getResult(key: string): Chainable<any>;
    openEdit(key: string): Chainable<any>;
  }
}
