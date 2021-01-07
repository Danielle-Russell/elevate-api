const WorkoutService = {
    getAllWorkouts(knex) {
      return knex.select("*").from("workouts").orderBy("id", "asc");
    },
    insertWorkout(knex, newWorkout) {
      return knex
        .insert(newWorkout)
        .into("workouts")
        .returning("*")
        .then((rows) => rows[0]);
    },
    updateWorkout(knex, id, newWorkoutFields) {
      return knex("workouts").where({ id }).update(newWorkoutFields);
    },
    getById(knex, userid) {
      return knex.from("workouts").select("*").where("userid", userid);
    },
    deleteWorkout(knex, id) {
        return knex("workouts").where({ id }).delete();
      },
  };
  
  module.exports = WorkoutService;
  