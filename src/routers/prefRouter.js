const path = require("path");
const express = require("express");
const xss = require("xss");
const PrefService = require("../services/prefService");
const { requireAuth } = require("../middleware/jwt-auth");

const PrefRouter = express.Router();
const jsonParser = express.json();

const sanitizePref = (pref) => ({
  ...pref,
  userid: xss(pref.userid),
  name: xss(pref.name),
  age: xss(pref.age),
  weight: xss(pref.weight),
  height: xss(pref.height),
  goals: xss(pref.goals),
  time: xss(pref.time),
  days: xss(pref.days),
});

PrefRouter.route("/")

  .post(jsonParser, (req, res, next) => {
    const { userid, name, age, weight, height, goals, time, days } = req.body;
    const newPref = { userid, name, age, weight, height, goals, time, days };

    // check for missing fields
    for (const [key, value] of Object.entries(newPref)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    PrefService.insertPreference(req.app.get("db"), newPref)
      .then((pref) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${pref.id}`))
          .json(sanitizePref(pref));
      })
      .catch(next);
  });

PrefRouter.route("/:id")

  .patch(jsonParser, (req, res, next) => {
    const { userid, name, age, weight, height, goals, time, days } = req.body;
    const prefToUpdate = { userid, name, age, weight, height, goals, time, days };

    PrefService.updatePreference(
      req.app.get("db"),
      req.params.id,
      prefToUpdate
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    PrefService.deletePreference(req.app.get("db"), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });
PrefRouter.route("/:userid")
  .all((req, res, next) => {
    PrefService.getById(req.app.get("db"), req.params.userid)
      .then((pref) => {
        if (!pref) {
          return res.status(404).json({
            error: { message: `User doesn't exist` },
          });
        }
        res.pref = pref;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(sanitizePref(res.pref));
  });

module.exports = PrefRouter;
