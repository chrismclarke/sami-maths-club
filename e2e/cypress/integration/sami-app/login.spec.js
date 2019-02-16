/// <reference types="Cypress" />

context("Load problems", () => {
  beforeEach(() => {
    // slow workaround to make sure fully rendered before click (see cypress issue #695)
    cy.visit("/");
  });
  it("should show login button", () => {
    cy.get("#loginButton");
  });
  it("should open login modal", () => {
    cy.get("#loginButton")
      .click()
      .get("app-login");
  });
});
