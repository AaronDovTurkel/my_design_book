'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const expect = chai.expect;


const {app, runServer, closeServer} = require('../server');
const {DATABASE_URL} = require('../config');

chai.use(chaiHttp);

describe("Basic Server Call", function() {

  before(function() {
    return runServer(DATABASE_URL);
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
});
