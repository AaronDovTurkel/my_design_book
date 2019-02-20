const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/designer-pages/designer-home.html");
});

router.get("/clients", (req, res) => {
    res.sendFile(__dirname + "/views/pages/designer-pages/designer-clients.html");
});

router.get("/tasks", (req, res) => {
    res.sendFile(__dirname + "/views/pages/designer-pages/designer-tasks.html");
});

router.get("/unique_client", (req, res) => { //TODO: will be replaced with /:id
    res.sendFile(__dirname + "/views/pages/designer-pages/designer-unique_client-pages/designer-unique_client-projects.html");
});

router.get("/unique_client-projects", (req, res) => { //TODO: will be replaced with /:id
    res.sendFile(__dirname + "/views/pages/designer-pages/designer-unique_client-pages/designer-unique_client-projects.html");
});

router.get("/unique_client-tasks", (req, res) => { //TODO: will be replaced with /:id
    res.sendFile(__dirname + "/views/pages/designer-pages/designer-unique_client-pages/designer-unique_client-tasks.html");
});

module.exports = router;