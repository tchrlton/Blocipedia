const collaboratorQueries = require("../db/queries.collaborators");
const User = require("../db/models").User;
const Wiki = require("../db/models").Wiki;
const Authorizer = require("../policies/wiki");
const wikiQueries = require("../db/queries.wikis");

module.exports = {

    show(req, res, next) {
        wikiQueries.getWikis(req.params.wikiId, (err, result) => {
            wiki = result["wiki"];
            collaborators = result["collaborators"];

            if (err || result.wiki == null) {
                res.redirect(404, "/");
            } else {
                const authorized = new Authorizer(req.user, wiki, collaborators).edit();
                if (authorized) {
                    res.render("collaborators/show", {
                        wiki,
                        collaborators
                    });
                } else {
                    req.flash("notice", "You are not authorized to do that");
                    res.redirect(`/wikis/${req.params.wikiId}`);
                }
            }
        });
    },

    collaborators(req, res, next){
        User.findOne({where: {username: req.body.username}})
        .then(user => {
          if (user) {
          let collaborator = Collaborator.build({
          wikiId: req.params.id,
          userId: user.id
          });
        
            collaborator.save();
        
            req.flash("notice", "Collaborator has been successfully added!");
            res.redirect(`/wikis/${req.params.id}`);
          } else {
                req.flash("notice", "Collaborator username not found.  Please try again.");
                res.redirect(`/wikis/${req.params.id}/edit`);
            }
            })
            .catch(err => {
                req.flash("error", "Error saving wiki.  Please try again.");
                res.redirect(`/wikis/${req.params.id}/edit`);
            });
    },

    create(req, res, next){
        collaboratorQueries.createCollaborator(req, (err, collaborator) => {
            console.log('*************CREATING COLLAB*********************');
            if (err) {
                console.log(err);
                req.flash("notice", "User already exists.");
            }
            res.redirect(`/wikis/${req.params.wikiId}/collaborators`);
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