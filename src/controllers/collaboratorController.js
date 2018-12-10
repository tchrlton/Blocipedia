const collaboratorQueries = require("../db/queries.collaborators.js");
const userQueries = require("../db/queries.users.js");

module.exports = {

  add(req, res, next){
    if(req.user){
      let collaboratorUsername = req.body.username;
      let collaboratorId;
      userQueries.getUserByUsername(collaboratorUsername, (err, user) => {
        if(err){
          console.log(err);
          req.flash("error", err);
          res.redirect("/");
        } else {
          collaboratorId = user[0].id;

          collaboratorQueries.getCollaborator(collaboratorId, req, (err, collaborator) => {
            if(collaborator.length > 0){
              req.flash("user is already marked as collaborator");
            } else {

              collaboratorQueries.addCollaborator(collaboratorId, req, (err, collaborator) => {
                if(err){
                  req.flash("error", err);
                } else {
                  req.flash("notice", "You've added ", collaboratorUsername, " as a collaborator on this wiki.");
                  res.redirect("/");          
                }
              });

            }
          })          

        }
      });

    } else {
      req.flash("notice", "You must be signed in to do that.")
    }
  },

  remove(req, res, next){
    if(req.user){
      let collaboratorUsername = req.body.username;
      let collaboratorId;
      userQueries.getUserByUsername(collaboratorUsername, (err, user) => {
        if(err){
          console.log(err);
          req.flash("error", err);
          res.redirect("/");
        } else {
          collaboratorId = user[0].id;
          collaboratorQueries.removeCollaborator(collaboratorId, req, (err, collaborator) => {
            if(err){
              req.flash("error", err);
            } else {
              req.flash("notice", "You've removed ", collaboratorUsername, " as a collaborator on this wiki.");
              res.redirect("/");          
            }
          });
        }
      });

    } else {
      req.flash("notice", "You must be signed in to do that.")
    }
  }
}