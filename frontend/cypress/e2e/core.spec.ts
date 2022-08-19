/// <reference types="Cypress" />
import { faker } from '@faker-js/faker';

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
    cy.getResult(key).find('td').eq(2).should('have.text', '0');
    cy.getResult(key)
      .contains(url)
      .then(($a) => {
        const href = $a.prop('href');
        cy.request({ url: href, followRedirect: false });
      });

    cy.visit('/');
    cy.getResult(key).find('td').eq(2).should('have.text', '1');
  });

  it('should redirect to correct url when match found', (done) => {
    const key = faker.random.uuid();
    const url = 'https://github.com/test';
    cy.addUrl({ key, url });

    cy.request(`/${key}`).then((res: any) => {
      expect(res.redirects).length.greaterThan(0);
      expect(res.redirects[0]).to.equal(`307: ${url}`);
      done();
    });
  });

  it('should redirect to correct url when match found with variables', (done) => {
    const key = faker.random.uuid();
    const url = 'https://github.com/{{$1}}/{{$2}}';
    cy.addUrl({ key, url });

    cy.request(`/${key}/alexbrazier/go-url`).then((res: any) => {
      expect(res.redirects).length.greaterThan(0);
      expect(res.redirects[0]).to.equal(
        `307: https://github.com/alexbrazier/go-url`,
      );
      done();
    });
  });

  it('should redirect to correct url when match found with variables in different order', (done) => {
    const key = faker.random.uuid();
    const url = 'https://github.com/{{$2}}/{{$1}}';
    cy.addUrl({ key, url });

    cy.request(`/${key}/go-url/alexbrazier`).then((res: any) => {
      expect(res.redirects).length.greaterThan(0);
      expect(res.redirects[0]).to.equal(
        `307: https://github.com/alexbrazier/go-url`,
      );
      done();
    });
  });
});
