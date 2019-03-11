const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

router.use(express.json());


const { Account, Project, SubProject, SubProjectPicture } = require('./models');


// get section //

// get - find() -  all accounts
router.get("/explore", (req, res) => {
    Account.
        find().
        populate({
            path: 'projects',
            populate: {
                path: 'subProjects',
                populate: { path: 'pictures'}
            }
        }).
        then(accounts => {
            res.status(200).json(accounts);
            console.log(`${accounts}`);
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// get - findById() - find account by id
router.get("/:id", (req, res) => {
    Account.
        findById(req.params.id).
        populate({
            path: 'projects',
            populate: {
                path: 'subProjects',
                populate: { path: 'pictures'}
            }
        }).
        then(accounts => {
            res.status(200).json(accounts);
            console.log(`${accounts}`);
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// get - findById() - find unique client's -> projects
router.get("/projects/:id", (req, res) => {
    Project.
        findById(req.params.id).
        populate({
            path: 'subProjects',
            populate: {
                path: 'pictures'
            }
        }).
        then(projects => {
            res.status(200).json(projects);
            console.log(`${projects}`);
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// get - findById() - find unique client's -> project's -> subProjects
router.get("/subProjects/:id", (req, res) => {
    SubProject.
        findById(req.params.id).
        populate('pictures').
        then(subProjects => {
            res.status(200).json(subProjects);
            console.log(`${subProjects}`);
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// get - findById() - find unique client's -> project's -> subProjects -> unique picture
router.get("/subProjectPicture/:id", (req, res) => {
    SubProjectPicture.
        findById(req.params.id).
        populate('pictures').
        then(subProjectPicture => {
            res.status(200).json(subProjectPicture);
            console.log(`${subProjectPicture}`);
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// post section //
// post - findById() - post to unique client -> new project
router.post("/project/:id", (req, res) => {
    const requiredFields = ['projectTitle'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    };

    Project.
        create({
            projectTitle: req.body.projectTitle,
            account: req.params.id
        }).
        then(project => {
            SubProject.
                create({
                    subProjectTitle: `Empty subProject One`,
                    project: project._id
                }).
                then(subProject => {
                    SubProjectPicture.
                        create({
                            pictureTitle: `Empty Picture One`,
                            subProject: subProject._id,
                            imgUrl: 'fakeUrl.furl'
                        }).
                        then (subProjectPicture => {
                            subProject.pictures.push(subProjectPicture);
                            subProject.info.push('Empty info message...');
                            subProject.measurements.push({
                              title: "Empty Measurement Title",
                              content: 'Empty measurement message...'
                            });
                            subProject.save(function(err){
                              if(err) return console.log(err.stack);
                            });
                            project.subProjects.push(subProject);
                            project.save(function(err){
                              if(err) return console.log(err.stack);
                            }).
                            then(() => {
                                Account.
                                    findById(req.params.id).
                                    then(updatedUser => {
                                        updatedUser.projects.push(project);
                                        updatedUser.save(function(err){
                                            if(err) return console.log(err.stack);
                                            console.log("user updated with a fully populated new project");
                                        });
                                    }).
                                    then((updatedUser) => {
                                        res.status(201).json(updatedUser);
                                        console.log(`${updatedUser}`);
                                    });
                            });  
                        });
                });
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// post - create - post to unique client -> unique project -> new subProject
router.post("/subProject/:id", (req, res) => {
    const requiredFields = ['subProjectTitle'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    SubProject.
        create({
            subProjectTitle: req.body.subProjectTitle,
            project: req.params.id
        }).
        then(subProject => {
            SubProjectPicture.
                create({
                    pictureTitle: `Empty Picture One`,
                    subProject: subProject._id,
                    imgUrl: 'fakeUrl.furl'
                }).
                then (subProjectPicture => {
                    subProject.pictures.push(subProjectPicture);
                    subProject.info.push('Empty info message...');
                    subProject.measurements.push({
                        title: "Empty Measurement Title",
                        content: 'Empty measurement message...'
                    });
                    subProject.save(function(err){
                        if(err) return console.log(err.stack);
                    });
                    Project.
                        findById(req.params.id).
                        then(updatedProject => {
                            updatedProject.subProjects.push(subProject);
                            updatedProject.save(function(err){
                                if(err) return console.log(err.stack);
                                console.log("project updated with a fully populated new subProject");
                            });
                        })
                        .then(() => {
                            res.status(201).json(updatedProject);
                            console.log(`${updatedProject}`);
                        });
                });
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// post - create - post to unique client -> unique project -> unique subProject -> new picture
router.post("/subProjectPicture/:id", (req, res) => {
    const requiredFields = ['pictureTitle', 'imgUrl'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    SubProjectPicture.
        create({
            pictureTitle: req.body.pictureTitle,
            subProject: req.params.id,
            imgUrl: req.body.imgUrl
        }).
        then (subProjectPicture => {
            SubProject.
                findById(req.params.id).
                then(updatedSubProject => {
                    updatedSubProject.pictures.push(subProjectPicture);
                    updatedSubProject.save(function(err){
                        if(err) return console.log(err.stack);
                    });
                })
                .then(() => {
                    res.status(201).json(updatedSubProject);
                    console.log(`${updatedSubProject}`);
                });
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// post - add info to subProject
router.post("/subProjectInfo/:id", (req, res) => {
    const requiredFields = ['info'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    SubProject.
        findById(req.params.id).
        then(subProject => {
            subProject.info.push(req.body.info)
            subProject.save(function(err){
                if(err) return console.log(err.stack);
                console.log("added info to subProject");
            
        })
        .then(() => {
            res.status(201).json(subProject);
            console.log(`${subProject}`);
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// post - add measurement to subProject
router.post("/subProjectMeasurements/:id", (req, res) => {
    const requiredFields = ['title', 'content'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    SubProject.
        findById(req.params.id).
        then(subProject => {
            subProject.measurements.push(req.body)
            subProject.save(function(err){
                if(err) return console.log(err.stack);
                console.log("added measurement to subProject");
        }).
        then(() => {
            res.status(201).json(subProject);
            console.log(`${subProject}`);
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});


// put section //
// put - update Account info
router.put("/:id", (req, res) => {
    const updated = {};
    const updateableFields = ['name', 'email', 'userName', 'passWord'];
    updateableFields.forEach(field => {
    if (field in req.body) {
        updated[field] = req.body[field];
    }
    });

    Account.
        findByIdAndUpdate(req.params.id, { $set: updated }, { new: true }).
        then(updatedAccount => {
            console.log(updatedAccount);
            res.status(200).json(updatedAccount);
        }).
        catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong' });
        });
});

// put - update Project info
router.put("/project/:id", (req, res) => {
    const updated = {};
    const updateableFields = ['projectTitle'];
    updateableFields.forEach(field => {
    if (field in req.body) {
        updated[field] = req.body[field];
    }
    });

    Project.
        findByIdAndUpdate(req.params.id, { $set: updated }, { new: true }).
        then(updatedProject => {
            console.log(updatedProject);
            res.status(200).json(updatedProject);
        }).
        catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong' });
        });
});

// put - update subProjectTitle info
router.put("/subProjectTitle/:id", (req, res) => {
    const updated = {};
    const updateableFields = ['subProjectTitle'];
    updateableFields.forEach(field => {
    if (field in req.body) {
        updated[field] = req.body[field];
    }
    });

    SubProject.
        findByIdAndUpdate(req.params.id, { $set: updated }, { new: true }).
        then(updatedSubProject => {
            console.log(updatedSubProject);
            res.status(200).json(updatedSubProject);
        }).
        catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong' });
        });
});

// put - update subProjectPicture info
router.put("/subProjectPicture/:id", (req, res) => {
    const updated = {};
    const updateableFields = ['pictureTitle', 'imgUrl'];
    updateableFields.forEach(field => {
    if (field in req.body) {
        updated[field] = req.body[field];
    }
    });

    SubProjectPicture.
        findByIdAndUpdate(req.params.id, { $set: updated }, { new: true }).
        then(updatedSubProjectPicture => {
            console.log(updatedSubProjectPicture);
            res.status(200).json(updatedSubProjectPicture);
        }).
        catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong' });
        });
});


// delete section //
// delete - All Accounts, Projects, SubProjects, and SubProjectPictures
router.delete("/explore", (req, res) => {
    Account.
        deleteMany().
        then(() => console.log(`All Accounts Wiped`)).
        catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong' });
        });
    Project.
        deleteMany().
        then(() => console.log(`All Projects Wiped`)).
        catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong' });
        });
    SubProject.
        deleteMany().
        then(() => console.log(`All SubProjects Wiped`)).
        catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong' });
        });
    SubProjectPicture.
        deleteMany().
        then(() => console.log(`All SubProjectPictures Wiped`)).
        catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong' });
        });
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

// delete - unique account and children
router.delete("/:id", (req, res) => {
    Account.
        findById(req.params.id).
        then(account => {
            Project.
                find({account: req.params.id}).
                then(projects => {
                    for (let i = 0; i < projects.length; i++) {
                        SubProject.
                            find({project: projects[i]._id})
                            .then(subProjects => {
                                for (let i = 0; i < subProjects.length; i++) {
                                    SubProjectPicture.
                                        deleteMany({subProject: subProjects[i]._id})
                                        .then(() => {
                                            console.log(`SubProjectPictures Wiped`);
                                        });
                                };
                            });
                        SubProject.
                            deleteMany({project: projects[i]._id})
                            .then(() => {
                                console.log(`SubProjects Wiped`);
                            });
                    };
                    Project.
                        deleteMany({account: req.params.id})
                        .then(() => {
                            console.log(`Projects Wiped`);
                        });
                });
            Account.
                deleteOne({_id: req.params.id})
                .then(() => {
                    console.log(`Accounts Wiped`);
                    res.status(204).end();
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });
});

// delete - unique project and children
router.delete("/project/:id", (req, res) => {
        Project.
            findById(req.params.id).
            then(project => {
                SubProject.
                    find({project: project._id})
                    .then(subProjects => {
                        for (let i = 0; i < subProjects.length; i++) {
                            SubProjectPicture.
                                deleteMany({subProject: subProjects[i]._id})
                                .then(() => {
                                    console.log(`SubProjectPictures Wiped`);
                                });
                        };
                    });
                SubProject.
                    deleteMany({project: project._id})
                    .then(() => {
                        console.log(`SubProjects Wiped`);
                    });
                Project.
                    deleteMany({_id: req.params.id})
                    .then(() => {
                        console.log(`Project Wiped`);
                        
                    });
                Account.
                    findOne({projects: req.params.id})
                    .then(account => {
                        account.projects.remove(req.params.id);
                        account.save(function (err) {
                            if (err) return handleError(err);
                        });
                        console.log(`Project Wiped from Account`);
                        res.status(204).end();
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'something went terribly wrong' });
            });
});

// delete - unique subProject and children
router.delete("/subProject/:id", (req, res) => {
    SubProject.
        findById(req.params.id)
        .then(subProject => {
            SubProjectPicture.
                deleteMany({subProject: subProject._id})
                .then(() => {
                    console.log(`SubProjectPictures Wiped`);
                });
            SubProject.
                deleteMany({_id: req.params.id})
                .then(() => {
                    console.log(`SubProjects Wiped`);
                });
            Project.
                findOne({subProjects: req.params.id})
                .then(project => {
                    project.subProjects.remove(req.params.id);
                    project.save(function (err) {
                        if (err) return handleError(err);
                    });
                    console.log(`subProject Wiped from Project`);
                    res.status(204).end();
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });
});

// delete - unique subProjectPicture
router.delete("/subProjectPicture/:id", (req, res) => {
    SubProjectPicture.
        deleteMany({_id: req.params.id})
        .then(() => {
            console.log(`SubProjectPicture Wiped`);
            SubProject.
                findOne({pictures: req.params.id})
                .then(subProject => {
                    subProject.pictures.remove(req.params.id);
                    subProject.save(function (err) {
                        if (err) return handleError(err);
                    });
                    console.log(`subProjectPicture Wiped from subProject`);
                    res.status(204).end();
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });
});

module.exports = router; 