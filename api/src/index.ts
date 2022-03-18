import express, { Request, Response } from "express";
// import cors from "cors";
import winston from "winston";
import {logger} from "./logger";
import process from "process";
import fs from "fs";
import {compareAsync} from "./auth/auth";

const dotenv = require("dotenv");
dotenv.config({path: __dirname + '/.env'});
const isDev = process.env.NODE_ENV !== "production";
const sessionSecret = "secret_session_password";

const AdminJS = require("adminjs");
const AdminJSSequelize = require("@adminjs/sequelize");
const AdminJSExpress = require("@adminjs/express");
const db = require("./models");
const User = db.User;
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const store = new SequelizeStore({
  db: db.sequelize,
});

logger.add(new winston.transports.Console({format: winston.format.simple(),}));

if (fs.existsSync(".env")) {
  console.log("Found .env file\n\n\n");
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
} else {
  console.log("\n\nDidn't find .env " + __dirname)
}

const app = express();

(async () => {

  db.sequelize.sync();

  // app.use(cors())
  app.use(express.json());
  app.set('json spaces', 2)

  AdminJS.registerAdapter(AdminJSSequelize);
  const predefinedRouter = express.Router();
  const adminJs = new AdminJS({
    databases: [db],
    rootPath: "/admin",
  });
  const router = AdminJSExpress.buildAuthenticatedRouter(
      adminJs,
      {
        authenticate: async (email: string, password: string) => {
          try {
            const user = await User.findOne({
              where: {
                email: email,
              },
            });
            if (!user) {
              return false;
            }
            const result = await compareAsync(password, user.password);
            if (result) {
              return user;
            } else {
              return false;
            }
          } catch (e) {
            console.log("Error in authentication => ", e.message);
            return false;
          }
        },
        cookieName: "adminjs",
        cookiePassword: sessionSecret,
      },
      predefinedRouter,
      {
        resave: false,
        saveUnitialized: true,
        store: store,
        secure: !isDev,
      }
  );

  app.use(adminJs.options.rootPath, router);

  // app.use("/api/nft/", NftRouter);

  app.get("/api", (_: Request, res: Response) => {
    res.send({message: "api is connected"});
  });

  if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/dist"));
    const path = require("path");
    app.get("*", (_, res) => {
      res.sendFile(path.resolve("client", "dist", "index.html"));
    });
  }

  app.listen(process.env.PORT || 4000, () => {
    console.log("Server is running");
  });
})()