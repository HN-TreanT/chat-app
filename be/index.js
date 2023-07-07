const express = require("express");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./config/index");
const cors = require("cors");
// const { Server } = require("socket.io");
// const http = require("http");
require("dotenv").config();
const port = process.env.PORT || 3000;
const app = express();
// const server = http.createServer(app);

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//     credentials: true,
//   },
// });
app.use("/public", express.static(path.join(__dirname, "./public")));
app.use(
  cors({
    origin: "*",

    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],

    credentials: true,
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
);
//http logger

app.use(routes);

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  console.log("Welcome to server chat");
  console.log("a user connection ", socket.id);
  socket.on("send", function (data) {
    console.log(data);
    io.sockets.emit("send", data);
  });
});
