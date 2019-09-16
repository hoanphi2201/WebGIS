"use strict";
const usersModel = require(__pathSchemas)[databaseConfig.col_users];
const fileHelper = require(__pathHelper + "file");
const uploadFolder = "public/uploads/users/";
const NotFound = require(__pathHelper + "error");

module.exports = {
  listUsers: (params, options = null) => {
    let objWhere = {};
    let order = [[params.sortField, params.sortType]];
    if (params.currentStatus !== "all") {
      objWhere.status = params.currentStatus;
    }
    if (params.keyword !== "") {
      objWhere.username = { $like: `%${params.keyword}%` };
    }
    return usersModel.findAll({
      where: objWhere,
      order: order,
      attributes: [
        "id",
        "firstname",
        "lastname",
        "username",
        "email",
        "updatedAt",
        "createdAt"
      ],
      limit: params.pagination.totalItemsPerPage,
      offset:
        (params.pagination.currentPage - 1) *
        params.pagination.totalItemsPerPage
    });
  },
  getUsersById: (userId, options = null) => {
    return usersModel
      .findByPk(userId, {
        attributes: [
          "id",
          "firstname",
          "lastname",
          "username",
          "email",
          "updatedAt",
          "createdAt"
        ]
      })
      .then(user => {
        if (user) {
          return user;
        } else {
          throw new NotFound(`Entity with id: '${userId}' couldn't be bound.`);
        }
      });
  },
  getUsersByUsername: (username, options = null) => {
    return usersModel
      .findOne(
        { where: { username } },
        {
          attributes: [
            "id",
            "firstname",
            "lastname",
            "username",
            "email"
          ]
        }
      )
      .then(user => {
        if (user) {
          return user;
        } else {
          throw new NotFound(
            `Entity with id: '${username}' couldn't be bound.`
          );
        }
      });
  },
  countUsers: params => {
    let objWhere = {};
    if (params.currentStatus !== "all") {
      objWhere.status = params.currentStatus;
    }
    if (params.keyword !== "") {
      objWhere.username = new RegExp(params.keyword, "i");
    }
    return usersModel.count({
      where: objWhere
    });
  },
  changeStatus: (userId, changeStatus, options = null) => {
    if (options.task === "update_one") {
      return usersModel
        .findByPk(userId)
        .then(user => {
          if (user) {
            return user.update({
              status: user.status === "active" ? "inactive" : "active"
            });
          } else {
            throw new NotFound(
              `Entity with id: '${userId}' couldn't be bound.`
            );
          }
        });
    }
    if (options.task === "update_multy") {
      return usersModel
        .findAll({
          where: { id: userId }
        })
        .then(users => {
          if (users.length === 0) {
            throw new NotFound(
              `Entity with id: '${JSON.stringify(userId)}' couldn't be bound.`
            );
          }
          if (changeStatus != "active" && changeStatus != "inactive") {
            throw new NotFound(
              `Status of entity is invalid status is active or inactive`
            );
          }
          const usersPromises = users.map(user => {
            return user.update({ status: changeStatus });
          });
          return Promise.all(usersPromises);
        });
    }
  },
  deleteUsers: async (userId, options = null) => {
    if (options.task === "delete-one") {
      const user = await usersModel
        .findByPk(userId)
        .then(user => {
          if (user) {
            fileHelper.remove(uploadFolder, user.avatar);
            return user;
          } else {
            throw new NotFound(
              `Entity with id: '${userId}' couldn't be bound.`
            );
          }
        });
      await usersModel.destroy({ where: { id: userId } });
      return user;
    } else if (options.task === "delete-many") {
      const users = await usersModel
        .findAll({
          where: { id: userId }
        })
        .then(users => {
          if (users.length > 0) {
            return users;
          }
          throw new NotFound(
            `Entity with id: '${JSON.stringify(userId)}' couldn't be bound.`
          );
        });
      await usersModel.destroy({ where: { id: userId } });
      return users;
    }
  },
  saveUser: async (user, userId = null, options = null) => {
    if (options.task == "update") {
      const exist_user = await module.exports.getUserByUserNameAndId(
        user.username,
        userId
      );
      if (!exist_user) {
        return usersModel
          .findByPk(userId)
          .then(userUpdate => {
            if (userUpdate) {
              const objUpdate = {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
              };
              if (
                user.password &&
                user.password !== "" &&
                user.confirmPassword !== "" &&
                user.confirmPassword === user.password
              ) {
                objUpdate.password = usersModel.prototype.generateHash(
                  user.password
                );
              }
              return userUpdate.update(objUpdate);
            } else {
              throw new NotFound(
                `Entity with id: '${userId}' couldn't be bound.`
              );
            }
          });
      } else {
        throw new NotFound(
          `Entity with username: '${user.username}' is aready exist.`
        );
      }
    } else if (options.task == "create") {
      const exist_user = await module.exports.getUserByUserName(user.username);
      if (!exist_user) {
        user.password = usersModel.prototype.generateHash(user.password);
        return usersModel.create(user);
      } else {
        throw new NotFound(
          `Entity with username: '${user.username}' is aready exist.`
        );
      }
    }
  },
  getUserByUserName: username => {
    return usersModel.findOne({
      where: {
        username: username
      }
    });
  },
  getUserByUserNameAndId: (username, userId) => {
    const objWhere = { username: username };
    if (userId) {
      objWhere.id = { $ne: userId };
    }
    return usersModel.findOne({
      where: objWhere
    });
  },
  compareUserLogin: username => {
    return usersModel.findOne({
      where: {
        username: username
      }
    });
  }
};
