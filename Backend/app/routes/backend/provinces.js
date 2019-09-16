const express = require("express");
const router = express.Router();
const provincesModel = require(__pathModels + "provinces");
const provincesGeosModel = require(__pathModels + "province_geos");
const provincesInfosModel = require(__pathModels + "province_infos");
const paramsHelper = require(__pathHelper + "params");
const Response = require(__pathHelper + "response").Response;
const authHelper = require(__pathHelper + "auth");

router.get("/", (req, res, next) => {
  provincesModel.listProvinces().then(items => {
    res.json(
      new Response(false, 200, "success", "Success", items)
    );
  })
});
router.get("/geo-json", (req, res, next) => {
  const params = {};
  params.province_id = paramsHelper.getParam(req.query, "province_id", "");
  provincesGeosModel.getProvinceGeoByProvinceId(params).then(item => {
    res.json(
      new Response(false, 200, "success", "Success", [item])
    );
  }).catch(error =>
    res.status(error.statusCode || 400)
      .json(new Response(true, 400, "error", error.message))
  );
});
router.get("/info", (req, res, next) => {
  const params = {};
  params.province_id = paramsHelper.getParam(req.query, "province_id", "");
  provincesInfosModel.getProvinceInfoByProvinceId(params).then(item => {
    res.json(
      new Response(false, 200, "success", "Success", [item])
    );
  }).catch(error =>
    res.status(error.statusCode || 400)
      .json(new Response(true, 400, "error", error.message))
  );
});
router.put("/update-info/:province_id", authHelper.isAuthenticated, (req, res, next) => {
  const params = {};
  params.province_id = paramsHelper.getParam(req.params, "province_id", "");
  params.province_info = paramsHelper.getParam(req.body, "province_info", "");
  console.log(params);
  provincesInfosModel.updateProvinceInfo(params).then(item => {
    res.json(
      new Response(false, 200, "success", "Success", [item])
    );
  })
});

module.exports = router;
