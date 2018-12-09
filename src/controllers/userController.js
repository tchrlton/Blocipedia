const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const stripe = require("stripe")('pk_test_bpjy258CFg8ehf4AHIv4dSpS');

module.exports = {
  signUp(req, res, next){
    res.render("users/sign_up");
  },
  create(req, res, next){
    let newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation
    };
    userQueries.createUser(newUser, (err, user) => {
        if(err){
            req.flash("error", err);
            res.redirect("/users/sign_up");
        } else {
    
          passport.authenticate("local")(req, res, () => {
            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
          })
        }
    });
  },
  signInForm(req, res, next){
    res.render("users/sign_in");
  },
  signIn(req, res, next){
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },
  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  show(req, res, next) {
    userQueries.getUser(req.params.id, (err, user) => {
        if(err || user === undefined){
          console.log(err);
          console.log(user);
            req.flash("notice", "No user found with that ID.");
            res.redirect("/");
        } else {
            res.render("users/show", {user});
        }
    });
  },
  upgradeForm(req, res, next){
    userQueries.getUser(req.params.id, (err, user) => {
      if(err || user == null){
        res.redirect(404, "/");
      } else {
        res.render("users/upgrade", {user});
      }
    });
  },
  upgrade(req, res, next){
    const token = req.body.stripeToken;
    const email = req.body.stripeEmail;
    User.findOne({
        where: {email: email}
    })
    .then((user) => {
        if(user){
            const charge = stripe.charges.create({
                amount: 15,
                currency: 'usd',
                description: 'Upgrade to premium',
                source: token,
            })
            .then((result) => {
                if(result){
                    userQueries.upgradeUser(user);
                    req.flash("notice", "Upgrade successful!");
                    res.redirect("/wikis");
                } else {
                    req.flash("notice", "Upgrade unsuccessful.");
                    res.redirect("users/show", {user});
                }
            })
        } else {
            req.flash("notice", "Upgrade unsuccessful.");
            res.redirect("users/upgrade");
        }
    })
  }  
}