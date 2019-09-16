"use strict";
const provincesModel = require(__pathSchemas)[databaseConfig.col_provinces];
const provincesInfosModel = require(__pathSchemas)['province_infos'];
const NotFound = require(__pathHelper + "error");
module.exports = {
  getProvinceInfoByProvinceId: async (params, options = null) => {
    const province_geo = await provincesInfosModel.findOne({
      where: {province_id: params.province_id},
      attributes: [
        "id",
        "population",
        "area"
      ],
      include: [
        { 
          model: provincesModel, 
          attributes: ["id", "name"]
        }
      ]
    });
    if (!province_geo) {
      throw new NotFound(
        `Entity with id: '${params.province_id}' couldn't be bound.`
      );
    }
    return province_geo;
  },
  updateProvinceInfo: (params, options = null) => {
    return provincesInfosModel.findOne({
      where: {province_id: params.province_id},
      attributes: [
        "id",
        "population",
        "area"
      ]
    }).then(province_info_update => {
      if (province_info_update) {
        console.log(params.province_info);
        return province_info_update.update(params.province_info);
      } else {
        throw new NotFound(
          `Entity with id: '${params.province_id}' couldn't be bound.`
        );
      }
    });
  }
};
