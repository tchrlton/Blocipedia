const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wiki");
const markdown = require( "markdown" ).markdown;
const Collaborator = require('../db/models').Collaborator;
const collaboratorQueries = require("../db/queries.collaborators.js");

module.exports = {
    index(req, res, next) {
     wikiQueries.getAllWikis((err, wikis) => {
        if (err) {
            console.log(err);
            res.redirect(500, "static/index");
        } else {
            wikis.forEach((wiki) => {
                wiki.title = markdown.toHTML(wiki.title);
                wiki.body = markdown.toHTML(wiki.body);
            })
            res.render("wikis/index", {
                wikis
            });
        }
     })
    },
    new(req, res, next){
      const authorized = new Authorizer(req.user).new();

      if(authorized){
          res.render("wikis/new");
      } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect("/wikis");
      }
    },
    create(req, res, next){
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: req.body.private || false,
        userId: req.user.id
      };
      const authorized = new Authorizer(req.user, newWiki).create();
      if(authorized){
         wikiQueries.addWiki(newWiki, (err, wiki) => {
           if(err){
             res.redirect(500, "wikis/new");
           } else {
             res.redirect(303, `/wikis/${wiki.id}`);
           }
         });
       } else {
        req.flash("notice", "You are not authorized to do that.");
        res.redirect("/wikis");
       }
     },
    show(req, res, next){
      wikiQueries.getWiki(req.params.id, (err, wiki) => {
        if(err || wiki == null){
          console.log(err);
          res.redirect(404, "/");
        } else {
          let collabUsernames = [];
          wiki.collaborators.forEach((collaborator) => {
            userQueries.getUser(collaborator.userId, (err, user) => {
              if(err){
               console.log(err);
               return;
              } else {
                collabUsernames.push(user.username);
              }
              wiki.title = markdown.toHTML(wiki.title);
              wiki.body = markdown.toHTML(wiki.body);
            res.render("wikis/show", {wiki, collabUsernames});
           });
          })
        }
      });
    },
    destroy(req, res, next){
     
     wikiQueries.deleteWiki(req, (err, wiki) => {
       if(err){
         res.redirect(500, `/wikis/${wiki.id}`);
       } else {
         res.redirect(303, "/wikis");
       }
     });
    },
    edit(req, res, next){
      collaboratorQueries.checkUser(req.user.id, req.params.id, (err, collaborators) => {
       if(err || collaborators == null){
         console.log(err);
       } else {
           wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if(err || wiki == null){
              res.redirect(404, "/");
            } else {
              const authorized = new Authorizer(req.user, wiki).edit();
              if(authorized || collaborators.length > 0){
                res.render("wikis/edit", {wiki});
              } else {
                req.flash("You are not authorized to do that.");
                res.redirect(`/wikis/${req.params.id}`);   
              }
            }
          });
         }
      });
    },
    update(req, res, next){
      collaboratorQueries.checkUser(req.user.id, req.params.id, (err, collaborators) => {
       if(err || collaborators == null){
         console.log(err);
       } else {
 
         wikiQueries.updateWiki(req, req.body, (err, wiki) => {
           const authorized = new Authorizer(req.user, wiki).update();
           if(authorized || collaborators.length > 0){
             if(err || wiki == null){
               res.redirect(404, `/wikis/${req.params.id}/edit`);              
             } else {
                res.redirect(`/wikis/${wiki.id}`);              
             }
           } else {
            req.flash("You are not authorized to do that.");
            res.redirect(404, `/wikis/${req.params.id}/edit`);               
           }
         });
        }
 
      });
    },
    makePrivateForm(req, res, next){
     userQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null){
        res.redirect(404, "/");
      } else {
        res.render("wikis/show", {wiki});
      }
     });
    },
    makePrivate(req, res, next){
     wikiQueries.makePrivateWiki(req, (err, wiki) => {
      if(err || wiki == null){
        res.redirect(404, `/wikis/${req.params.id}`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
     });
    }

}