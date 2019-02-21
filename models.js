'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const accountSchema = mongoose.Schema({
  name: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
  },
  email: {type: String, required: true},
  userName: {type: String, required: true},
  passWord: {type: String, required: true},
  created: {type: Date, default: Date.now}
});


accountSchema.virtual('accountName').get(function() {
  return `${this.name.firstName} ${this.name.lastName}`.trim();
});

accountSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.accountName,
    email: this.email,
    created: this.created
  };
};

const Account = mongoose.model('Account', accountSchema);

module.exports = {Account};