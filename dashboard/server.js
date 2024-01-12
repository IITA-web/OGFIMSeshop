import AdminJS, { ComponentLoader } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import express from "express";
import mongoose from "mongoose";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { VendorModel } from "./models/Vendor.js";
import { CategoryModel, SubCategoryModel } from "./models/Category.js";
import { PromotionModel } from "./models/Product.js";
import { CallbackModel } from "./models/RR.js";
import { SystemResource } from "./resources/System.js";
import { AdminResource, authenticate } from "./resources/Admin.js";
import { ProductResource } from "./resources/Product.js";
import "dotenv/config";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { dark, light, noSidebar } from "@adminjs/themes";
import { componentLoader, Components } from "./utils/ComponentLoader.js";
import { CategoryResource, SubCategoryResource } from "./resources/Category.js";
import { ReportResource, ReviewResource } from "./resources/Review.js";

const MongoStore = connectMongo(session);
const PORT = process.env.PORT || 3001;

AdminJS.registerAdapter(AdminJSMongoose);

const start = async () => {
  const app = express();
  (async function () {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      console.log("your DB is not running. Start it up!");
    }
  })();

  const admin = new AdminJS({
    componentLoader,
    resources: [
      AdminResource,
      VendorModel,
      CategoryResource,
      SubCategoryResource,
      ReviewResource,
      ReportResource,
      ProductResource,
      SystemResource,
    ],
    rootPath: "/admin",
    loginPath: "/admin/authenticate",
    logoutPath: "/admin/exit",
    branding: {
      companyName: "OGFIMS - Admin Panel",
      logo: "./logo.svg",
      favicon: "./logo.svg",
      withMadeWithLove: false,
    },
    dashboard: {
      component: Components.dashboard,
    },
  });

  const store = new MongoStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
  });

  app.enable("trust proxy");
  app.use(express.static("public"));

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: "adminjs",
      cookiePassword: process.env.SESSION_SECRET,
    },
    null,
    {
      store,
      secret: process.env.SESSION_SECRET,
      proxy: true,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 7,
      },
      name: "adminjs",
    }
  );

  console.log(await admin.watch());

  app.use(admin.options.rootPath, adminRouter);
  app.listen(PORT, () => {});
};

try {
  start();
} catch (error) {
  console.log(error);
}
