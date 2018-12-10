const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;

module.exports = {

  getCollaborator(collaboratorId, req, callback){
    return Collaborator.findAll({ 
      where: {
        wikiId: req.params.wikiId,
        userId: collaboratorId
      } 
    })
    .then((collaborator) => {
      callback(null, collaborator);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
  },
  addCollaborator(collaboratorId, req, callback){
    return Collaborator.create({
      wikiId: req.params.wikiId,
      userId: collaboratorId,
    })
    .then((collaborator) => {
      callback(null, collaborator);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
  },
  removeCollaborator(collaboratorId, req, callback){
    return Collaborator.destroy({ 
      where: {
        wikiId: req.params.wikiId,
        userId: collaboratorId
      } 
    })
    .then((collaborator) => {
      callback(null, collaborator);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
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
  getCollaboratorsforUser(userId, callback){
    return Collaborator.findAll({
      where: {
        userId: userId
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