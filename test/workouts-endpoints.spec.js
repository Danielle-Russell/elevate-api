const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

describe.only("Workouts Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () =>
    db.raw("TRUNCATE TABLE workouts, users RESTART IDENTITY CASCADE;")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE TABLE workouts, users RESTART IDENTITY CASCADE;")
  );

  describe("GET api/workouts/", () => {
    context("Given there are workouts in the database", () => {
      const testWork = [
        {
          id: 1,
          userid: "daniellerussell714@gmail.com",
          title: "First test workout",
          descr: "First test workout descr",
          tip: "First test workout tip",
        },
        {
          id: 2,
          userid: "daniellerussell714@gmail.com",
          title: "Second test workout",
          descr: "Second test workout descr",
          tip: "Second test workout tip",
        },
      ];

      const testUser = {
        id: 1,
        firstname: "Danielle",
        lastname: "Russell",
        email: "daniellerussell714@gmail.com",
        password: "testpassword",
      };

      beforeEach("insert user", () => {
        return db.into("users").insert(testUser);
      });

      beforeEach("insert workout", () => {
        return db.into("workouts").insert(testWork);
      });

      it("GET /api/workouts responds with 200 and all of the workouts", () => {
        return supertest(app).get("/api/workouts").expect(200, testWork);
      });
      it("GET /api/workouts/:userid responds with 200 and the specified workouts", () => {
        return supertest(app)
          .get("/api/workouts/daniellerussell714@gmail.com")
          .expect(200, {
            0: {
              id: 1,
              userid: "daniellerussell714@gmail.com",
              title: "First test workout",
              descr: "First test workout descr",
              tip: "First test workout tip",
            },
            1: {
              id: 2,
              userid: "daniellerussell714@gmail.com",
              title: "Second test workout",
              descr: "Second test workout descr",
              tip: "Second test workout tip",
            },
            title: "",
            descr: "",
            tip: "",
          });
      });
    });
  });

  describe(`POST /api/workouts`, () => {
    const testUser = {
      id: 1,
      firstname: "Danielle",
      lastname: "Russell",
      email: "daniellerussell714@gmail.com",
      password: "testpassword",
    };

    beforeEach("insert user", () => {
      return db.into("users").insert(testUser);
    });

    it(`creates a workout, responding with 201 and the new record`, () => {
      const testWork = {
        userid: "daniellerussell714@gmail.com",
        title: "First test workout",
        descr: "First test workout descr",
        tip: "First test workout tip",
      };

      return supertest(app)
        .post("/api/workouts")
        .send(testWork)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(testWork.title);
          expect(res.body.userid).to.eql(testWork.userid);
          expect(res.body.descr).to.eql(testWork.descr);
          expect(res.body.tip).to.eql(testWork.tip);
          expect(res.body).to.have.property("id");
        })
        .then((res) =>
          supertest(app)
            .get(`/api/workouts/daniellerussell714@gmail.com`)
            .expect({
              0: {
                descr: "First test workout descr",
                id: 1,
                tip: "First test workout tip",
                title: "First test workout",
                userid: "daniellerussell714@gmail.com",
              },
              descr: "",
              tip: "",
              title: "",
            })
        );
    });
  });
  describe(`PATCH /api/workouts/:id`, () => {
    context("Given there are workouts in the database", () => {
      const testUser = {
        id: 1,
        firstname: "Danielle",
        lastname: "Russell",
        email: "daniellerussell714@gmail.com",
        password: "testpassword",
      };

      const testWork = {
        userid: "daniellerussell714@gmail.com",
        title: "First test workout",
        descr: "First test workout descr",
        tip: "First test workout tip",
      };

      beforeEach("insert user", () => {
        return db.into("users").insert(testUser);
      });

      beforeEach("insert workout", () => {
        return db.into("workouts").insert(testWork);
      });

      it("responds with 204 and updates the workout", () => {
        const idToUpdate = 1;
        const updateWork = {
          id: 1,
          userid: "daniellerussell714@gmail.com",
          title: "First test workout diff",
          descr: "First test workout descr",
          tip: "First test workout tip",
        };

        return supertest(app)
          .patch(`/api/workouts/${idToUpdate}`)
          .send(updateWork)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/workouts/daniellerussell714@gmail.com`)
              .expect({
                0: {
                  id: 1,
                  title: "First test workout diff",
                  descr: "First test workout descr",
                  tip: "First test workout tip",
                  userid: "daniellerussell714@gmail.com",
                },
                title: "",
                descr: "",
                tip: "",
              })
          );
      });
    });
  });
  describe(`DELETE /api/workouts/:id`, () => {
    const testWork = {
      userid: "daniellerussell714@gmail.com",
      title: "First test workout",
      descr: "First test workout descr",
      tip: "First test workout tip",
    };

    const testUser = {
      id: 1,
      firstname: "Danielle",
      lastname: "Russell",
      email: "daniellerussell714@gmail.com",
      password: "testpassword",
    };

    context("Given there are users in the database", () => {
      beforeEach("insert user", () => {
        return db.into("users").insert(testUser);
      });

      beforeEach("insert workout", () => {
        return db.into("workouts").insert(testWork);
      });
      it("responds with 204 and removes the workout", () => {
        const idToRemove = 1;
        return supertest(app)
          .delete(`/api/workouts/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/workouts/daniellerussell714@gmail.com`)
              .expect({
                title: "",
                descr: "",
                tip: "",
              })
          );
      });
    });
  });
});
