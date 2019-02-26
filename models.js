'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//schema
const profileSchema = mongoose.Schema({
  taggedAccount: {type: String, required: true},
  gender: {type: String, required: true},
  dob: {type: Date, required: true},
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

const accountSchema = mongoose.Schema({
  name: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
  },
  email: {type: String, required: true},
  accountType: {type: String, required: true},
  userName: {type: String, required: true},
  passWord: {type: String, required: true}, 
  taggedAccounts: {type: String, required: false}, // going to be populated with accountProfiles
  profile: [profileSchema], // going to be populated with linked profile
  projects: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' } // going to be populated with linked projects
});


const projectSchema = mongoose.Schema({
  projectTitle: {type: String, required: true},
  taggedAccount: {type: String, required: true},
  projectDate: {type: Date, default: Date.now},
  taggedWorkers: {type: String, required: false},
  subProjects: { type: mongoose.Schema.Types.ObjectId, ref: 'SubProject' } // going to be populated with linked subProjects
});

const subProjectSchema = mongoose.Schema({
  taggedProject: {type: String, required: true},
  subProjectTitle: {type: String, required: true},
  info: {type: String, required: false},
  pictures: { type: mongoose.Schema.Types.ObjectId, ref: 'SubProjectPicture' }, // populated with tagged pictures
  measurements: {
    title: {type: String, required: false},
    content:  {type: String, required: false}
  },
  taggedWorkers: {type: String, required: false}
});

const commentSchema = mongoose.Schema({
  commentAuthor: {type: String, required: false},
  content: {type: String, required: false}
})

const subProjectPictureSchema = mongoose.Schema({
  taggedSubProject:  {type: String, required: true},
  pictureTitle:  {type: String, required: true},
  pictureDate: {type: Date, default: Date.now},
  pictureComments: [commentSchema]
});

//pre-hook
accountSchema.pre('find', function(next) {
  projectSchema.pre('find', function(next) {
    this.populate('subProjects');
    next();
    subProjectSchema.pre('find', function(next) {
      this.populate('pictures');
      next();
    });
  });
  this.populate('name');
  this.populate('profile');
  this.populate('projects');
  next();
});

accountSchema.pre('findOne', function(next) {
  projectSchema.pre('find', function(next) {
    this.populate('subProjects');
    next();
    subProjectSchema.pre('find', function(next) {
      this.populate('pictures');
      next();
    });
  });
  this.populate('name');
  this.populate('profile');
  this.populate('projects');
  next();
});

// virtual
accountSchema.virtual('accountName').get(function() {
  return `${this.name.firstName} ${this.name.lastName}`.trim();
});

profileSchema.virtual('profileAddress').get(function() {
  return `${this.address.streetAddress}, ${this.address.city}, ${this.address.state}, ${this.address.zipCode}`.trim();
});

profileSchema.virtual('profileLocation').get(function() {
  return `${this.address.state}`.trim();
});

//serialize
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

projectSchema.methods.serialize = function() {
  return {
    projectTitle: this.projectTitle,
    taggedAccount: this.taggedAccount,
    projectDate: this.projectDate,
    taggedWorkers: this.taggedWorkers,
    subProjects: this.subProjects
  };
};

subProjectSchema.methods.serialize = function() {
  return {
    taggedProject: this.taggedProject,
    subProjectTitle: this.subProjectTitle,
    info: this.info,
    pictures: this.pictures, 
    measurements: {
      title: this.title,
      content:  this.content
    },
    taggedWorkers: this.taggedWorkers
  };
};


// export
const Account = mongoose.model('Account', accountSchema);

const Profile = mongoose.model('Profile', profileSchema);

const Project = mongoose.model('Project', projectSchema);

const SubProject = mongoose.model('SubProject', subProjectSchema);

const SubProjectPicture = mongoose.model('SubProjectPicture', subProjectPictureSchema);

module.exports = { Account, Profile, Project, SubProject, SubProjectPicture };