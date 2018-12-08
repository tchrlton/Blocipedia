const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : wikis", () => {
  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        username:"usernamegalore",
        email: "user@example.com",
        password: "123456",
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title:"JS Frameworks",
          body: "There are a lot of them",
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

    describe("standard user performing CRUD actions", () => {
      beforeEach((done) => {
        User.create({
          username: "userbro94",
          email: "email@example.com",
          password: "123456",
        })
        .then((user) => {
          request.get({
            url: "http://localhost:3000/auth/fake",
            form: {
              userId: user.id,
              username: user.username,
              email: user.email
            }
          },
            (err, res, body) => {
              done();
            }
          );
        });
      });

      describe("GET /wikis", () => {
        it("should return a status code 200 and all wikis", (done) => {
          request.get(base, (err, res, body) => {
            expect(res.statusCode).toBe(200);
            expect(err).toBeNull();
            expect(body).toContain("JS Frameworks");
            done();
          });
        });
  
      });
  
      describe("GET /wikis/new", () => {
        it("should render a view with a new wiki form", (done) => {
          request.get(`${base}new`, (err, res, body) =>{
            expect(err).toBeNull();
            expect(body).toContain("New Wiki");
            done();
          })
        })
      });
  
      describe("POST /wikis/new", () => {
        const options = {
          url: `${base}create`,
          form: {
            title: "JS Frameworks",
            body: "There are a lot of them",
            private: false
          }
        };

        it("should create a new wiki and redirect", (done) => {
    
          request.post(options,
            (err, res, body) => {
              Wiki.findOne({where: {title: "JS Frameworks"}})
              .then((wiki) => {
                expect(res.statusCode).toBe(303);
                expect(wiki.title).toBe("JS Frameworks");
                expect(wiki.body).toBe("There are a lot of them");
                expect(wiki.private).toBe(false);
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            }
          );
        });
    
        it("should not create a new wiki with invalid attributes", (done) => {
          request.post(
            {
              url: base,
              form: {
                title: "new title",
                body: "",
                private: false,
                userId: this.user.id
              }
            },
            (err, res, body) => {
              Wiki.findOne({where: {title: "new title"}})
              .then((wiki) => {
                expect(wiki).toBeNull();
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
  
        it("should delete the wiki with the associated id", (done) => {
   
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
              });
   
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
                body: "There are a lot of them"
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
});