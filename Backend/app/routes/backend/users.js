"use strict";
const express = require("express");
const router = express.Router();
const usersModel = require(__pathModels + "users");
const paramsHelper = require(__pathHelper + "params");
const Response = require(__pathHelper + "response").Response;
const ResponsePagination = require(__pathHelper + "response")
  .ResponsePagination;

router.get("/", async (req, res, next) => {
  const params = {};
  params.pagination = {
    totalItems: 1,
    totalItemsPerPage: 10,
    currentPage: 1
  };
  params.keyword = paramsHelper.getParam(req.query, "keyword", "");
  params.currentStatus = paramsHelper.getParam(req.query, "status", "all");
  params.sortField = paramsHelper.getParam(req.query, "sort_field", "id");
  params.sortType = paramsHelper.getParam(req.query, "sort_type", "asc");
  params.pagination.currentPage = parseInt(
    paramsHelper.getParam(req.query, "page", 1)
  );
  params.pagination.totalItemsPerPage = parseInt(
    paramsHelper.getParam(req.query, "pageSize", 10)
  );
  params.pagination.totalItems = await usersModel
    .countUsers(params)
    .then(count => {
      return count;
    })
    .catch(error => res.status(error.statusCode || 400).json(error));
  await usersModel
    .listUsers(params)
    .then(users => {
      res
        .status(200)
        .json(
          new ResponsePagination(
            false,
            200,
            "success",
            "Success",
            users,
            params.pagination
          )
        );
    })
    .catch(error =>
      res
        .status(error.statusCode || 400)
        .json(new Response(true, 400, "error", error.message))
    );
});
router.get("/:userId", async (req, res, next) => {
  const userId = paramsHelper.getParam(req.params, "userId", "");
  await usersModel
    .getUsersById(userId)
    .then(user => {
      res
        .status(200)
        .json(new Response(false, 200, "success", "Success", [user]));
    })
    .catch(error =>
      res
        .status(error.statusCode || 400)
        .json(new Response(true, 400, "error", error.message))
    );
});
router.get("/username/:username", async (req, res, next) => {
  const username = paramsHelper.getParam(req.params, "username", "");
  await usersModel
    .getUsersByUsername(username)
    .then(user => {
      res
        .status(200)
        .json(new Response(false, 200, "success", "Success", [user]));
    })
    .catch(error =>
      res
        .status(error.statusCode || 400)
        .json(new Response(true, 400, "error", error.message))
    );
});
router.delete("/:userId", (req, res, next) => {
  const userId = paramsHelper.getParam(req.params, "userId", "");
  usersModel
    .deleteUsers(userId, { task: "delete-one" })
    .then(user => {
      res.json(new Response(false, 200, "success", "Success", [user]));
    })
    .catch(error =>
      res
        .status(error.statusCode || 400)
        .json(new Response(true, 400, "error", error.message))
    );
});
router.put("/change-status", (req, res, next) => {
  const userIds = paramsHelper.getParam(req.body, "userIds", []);
  if (!Array.isArray(userIds)) {
    res
      .status(400)
      .json(new Response(true, 400, "error", "userIds is a array of id user"));
  } else {
    const changeStatus = paramsHelper.getParam(req.body, "status", "active");
    usersModel
      .changeStatus(userIds, changeStatus, { task: "update_multy" })
      .then(users => {
        res.json(new Response(false, 200, "success", "Success", users));
      })
      .catch(error =>
        res
          .status(error.statusCode || 400)
          .json(new Response(true, 400, "error", error.message))
      );
  }
});
router.put("/change-status/:userId", (req, res, next) => {
  const userId = paramsHelper.getParam(req.params, "userId", "");
  usersModel
    .changeStatus(userId, null, { task: "update_one" })
    .then(user => {
      res.json(new Response(false, 200, "success", "Success", [user]));
    })
    .catch(error =>
      res
        .status(error.statusCode || 400)
        .json(new Response(true, 400, "error", error.message))
    );
});
router.put("/:userId", (req, res, next) => {
  const userId = paramsHelper.getParam(req.params, "userId", "");
  const user = req.body ? req.body : {};
  usersModel
    .saveUser(user, userId, { task: "update" })
    .then(user => {
      res.json(new Response(false, 200, "success", "Success", [user]));
    })
    .catch(error =>
      res
        .status(error.statusCode || 400)
        .json(new Response(true, 400, "error", error.message))
    );
});
router.post("/delete-multy", (req, res, next) => {
  const userIds = paramsHelper.getParam(req.body, "userIds", "");
  if (!Array.isArray(userIds)) {
    res
      .status(400)
      .json(new Response(true, 400, "error", "userId is a array of id user"));
  } else {
    usersModel
      .deleteUsers(userIds, { task: "delete-many" })
      .then(users => {
        res
          .status(200)
          .json(new Response(false, 200, "success", "Success", users));
      })
      .catch(error =>
        res
          .status(error.statusCode || 400)
          .json(new Response(true, 400, "error", error.message))
      );
  }
});
router.post("/", (req, res, next) => {
  const user = req.body ? req.body : {};
  usersModel
    .saveUser(user, null, { task: "create" })
    .then(user => {
      res.json(new Response(false, 200, "success", "Success", [user]));
    })
    .catch(error =>
      res
        .status(error.statusCode || 400)
        .json(new Response(true, 400, "error", error.message))
    );
});

module.exports = router;
