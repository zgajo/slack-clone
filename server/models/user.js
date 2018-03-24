export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: "Username can only be letters and numbers"
        },
        len: {
          args: [2, 10],
          msg: "Username must be between 2-10 characters long"
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "Invalid email"
        },
      }
    },
    password: DataTypes.STRING
  });

  User.associate = (models) => {
    // n:m
    User.belongsToMany(models.Team, {
      through: 'member',
      foreignKey: {
        name: 'userId',
        field: "user_id"
      },
    });

    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: {
        name: 'userId',
        field: "user_id"
      },
    });

  };

  return User;
};