"use strict";
const provincesModel = require(__pathSchemas)[databaseConfig.col_provinces];
const districtsModel = require(__pathSchemas)[databaseConfig.col_districts];
const provincesInfosModel = require(__pathSchemas)['province_infos'];
module.exports = {
  listProvinces: async (params, options = null) => {
    return provincesModel.findAll({
      attributes: [
        "id",
        "name"
      ],
      include: [
        { 
          model: districtsModel,
          attributes: ["id", "name", "province_id"]
        }
      ]
    });
  }
};
