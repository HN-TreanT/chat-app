const express = require("express");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./config/index");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3000;
const app = express();
app.use("/public", express.static(path.join(__dirname, "./public")));
app.use(
  cors({
    origin: "*",

    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],

    credentials: true, //

    //   Access-Control-Allow-Credentials is a header that, when set to true , tells browsers to expose the response to the frontend JavaScript code. The credentials consist of cookies, authorization headers, and TLS client certificates.
  })
);
//connect db
db.connect();
//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  express.urlencoded({
    extended: true,
  })
); // Returns middleware that only parses urlencoded bodies
//http logger

app.use(routes);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
