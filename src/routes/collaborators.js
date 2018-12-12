const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");
const User = require("../../src/db/models").User;

router.get("/wikis/:id/collaborators", collaboratorController.show);
router.post("/wikis/:id/collaborators/create", collaboratorController.create);
router.post("/wikis/:id/collaborators/delete", collaboratorController.delete);

module.exports = router;