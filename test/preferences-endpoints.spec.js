const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

describe.only("Preferences Endpoints", function () {
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
    db.raw("TRUNCATE TABLE preferences, users RESTART IDENTITY CASCADE;")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE TABLE preferences, users RESTART IDENTITY CASCADE;")
  );

  describe("GET api/preferences/", () => {
    context("Given there are preferences in the database", () => {
      const testPref = {
        userid: "daniellerussell714@gmail.com",
        name: "Danielle",
        age: "0",
        weight: 159,
        height: 151,
        goals: "Lose Weight",
        time: "Morning,Noon",
        days: "Mon,Tues,Weds,Thurs",
      };

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

      beforeEach("insert pref", () => {
        return db.into("preferences").insert(testPref);
      });

      it("GET /api/preferences/:userid responds with 200 and the specified preferences", () => {
        return supertest(app)
          .get("/api/preferences/daniellerussell714@gmail.com")
          .expect(200, {
            0: {
              id: 1,
              userid: "daniellerussell714@gmail.com",
              age: "0",
              weight: 159,
              height: 151,
              goals: "Lose Weight",
              time: "Morning,Noon",
              days: "Mon,Tues,Weds,Thurs",
              name: "Danielle",
            },
            userid: "",
            name: "",
            age: "",
            weight: "",
            height: "",
            goals: "",
            time: "",
            days: "",
          });
      });
    });
  });

  describe(`POST /api/preferences`, () => {
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

    it(`creates a preferences object, responding with 201 and the new record`, () => {
      const testPref = {
        userid: "daniellerussell714@gmail.com",
        name: "Danielle",
        age: "0",
        weight: "159",
        height: "151",
        goals: "Lose Weight",
        time: "Morning,Noon",
        days: "Mon,Tues,Weds,Thurs",
      };

      return supertest(app)
        .post("/api/preferences")
        .send(testPref)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).to.eql(testPref.name);
          expect(res.body.userid).to.eql(testPref.userid);
          expect(res.body.age).to.eql(testPref.age);
          expect(res.body.weight).to.eql(testPref.weight);
          expect(res.body.height).to.eql(testPref.height);
          expect(res.body.time).to.eql(testPref.time);
          expect(res.body.days).to.eql(testPref.days);
          expect(res.body.goals).to.eql(testPref.goals);
          expect(res.body).to.have.property("id");
        })
        .then((res) =>
          supertest(app)
            .get(`/api/preferences/daniellerussell714@gmail.com`)
            .expect({
              0: {
                userid: "daniellerussell714@gmail.com",
                name: "Danielle",
                age: "0",
                weight: 159,
                height: 151,
                goals: "Lose Weight",
                time: "Morning,Noon",
                days: "Mon,Tues,Weds,Thurs",
                id: 1,
              },
              userid: "",
              name: "",
              age: "",
              weight: "",
              height: "",
              goals: "",
              time: "",
              days: "",
            })
        );
    });
  });
  describe(`PATCH /api/preferences/:id`, () => {
    context("Given there are preferences in the database", () => {
      const testUser = {
        id: 1,
        firstname: "Danielle",
        lastname: "Russell",
        email: "daniellerussell714@gmail.com",
        password: "testpassword",
      };

      const testPref = {
        userid: "daniellerussell714@gmail.com",
        name: "Danielle",
        age: "0",
        weight: 159,
        height: 151,
        goals: "Lose Weight",
        time: "Morning,Noon",
        days: "Mon,Tues,Weds,Thurs",
      };
      beforeEach("insert user", () => {
        return db.into("users").insert(testUser);
      });

      beforeEach("insert pref", () => {
        return db.into("preferences").insert(testPref);
      });

      it("responds with 204 and updates the preference", () => {
        const idToUpdate = 1;
        const updatePref = {
          userid: "daniellerussell714@gmail.com",
          name: "Daniel",
          age: "0",
          weight: 159,
          height: 151,
          goals: "Lose Weight",
          time: "Morning,Noon",
          days: "Mon,Tues,Weds,Thurs",
        };

        return supertest(app)
          .patch(`/api/preferences/${idToUpdate}`)
          .send(updatePref)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/preferences/daniellerussell714@gmail.com`)
              .expect({
                0: {
                  userid: "daniellerussell714@gmail.com",
                  name: "Daniel",
                  age: "0",
                  weight: 159,
                  height: 151,
                  goals: "Lose Weight",
                  time: "Morning,Noon",
                  days: "Mon,Tues,Weds,Thurs",
                  id: 1,
                },
                userid: "",
                name: "",
                age: "",
                weight: "",
                height: "",
                goals: "",
                time: "",
                days: "",
              })
          );
      });
    });
  });
  describe(`DELETE /api/preferences/:id`, () => {
    const testPref = {
      userid: "daniellerussell714@gmail.com",
      name: "Danielle",
      age: "0",
      weight: 159,
      height: 151,
      goals: "Lose Weight",
      time: "Morning,Noon",
      days: "Mon,Tues,Weds,Thurs",
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

      beforeEach("insert preference", () => {
        return db.into("preferences").insert(testPref);
      });
      it("responds with 204 and removes the preference", () => {
        const idToRemove = 1;
        return supertest(app)
          .delete(`/api/preferences/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/preferences/daniellerussell714@gmail.com`)
              .expect({
                userid: "",
                name: "",
                age: "",
                weight: "",
                height: "",
                goals: "",
                time: "",
                days: "",
              })
          );
      });
    });
  });
});
