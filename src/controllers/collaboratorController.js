const collaboratorQueries = require("../db/queries.collaborators");
const User = require("../db/models").User;
const Wiki = require("../db/models").Wiki;
const Authorizer = require("../policies/wiki");
const wikiQueries = require("../db/queries.wikis");

module.exports = {

    create(req, res, next){
        collaboratorQueries.createCollaborator(req, (err, collaborator) => {
            if (err) {
                req.flash("notice", "User already exists.");
            }
            res.redirect(`/wikis/${req.params.wikiId}`);
        });
    },

    delete(req, res, next){
        if (req.user) {
            collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {
                if (err) {
                    req.flash("error", err);
                }
                res.redirect(req.headers.referer);
            });
        } else {
            req.flash("notice", "You must be signed in to do that!");
            res.redirect(req.headers.referer);
        }
    },

}