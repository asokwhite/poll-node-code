module.exports = (sequelize, Sequelize) => {
  const Voter = sequelize.define("voters", {

    voter_email: {
      type: Sequelize.STRING
    },
    candidate_id : {
      type: Sequelize.INTEGER,
      defaultValue: "1",
    }
  });

  return Voter;
};