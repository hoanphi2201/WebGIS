"use strict";
const districtsModel = require(__pathSchemas)[databaseConfig.col_districts];
const districtsInfosModel = require(__pathSchemas)['district_infos'];
module.exports = {
  listdistricts: async (params, options = null) => {
    return districtsModel.findAll({
      attributes: [
        "id",
        "name"
      ]
    });
  }
};
