const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";

const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : wikis", () => {

 beforeEach((done) => {
  this.user;
  this.wiki;
  sequelize.sync({force: true}).then((res) => {
    User.create({
      email: "starman@tesla.com",
      password: "Trekkie4lyfe",
      role: "standard"
    })
    .then((user) => {
       this.user = user;  
         request.get({   
           url: "http://localhost:3000/auth/fake",
           form: {
             role: "standard",
             userId: user.id
           }
         },
         (err, res, body) => {
          done();
         });

         Wiki.create({
          title: "JS Frameworks",
          body: "There are alot of them.",
          private: false,
          userId: this.user.id
        })
         .then((wiki) => {
          this.wiki = wiki;
          done();
        })
         .catch((err) => {
          console.log(err);
          done();
        });

       });
  });
}); 

    describe("GET /wikis", () => {

      it("should return a status code 200 and all wikis", (done) => {
       request.get(base, (err, res, body) => {
         expect(res.statusCode).toBe(200);
         expect(err).toBeNull();
         expect(body).toContain("Wikis");
         expect(body).toContain("JS Frameworks");
         done();
       });
     });

    });

     describe("GET /wikis/new", () => {

      it("should render a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });

    });
  
  describe("standard user test suite", () => {

    describe("GET /wikis/:id", () => {

     it("should render a view with the selected wiki", (done) => {
       request.get(`${base}${this.wiki.id}`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("JS Frameworks");
         done();
       });
     });

   });

    describe("POST /wikis/:id/destroy", () => {

     it("should delete the wiki with the associated ID", (done) => {

       Wiki.all()
       .then((wikis) => {
         const wikiCountBeforeDelete = wikis.length;
         expect(wikiCountBeforeDelete).toBe(1);
         request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
           Wiki.all()
           .then((wikis) => {
             expect(err).toBeNull();
             expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
             done();
           })
         });
       });
     });

   });


    describe("GET /wikis/:id/edit", () => {

     it("should render a view with an edit wiki form", (done) => {
       request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("Edit Wiki");
         expect(body).toContain("JS Frameworks");
         done();
       });
     });

   });

    describe("POST /wikis/:id/update", () => {

     it("should update the wiki with the given values", (done) => {
      const options = {
       url: `${base}${this.wiki.id}/update`,
       form: {
         title: "JS Frameworks",
         body: "This is the updated body"
       }
     };
     request.post(options,
       (err, res, body) => {

         expect(err).toBeNull();
         Wiki.findOne({
           where: { id: this.wiki.id }
         })
         .then((wiki) => {
           expect(wiki.title).toBe("JS Frameworks");
           done();
         });
       });
   });

   });
  });

describe("premium user tests for private wikis", () => {

  beforeEach((done) => {
   User.create({
     email: "premium@example.com",
     password: "123456",
     role: "premium"
   })
   .then((user) => {
      this.user = user;
      request.get({      
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "premium",   
          userId: user.id
        }
      },
      (err, res, body) => {
        done();
      }
      );
    });
  });

     describe("POST /wikis/create", () => {
       const options = {
         url: `${base}create`,
         form: {
          title: "Jack and the Beanstalk",
          body: "Jack went up the beanstalk to steal from giants.",
          private: true
        }
      };
      it("should create a new wiki and redirect", (done) => {

        request.post(options,
         (err, res, body) => {
           Wiki.findOne({where: {title: "Jack and the Beanstalk"}})
           .then((wiki) => {
            expect(wiki).not.toBeNull();
            expect(wiki.body).toBe("Jack went up the beanstalk to steal from giants.");
            expect(wiki.id).not.toBeNull();
            expect(wiki.private).toBe(true);
            done();
          })
           .catch((err) => {
             console.log(err);
             done();
           });
         }
         );
      });
    });

     describe("POST wikis/makePrivate", () => {

        it("should create a public wiki then make it private", (done) => {
          Wiki.create({
            title: "Jack and the Beanstalk",
            body: "Jack went up the beanstalk to steal from giants.",
            private: false,
            userId: this.user.id
          })
          .then((wiki) => {
            request.post(`${base}${wiki.id}/makePrivate`, (err, res, body) => {
             expect(err).toBeNull();
             Wiki.findOne({
               where: { id: wiki.id }
             })
             .then((wiki) => {
              expect(wiki.private).toBe(true);
              done();
            });
           });
          })
          .catch((err) => {
            console.log(err);
            done();
          });

        });
      });

   });

  });