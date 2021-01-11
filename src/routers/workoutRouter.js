const path = require("path");
const express = require("express");
const xss = require("xss");
const WorkoutService = require("../services/workoutService");
const { requireAuth } = require("../middleware/jwt-auth");

const WorkoutRouter = express.Router();
const jsonParser = express.json();

const sanitizeWorkout = (workout) => ({
  ...workout,
  title: xss(workout.title),
  descr: xss(workout.descr),
  tip: xss(workout.tip),
});

WorkoutRouter.route("/")
  .get((req, res, next) => {
    WorkoutService.getAllWorkouts(req.app.get("db"))
      .then((Workouts) => {
        res.json(Workouts.map(sanitizeWorkout));
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const { title, descr, tip, userid } = req.body;
    const newWorkout = { title, descr, tip, userid };

    // check for missing fields
    for (const [key, value] of Object.entries(newWorkout)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    WorkoutService.insertWorkout(req.app.get("db"), newWorkout)
      .then((workout) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${workout.id}`))
          .json(sanitizeWorkout(workout));
      })
      .catch(next);
  });

WorkoutRouter.route("/:id")

  .patch(jsonParser, (req, res, next) => {
    const { title, descr, tip, userid } = req.body;
    const workoutToUpdate = { title, descr, tip, userid };

    WorkoutService.updateWorkout(
      req.app.get("db"),
      req.params.id,
      workoutToUpdate
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    WorkoutService.deleteWorkout(req.app.get("db"), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });
WorkoutRouter.route("/:userid")
  .all((req, res, next) => {
    WorkoutService.getById(req.app.get("db"), req.params.userid)
      .then((workouts) => {
        if (!workouts) {
          return res.status(404).json({
            error: { message: `User doesn't exist` },
          });
        }
        res.workouts = workouts;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(sanitizeWorkout(res.workouts));
  });

module.exports = WorkoutRouter;
