'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');


const should = chai.should();
const expect = chai.expect;


const { Account, Project, SubProject, SubProjectPicture } = require('../models');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);


function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

function seedData() {
    console.info('seeding blog post data');
    const seedData = [];
    for (let i = 0; i < 5; i++) {
        let firstname = faker.name.firstName();
        let lastname = faker.name.lastName();
        let username = firstname.charAt(0)+lastname;
        seedData.push({
            name: {
                firstName: firstname,
                lastName: lastname
            },
            email: username.toLowerCase()+'@'+faker.internet.domainName(),
            userName: username,
            passWord: faker.lorem.word() + faker.random.number() + faker.lorem.word()
        });
    }
    // this will return a promise
    return Account.insertMany(seedData);
  }


describe('client pages API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return new Promise((resolve, reject) => {
            resolve(seedData());
            reject(`Seeding Data Failed`);
        });
    });

    afterEach(function () {

        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    describe('GET endpoints', function () {

        it('should return all existing accounts', function () {
        let res;
        return chai.request(app)
            .get('/client_pages/explore')
            .then(_res => {
            res = _res;
            res.should.have.status(200);
            res.body.should.have.lengthOf.at.least(1);

            return Account.count();
            })
            .then(count => {
            res.body.should.have.lengthOf(count);
            });
        });

        it('should return accounts with right fields', function () {

        let resAccount;
        return chai.request(app)
            .get('/client_pages/explore')
            .then(function (res) {

            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.should.have.lengthOf.at.least(1);

            res.body.forEach(function (account) {
                account.should.be.a('object');
                account.should.include.keys('name', 'email', 'userName', 'passWord');
            });
            resAccount = res.body[0];
            return Account.
                findById(resAccount._id).
                populate({
                    path: 'projects',
                    populate: {
                        path: 'subProjects',
                        populate: { path: 'pictures'}
                    }
                });
            })
            .then(account => {
                resAccount.name.firstName.should.equal(account.name.firstName);
                resAccount.name.lastName.should.equal(account.name.lastName);
                resAccount.email.should.equal(account.email);
                resAccount.userName.should.equal(account.userName);
                resAccount.passWord.should.equal(account.passWord);
            });
        });

        it('should return a unique account', function () {
            return Account.
                findOne().
                then(account => {
                    let resAccount;
                    return chai.request(app)
                        .get(`/client_pages/${account._id}`)
                        .then(function (res) {
                            
                            res.should.have.status(200);
                            res.should.be.json;
                            res.body.should.be.a('object');
                            res.body.should.include.keys('name', 'email', 'userName', 'passWord');
                            resAccount = res.body;
                            return Account.findById(res.body._id);
                        })
                        .then(account => {
                            resAccount.name.firstName.should.equal(account.name.firstName);
                            resAccount.name.lastName.should.equal(account.name.lastName);
                            resAccount.email.should.equal(account.email);
                            resAccount.userName.should.equal(account.userName);
                            resAccount.passWord.should.equal(account.passWord);
                        });
                });
        });

        it('should return a unique project', function () {
            return Account.
                findOne().
                then(account => {
                    Project.
                        create({
                            projectTitle: faker.lorem.words(),
                            account: account._id
                        }).
                        then(project => {
                                let resProject;
                                return chai.request(app)
                                    .get(`/client_pages/projects/${project._id}`)
                                    .then(function (res) {
                                        res.should.have.status(200);
                                        res.should.be.json;
                                        res.body.should.be.a('object');
                                        res.body.should.include.keys('account', 'projectTitle', 'projectDate');
                                        resProject = res.body;
                                        return Project.findById(res.body._id);
                                    })
                                    .then(project => {
                                        resProject.account.should.equal((project.account.toString()));
                                        resProject.projectTitle.should.equal(project.projectTitle);
                                    });
                            });
                });
        });

        it('should return a unique subProject', function () {
            return Account.
                findOne().
                then(account => {
                    Project.
                        create({
                            projectTitle: faker.lorem.words(),
                            account: account._id
                        }).
                        then(project => {
                            SubProject.
                                create({
                                    subProjectTitle: faker.lorem.words(),
                                    project: project._id
                                }).
                                then(subProject => {
                                    let resSubProject;
                                    return chai.request(app)
                                        .get(`/client_pages/subProjects/${subProject._id}`)
                                        .then(function (res) {
                                            res.should.have.status(200);
                                            res.should.be.json;
                                            res.body.should.be.a('object');
                                            res.body.should.include.keys('project', 'subProjectTitle', 'info', 'pictures', 'measurements');
                                            resSubProject = res.body;
                                            return SubProject.findById(res.body._id);
                                        })
                                        .then(subProject => {
                                            console.log(subProject);
                                            resSubProject.project.should.equal((subProject.project.toString()));
                                            resSubProject.subProjectTitle.should.equal(subProject.subProjectTitle);
                                            resSubProject.info.should.equal(subProject.info);
                                            resSubProject.pictures.should.equal(subProject.pictures);
                                            resSubProject.measurements.should.equal(subProject.measurements);
                                        });
                                });
                        });
                });
        });

        it('should return a unique subProjectPicture', function () {
            return Account.
                findOne().
                then(account => {
                    Project.
                        create({
                            projectTitle: faker.lorem.words(),
                            account: account._id
                        }).
                        then(project => {
                            SubProject.
                                create({
                                    subProjectTitle: faker.lorem.words(),
                                    project: project._id
                                }).
                                then(subProject => {
                                    SubProjectPicture.
                                        create({
                                            pictureTitle: faker.lorem.words(),
                                            subProject: subProject._id,
                                            imgUrl: faker.image.imageUrl()
                                        }).
                                        then (subProjectPicture => {
                                            let resSubProjectPicture;
                                            return chai.request(app)
                                                .get(`/client_pages/subProjects/${subProjectPicture._id}`)
                                                .then(function (res) {
                                                    res.should.have.status(200);
                                                    res.should.be.json;
                                                    res.body.should.be.a('object');
                                                    res.body.should.include.keys('subProject', 'pictureTitle', 'pictureDate', 'imgUrl');
                                                    resSubProjectPicture = res.body;
                                                    return subProjectPicture.findById(res.body._id);
                                                })
                                                .then(subProjectPicture => {
                                                    console.log(subProjectPicture);
                                                    resSubProjectPicture.subProject.should.equal((subProjectPicture.subProject.toString()));
                                                    resSubProjectPicture.pictureTitle.should.equal(subProjectPicture.pictureTitle);
                                                    resSubProjectPicture.info.should.equal(subProjectPicture.info);
                                                    resSubProjectPicture.pictureDate.should.equal(subProjectPicture.pictureDate);
                                                    resSubProjectPicture.imgUrl.should.equal(subProjectPicture.imgUrl);
                                                });
                                        });
                                });
                        });
                });
        });
    });

    /*describe('POST endpoint', function () {
        // strategy: make a POST request with data,
        // then prove that the post we get back has
        // right keys, and that `id` is there (which means
        // the data was inserted into db)
        it('should add a new blog post', function () {

        const newPost = {
            title: faker.lorem.sentence(),
            author: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            },
            content: faker.lorem.text()
        };

        return chai.request(app)
            .post('/posts')
            .send(newPost)
            .then(function (res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys(
                'id', 'title', 'content', 'author', 'created');
            res.body.title.should.equal(newPost.title);
            // cause Mongo should have created id on insertion
            res.body.id.should.not.be.null;
            res.body.author.should.equal(
                `${newPost.author.firstName} ${newPost.author.lastName}`);
            res.body.content.should.equal(newPost.content);
            return BlogPost.findById(res.body.id);
            })
            .then(function (post) {
            post.title.should.equal(newPost.title);
            post.content.should.equal(newPost.content);
            post.author.firstName.should.equal(newPost.author.firstName);
            post.author.lastName.should.equal(newPost.author.lastName);
            });
        });
    });

    describe('PUT endpoint', function () {

        // strategy:
        //  1. Get an existing post from db
        //  2. Make a PUT request to update that post
        //  4. Prove post in db is correctly updated
        it('should update fields you send over', function () {
        const updateData = {
            title: 'cats cats cats',
            content: 'dogs dogs dogs',
            author: {
            firstName: 'foo',
            lastName: 'bar'
            }
        };

        return BlogPost
            .findOne()
            .then(post => {
            updateData.id = post.id;

            return chai.request(app)
                .put(`/posts/${post.id}`)
                .send(updateData);
            })
            .then(res => {
            res.should.have.status(204);
            return BlogPost.findById(updateData.id);
            })
            .then(post => {
            post.title.should.equal(updateData.title);
            post.content.should.equal(updateData.content);
            post.author.firstName.should.equal(updateData.author.firstName);
            post.author.lastName.should.equal(updateData.author.lastName);
            });
        });
    });

    describe('DELETE endpoint', function () {
        // strategy:
        //  1. get a post
        //  2. make a DELETE request for that post's id
        //  3. assert that response has right status code
        //  4. prove that post with the id doesn't exist in db anymore
        it('should delete a post by id', function () {

        let post;

        return BlogPost
            .findOne()
            .then(_post => {
            post = _post;
            return chai.request(app).delete(`/posts/${post.id}`);
            })
            .then(res => {
            res.should.have.status(204);
            return BlogPost.findById(post.id);
            })
            .then(_post => {
            // when a variable's value is null, chaining `should`
            // doesn't work. so `_post.should.be.null` would raise
            // an error. `should.be.null(_post)` is how we can
            // make assertions about a null value.
            should.not.exist(_post);
            });
        });
    });*/
});