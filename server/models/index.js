import Sequelize from "sequelize";

const sequelize = new Sequelize(
  process.env.TEST_DB || "slack",
  "dpranjic",
  "1111",
  {
    dialect: "postgres",
    operatorsAliases: Sequelize.Op, // to ger rid of Sequelize depricate error message
    define: {
      underscored: true
    }
  }
);

const models = {
  User: sequelize.import("./user"),
  Channel: sequelize.import("./channel"),
  Team: sequelize.import("./team"),
  Member: sequelize.import("./member"),
  Message: sequelize.import("./message"),
  DirectMessage: sequelize.import("./directMessage"),
  PCMember: sequelize.import("./pcmember")
};

Object.keys(models).forEach(modelName => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
