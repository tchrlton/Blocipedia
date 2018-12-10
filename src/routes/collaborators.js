const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");

router.post("/wikis/:wikiId/collaborator/add", collaboratorController.add);

router.post("/wikis/:wikiId/collaborator/remove", collaboratorController.remove);

module.exports = router;