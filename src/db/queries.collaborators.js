const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Authorizer = require("../policies/wiki");

module.exports = {

    createCollaborator(req, callback) {

        User.findAll({
            where: {
                username: req.body.collaborator
            }
        })
        .then((users)=>{
            if(!users[0]){
                return callback("User does not exist.");
            }
            Collaborator.findAll({
                where: {
                    userId: users[0].id,
                    wikiId: req.params.wikiId,
                }
            })
            .then((collaborators)=>{
                if(collaborators.length != 0){
                    return callback(`${req.body.collaborator} is already a collaborator on this wiki.`);
                }
                let newCollaborator = {
                    userId: users[0].id,
                    wikiId: req.params.wikiId
                };
                return Collaborator.create(newCollaborator)
                .then((collaborator) => {
                    callback(null, collaborator);
                })
                .catch((err) => {
                    callback(err, null);
                })
            })
            .catch((err)=>{
                callback(err, null);
            })
        })
        .catch((err)=>{
            callback(err, null);
        })
    },
    getCollaboratorforWiki(wikiId, callback){
        return Collaborator.findAll({
          where: {
            wikiId: wikiId
          }
        })
        .then((collaborators) => {
          callback(null, collaborators);
        })
        .catch((err) => {
          console.log(err);
          callback(err);
        });
    },
    getUsers(id, callback) {
        let result = {};
        User.findById(id)
            .then((user) => {
                console.log(user);
              if (!user) {
                  callback(404);
              } else {
                result["user"] = user;
                Collaborator.scope({
                  method: ["userCollaborationsFor", id]
                }).all()
                .then((collaborators) => {
                    result["collaborators"] = collaborators;
                    callback(null, result);
                })
                .catch((err) => {
                   callback(err);
                })
              }
            })
    },
    deleteCollaborator(req, callback) {
        let userId = req.body.collaborator;
        let wikiId = req.params.wikiId;

        const authorized = new Authorizer(req.user, wiki).destroy();

        if (authorized) {
            console.log("I am authorized!");
            Collaborator.destroy({
                    where: {
                        id: userId,
                        wikiId: wikiId
                    }
                })
                .then((deletedRecordsCount) => {
                    callback(null, deletedRecordsCount);
                    console.log(deletedRecordsCount);
                })
                .catch((err) => {
                    console.log(err);
                    callback(err);
                });
                console.log(userId);
                console.log(wikiId);
        } else {
            req.flash("notice", "You are not authorized to do that.");
            console.log("not authorized");
            callback(401);
        }
    },

    checkUser(userId, wikiId, callback){
        return Collaborator.findAll({
          where: {
            userId: userId,
            wikiId: wikiId
          }
        })
        .then((collaborators) => {
          callback(null, collaborators);
        })
        .catch((err) => {
          console.log(err);
          callback(err);
        });
    },

}