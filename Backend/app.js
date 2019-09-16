const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const morgan = require("morgan");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");

/*---------------------------------------
|Define path
---------------------------------------*/
const pathConfig = require("./path");
global.__base = __dirname + "/";
global.__pathApp = __base + pathConfig.folderApp + "/";
global.__pathConfig = __pathApp + pathConfig.folderConfig + "/";
global.__pathLogs = __pathApp + pathConfig.folderLogs + "/";
global.__pathHelper = __pathApp + pathConfig.folderHelper + "/";
global.__pathRoutes = __pathApp + pathConfig.folderRoutes + "/";
global.__pathSchemas = __pathApp + pathConfig.folderSchemas + "/";
global.__pathModels = __pathApp + pathConfig.folderModels + "/";
global.__pathPublic = global.__base + pathConfig.folderPublic + "/";
global.__pathUploads = __pathPublic + pathConfig.folderUploads + "/";

global.databaseConfig = require(__pathConfig + "database");
const systemConfig = require(__pathConfig + "system");
// const winston = require(`${__pathHelper}winston`);

require(`${__pathConfig}passport`)(passport);

const app = express();
app.use(cors())
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const MemoryStore = session.MemoryStore;
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 100
    },
    store: new MemoryStore()
  })
);
app.use(passport.initialize());

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.locals.systemConfig = systemConfig;
// app.use(morgan("combined", { stream: winston.stream }));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(require(__pathConfig + "swagger.json"))
);
/*---------------------------------------
|Backend
---------------------------------------*/
app.use(
  `/${systemConfig.prefixAdmin}`,
  require(__pathRoutes + "backend/index")(passport)
);
/*---------------------------------------
|Frontend
---------------------------------------*/
app.use(
  `/${systemConfig.prefixBlog}`,
  require(__pathRoutes + "frontend/index")
);

module.exports = app;
