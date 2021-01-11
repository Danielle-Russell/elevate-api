const PrefService = {
  getAllPreferences(knex) {
    return knex.select("*").from("preferences").orderBy("id", "asc");
  },
  insertPreference(knex, newPreference) {
    return knex
      .insert(newPreference)
      .into("preferences")
      .returning("*")
      .then((rows) => rows[0]);
  },
  updatePreference(knex, id, newPreferenceFields) {
    return knex("preferences").where({ id }).update(newPreferenceFields);
  },
  getById(knex, userid) {
    return knex.from("preferences").select("*").where("userid", userid);
  },
  deletePreferences(knex, id) {
    return knex("preferences").where({ id }).delete();
  },
};

module.exports = PrefService;
