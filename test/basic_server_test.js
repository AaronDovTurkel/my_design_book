'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;


const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

describe("Basic Server Call", function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });


  it("should return status 200 on GET to root", function() {
    return chai
      .request(app)
      .get("/")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("should return status 200 on GET to /sign_up_form", function() {
    return chai
      .request(app)
      .get("/sign_up_form")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("should return status 200 on GET to /designer_pages", function() {
    return chai
      .request(app)
      .get("/designer_pages")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("should return status 200 on GET to /designer_pages/clients", function() {
    return chai
      .request(app)
      .get("/designer_pages/clients")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("should return status 200 on GET to /designer_pages/tasks", function() {
    return chai
      .request(app)
      .get("/designer_pages/tasks")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("should return status 200 on GET to /designer_pages/unique_client", function() {
    return chai
      .request(app)
      .get("/designer_pages/unique_client")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("should return status 200 on GET to /designer_pages/unique_client-projects", function() {
    return chai
      .request(app)
      .get("/designer_pages/unique_client-projects")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("should return status 200 on GET to /designer_pages/unique_client-tasks", function() {
    return chai
      .request(app)
      .get("/designer_pages/unique_client-tasks")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("should return status 200 on GET to /client_pages", function() {
    return chai
      .request(app)
      .get("/client_pages")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("should return status 200 on GET to /client_pages/projects", function() {
    return chai
      .request(app)
      .get("/client_pages/projects")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("should return status 200 on GET to /client_pages/tasks", function() {
    return chai
      .request(app)
      .get("/client_pages/tasks")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("should return status 200 on GET to /client_pages/unique_project", function() {
    return chai
      .request(app)
      .get("/client_pages/unique_project")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("should return status 200 on GET to /client_pages/unique_project-sub_projects", function() {
    return chai
      .request(app)
      .get("/client_pages/unique_project-sub_projects")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("should return status 200 on GET to /client_pages/unique_project-tasks", function() {
    return chai
      .request(app)
      .get("/client_pages/unique_project-tasks")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});
