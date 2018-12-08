const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
    beforeEach((done) => {
        this.wiki;
        this.user;
   
        sequelize.sync({force: true}).then((res) => {
   
          User.create({
            email: "starman@tesla.com",
            password: "Trekkie4lyfe",
          })
          .then((user) => {
            this.user = user;
   
            Wiki.create({
              title: "Expeditions to Alpha Centauri",
              body: "A compilation of reports from recent visits to the star system.",
              private: false,
              userId: user.id
            })
            .then((wiki) => {
                this.wiki = wiki;
              done();
            })
          })
        });
      });

    describe("#create()", () => {
        it("should create a private Wiki object with a valid title and body", (done) => {
            Wiki.create({
                title: "History of Space Exploration",
                body: "The first realistic proposal of spaceflight goes back to Konstantin Tsiolkovsky.",
                private: true
            })
            .then((wiki) => {
                expect(wiki.title).toBe("History of Space Exploration");
                expect(wiki.body).toBe("The first realistic proposal of spaceflight goes back to Konstantin Tsiolkovsky.");
                expect(wiki.private).toBe(true);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
        it("should not create a wiki with a title already taken", (done) => {
            Wiki.create({
              title: "History of Space Exploration",
              body: "The first realistic proposal of spaceflight goes back to Konstantin Tsiolkovsky.",
              private: true
            })
            .then((wiki) => {
              Wiki.create({
                  title: "History of Space Exploration",
                  body: "Spaceflight became an engineering possibility with the work of Robert H. Goddard.",
                  private: true
              })
              .then((wiki) => {
                done();
              })
              .catch((err) => {
                expect(err.message).toContain("Validation error");
                done();
              });
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });
      
        });

    describe("#setUser", () => {
        it("should associate a wiki and a user together", (done) => {
            User.create({
                 username: "user_name",
                email: "user@example.com",
                password: "1234567890"
            })
            .then((user) => {
                 this.user = user;

                 Wiki.create({
                    title: "History of Space Exploration",
                    body: "The first realistic proposal of spaceflight goes back to Konstantin Tsiolkovsky.",
                    private: true,
                    userId: this.user.id
                })
                    .then((wiki) => {
                    expect(wiki.userId).toBe(this.user.id);
                    done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    })
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
        });
    });
});