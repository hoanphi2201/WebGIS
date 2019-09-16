"use strict";
const districtsModel = require(__pathSchemas)[databaseConfig.col_districts];
const districtsGeosModel = require(__pathSchemas)['district_geos'];
const districtsInfosModel = require(__pathSchemas)['district_infos'];
const NotFound = require(__pathHelper + "error");
module.exports = {
  getdistrictGeoBydistrictId: async (params, options = null) => {
    console.log(params.district_id);
    
    const district_geo = await districtsGeosModel.findOne({
      where: {district_id: params.district_id},
      attributes: [
            "district_id",
            "json",
            "center"
      ],
      include: [
        { 
          model: districtsModel, 
          attributes: ["id", "name"],
          include: [
            {
              model: districtsInfosModel, 
              attributes: ["id", "district_id", "population", "area"]
            }
          ]
        }
      ]
    });
    if (!district_geo) {
      throw new NotFound(
        `Entity with id: '${params.district_id}' couldn't be bound.`
      );
    }
    return district_geo;
  }
};
