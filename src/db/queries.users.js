const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
     return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      const msg = {
        to: newUser.email,
        from: 'test@example.com',
        subject: 'Thanks for joining Blocipedia!',
        text: 'We are so glad you could join us',
        html: '<strong>Start collaborating on wikis today!</strong>',
      };
      sgMail.send(msg);
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },
  getUser(id, callback){
    return User.findById(id)
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },
  upgradeUser(id, callback){
    return User.findById(id)
    .then((user) => {
      if(!user){
        callback(404);
      } else {
        user.update({
          role: "premium"
           }, {
          where: {
           id: user.id
          }
        })
        callback(null, user);
      }
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
  },
  downgradeUser(id, callback){
    return User.findById(id)
    .then((user) => {
      if(!user){
        callback(404);
      } else {
        user.update({
          role: "standard"
           }, {
          where: {
           id: user.id
          }
        })
        callback(null, user);
      }
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
  }
}
