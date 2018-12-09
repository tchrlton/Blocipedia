const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");
const helper = require("../auth/helpers");

router.get("/wikis", wikiController.index);
router.get("/wikis/new", wikiController.new);
router.post("/wikis/create", helper.ensureAuthenticated, wikiController.create);
router.post("/wikis/:id/destroy", helper.ensureAuthenticated, wikiController.destroy);
router.get("/wikis/:id/edit", helper.ensureAuthenticated, wikiController.edit);
router.post("/wikis/:id/update", wikiController.update);
router.get("/wikis/:id", wikiController.show);

module.exports = router;