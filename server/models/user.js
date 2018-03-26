import bcrypt from 'bcrypt'

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
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [4, 25],
          msg: "Password  must be between 4-25 characters long"
        },
      }
    }
  }, {
      hooks: {
        afterValidate: async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 12);
          user.password = hashedPassword;
        }
      }
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