"use strict";
const districtsModel = require(__pathSchemas)[databaseConfig.col_districts];
const districtsInfosModel = require(__pathSchemas)['district_infos'];
const NotFound = require(__pathHelper + "error");
module.exports = {
  getdistrictInfoBydistrictId: async (params, options = null) => {
    const district_geo = await districtsInfosModel.findOne({
      where: {district_id: params.district_id},
      attributes: [
        "id",
        "population",
        "area"
      ],
      include: [
        { 
          model: districtsModel, 
          attributes: ["id", "name"]
        }
      ]
    });
    if (!district_geo) {
      throw new NotFound(
        `Entity with id: '${params.district_id}' couldn't be bound.`
      );
    }
    return district_geo;
  },
  updateDistrictInfo: (params, options = null) => {
    return districtsInfosModel.findOne({
      where: {district_id: params.district_id},
      attributes: [
        "id",
        "population",
        "area"
      ]
    }).then(district_info_update => {
      if (district_info_update) {
        console.log(params.district_info);
        return district_info_update.update(params.district_info);
      } else {
        throw new NotFound(
          `Entity with id: '${params.district_id}' couldn't be bound.`
        );
      }
    });
  }
};
