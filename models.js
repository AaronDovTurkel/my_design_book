'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const accountSchema = mongoose.Schema({
  name: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
  },
  email: {type: String, required: true},
  accountType: {type: String, required: true},
  userName: {type: String, required: true},
  passWord: {type: String, required: true}, 
  taggedAccounts: {type: String, required: false},
  profile: {type: String, required: false}
});

const profileSchema = mongoose.Schema({
  gender: {type: String, required: true},
  dob: {type: String, required: true},
  address: {
    streetAddress: {type: String, required: false},
    city: {type: String, required: false},
    state: {type: String, required: false},
    zipCode: {type: String, required: false}
  },
  designStyle: {type: String, required: false},
  profileImage: {type: String, required: false},
  personalInfo: {type: String, required: false}
});

accountSchema.virtual('accountName').get(function() {
  return `${this.name.firstName} ${this.name.lastName}`.trim();
});

profileSchema.virtual('profileAddress').get(function() {
  return `${this.address.streetAddress}, ${this.address.city}, ${this.address.state}, ${this.address.zipCode}`.trim();
});

profileSchema.virtual('profileLocation').get(function() {
  return `${this.address.state}`.trim();
});

accountSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.accountName,
    userName: this.userName,
    email: this.email
  };
};

profileSchema.methods.serialize = function() {
  return {
    profileImage: this.profileImage,
    designStyle: this.designStyle,
    personalInfo: this.personalInfo,
    location: this.profileLocation
  };
};

const Account = mongoose.model('Account', accountSchema);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = { Account, Profile };