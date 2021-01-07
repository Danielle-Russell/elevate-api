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
    getById(knex, userId) {
      return knex.from("workouts").select("*").where("userId", userId).first();
    },
    deleteWorkout(knex, id) {
        return knex("workouts").where({ id }).delete();
      },
  };
  
  module.exports = WorkoutService;
  