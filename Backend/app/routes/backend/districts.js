const express = require("express");
const router = express.Router();
const districtsModel = require(__pathModels + "districts");
const districtsGeosModel = require(__pathModels + "district_geos");
const districtsInfosModel = require(__pathModels + "district_infos");
const paramsHelper = require(__pathHelper + "params");
const Response = require(__pathHelper + "response").Response;
const authHelper = require(__pathHelper + "auth");

router.get("/", (req, res, next) => {
  districtsModel.listdistricts().then(items => {
    res.json(
      new Response(false, 200, "success", "Success", items)
    );
  })
});
router.get("/geo-json", (req, res, next) => {
  const params = {};
  params.district_id = paramsHelper.getParam(req.query, "district_id", "");
  districtsGeosModel.getdistrictGeoBydistrictId(params).then(item => {
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
  params.district_id = paramsHelper.getParam(req.query, "district_id", "");
  districtsInfosModel.getdistrictInfoBydistrictId(params).then(item => {
    res.json(
      new Response(false, 200, "success", "Success", [item])
    );
  }).catch(error =>
    res.status(error.statusCode || 400)
      .json(new Response(true, 400, "error", error.message))
  );
});

router.put("/update-info/:district_id", authHelper.isAuthenticated, (req, res, next) => {
  const params = {};
  params.district_id = paramsHelper.getParam(req.params, "district_id", "");
  params.district_info = paramsHelper.getParam(req.body, "district_info", "");
  console.log(params);
  districtsInfosModel.updateDistrictInfo(params).then(item => {
    res.json(
      new Response(false, 200, "success", "Success", [item])
    );
  })
});

module.exports = router;
