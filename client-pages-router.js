const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

router.get("/projects", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-projects.html");
});

router.get("/tasks", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-tasks.html");
});

router.get("/unique_project", (req, res) => { //TODO: will be replaced with /:id
    res.sendFile(__dirname + "/views/pages/client-pages/client-unique_project-pages/client-unique_project-sub_projects.html");
});

router.get("/unique_project-sub_projects", (req, res) => { //TODO: will be replaced with /:id
    res.sendFile(__dirname + "/views/pages/client-pages/client-unique_project-pages/client-unique_project-sub_projects.html");
});

router.get("/unique_project-tasks", (req, res) => { //TODO: will be replaced with /:id
    res.sendFile(__dirname + "/views/pages/client-pages/client-unique_project-pages/client-unique_project-tasks.html");
});

module.exports = router;