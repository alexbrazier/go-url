/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Get DOM element from e2e test handle
     * @example
     * cy.getHandle('submit')
     */
    getHandle(e2eHandle: string): Chainable<any>;
    openAddModal(): Chainable<any>;
    enterUrlDetails(details?: { key?: string; url?: string }): Chainable<any>;
    submitModal(expectedAlert?: string): Chainable<any>;
  }
}
