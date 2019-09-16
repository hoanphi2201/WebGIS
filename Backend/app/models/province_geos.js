"use strict";
const provincesModel = require(__pathSchemas)[databaseConfig.col_provinces];
const provincesGeosModel = require(__pathSchemas)['province_geos'];
const provincesInfosModel = require(__pathSchemas)['province_infos'];
const NotFound = require(__pathHelper + "error");
module.exports = {
  getProvinceGeoByProvinceId: async (params, options = null) => {
    const province_geo = await provincesGeosModel.findOne({
      where: {province_id: params.province_id},
      attributes: [
            "province_id",
            "json",
            "center"
      ],
      include: [
        { 
          model: provincesModel, 
          attributes: ["id", "name"],
          include: [
            {
              model: provincesInfosModel, 
              attributes: ["id", "province_id", "population", "area"]
            }
          ]
        }
      ]
    });
    if (!province_geo) {
      throw new NotFound(
        `Entity with id: '${params.province_id}' couldn't be bound.`
      );
    }
    return province_geo;
  }
};
