const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo")(session);
const validator = require("express-validator");
const mongodb = require("mongoose");
const moment = require("moment")
require("dotenv").config();
require("./models/database");
require("./config/passport");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const productRouter = require("./routes/product");
const adminRouter = require("./routes/admin");
const categoryRouter = require("./routes/category");
const userAdminRouter = require("./routes/userAdmin");
const testRouter = require("./routes/test");
const cartRouter = require("./routes/cart");
const Cart = require("./models/cart");

const app = express();

// view engine setup
const hbs = expressHbs.create({
  helpers: {
    currency: (value) => {
      return new Intl.NumberFormat("vi-VI", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    ifEqual: (arg1, arg2, options) => {
      if (arg1 && arg2) {
        return arg1.toString() === arg2.toString();
      } else {
        return false;
      }
    },
    date: (date, format) => {
      console.log("tracking handlebars"+date)
      var mmnt = moment(date);
      mmnt.locale('vi')
      return mmnt.format(format).toString();
    },
    test: (arg1, arg2) => {
      console.log(arg1);
      console.log(arg2);
    },
    convert: (something) => {
      if (!something) return;
      return JSON.stringify(something);
    },
  },
  defaultLayout: "layout",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(handlebars),
});
app.engine(".hbs", hbs.engine);
//app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "hbs");

//app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(validator());
app.use(cors());
app.use(
  session({
    secret: "nothingtostore",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongodb.connection }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  req.session.cart = cart;
  res.locals.totalQuantity = cart.totalQuantity;
  next();
});

app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.succsess_msg = req.flash("succsess_msg");
  //res.locals.hasErrors = req.flash("hasError");
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/admin", adminRouter);
app.use("/admin/cate", categoryRouter);
app.use("/admin/product", productRouter);
app.use("/admin/user", userAdminRouter);
app.use("/admin/cart", cartRouter);
app.use("/test", testRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
