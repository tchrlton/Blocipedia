const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;
const Authorizer = require("../policies/wiki");

module.exports = {
  getAllWikis(callback){
    return Wiki.all({
      include: [{
        model: Collaborator,
        as: "collaborators"
      }]
    })
     .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    })
  },
  addWiki(newWiki, callback){
    return Wiki.create(newWiki)
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },
  getWiki(id, callback){
     return Wiki.findById(id, {
       include: [{
         model: Collaborator,
         as: 'collaborators'
        }]
     })
     .then((wiki, collaborators) => {
       callback(null, wiki, wiki.collaborators);
     })
     .catch((err) => {
       callback(err);
     })
  },
  getPublicWikis(callback){
    return Wiki.findAll({
      where: {private: false},
      include: [{
        model: Collaborator,
        as: "collaborators"
      }]
    })
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    })
  },
  getPrivateWikis(callback){
    return Wiki.findAll({
      where: {private: true},
      include: [{
        model: Collaborator,
        as: "collaborators"
      }]
    })
    .then((privatewikis) => {
      callback(null, privatewikis);
    })
    .catch((err) => {
      callback(err);
    })
  },
  deleteWiki(req, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      const authorized = new Authorizer(req.user, wiki).destroy();

      if(authorized){
        wiki.destroy()
        .then((res) => {
          callback(null, wiki);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      }
    })
    .catch((err) => {
      callback(err);
    })
  },
  updateWiki(req, updatedWiki, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      if(!wiki){
        return callback("Wiki not found");
      }
      const authorized = new Authorizer(req.user, wiki).update();

      if(authorized){
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback("Forbidden");
      }
    });
  },
  makePrivateWiki(req, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      if(!wiki){
       return callback("wiki not found");
      }
      const authorized = new Authorizer(req.user, wiki).makePrivate();
      if(authorized) {
        wiki.update({
         private: true
        }, {
         where: {
           id: wiki.id
         }
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch((err) => {
         callback(err);
        });    
      } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      }
    });
  },
  downgradeWikis(id, callback){
   return Wiki.findAll({
     where: {
       userId: id
     }
   })
   .then((wikis) => {
     wikis.forEach((wiki) => {
       wiki.update({
         private: false
       }, {
         where: {
           private: true
         }
       })
       .then(() => {
         callback(null, wikis);
       })
       .catch((err) => {
         callback(err);
       })
     })
   })
  }
}