const express = require("express");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./config/index");
const cors = require("cors");
const User = require("./models/users");
const Message = require("./models/messages");
const { responseServerError } = require("./helper/ResponseRequests");
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

///
const users = {};

const socketToRoom = {};

io.on("connection", async (socket) => {
  const username = socket.handshake.query["username"];
  let user;
  try {
    user = await User.findOneAndUpdate(
      {
        username: username,
      },
      {
        socket_id: socket.id,
        status: "Online",
      }
    ).populate("friends");
  } catch (err) {
    return responseServerError({ res, err: err.message });
  }
  if (Array.isArray(user?.friends)) {
    user.friends.forEach((user) => {
      if (user.socket_id) {
        socket.to(user.socket_id).emit("online", { status: "online", friendId: user._id });
      }
    });
  }
  socket.on("send_friendly_request", async function (data) {
    const { sender, recipient } = data;
    const userRecipient = await User.findById(recipient);
    const userSender = await User.findById(sender);
    const dt = { ...data, user: userSender };
    socket.to(userRecipient.socket_id).emit("received_friendly_request", dt);
  });
  //accept friend request
  socket.on("accept_friendly_request", async function (data) {
    const { sender, recipient } = data;
    const userSender = await User.findById(sender);
    const userRecipient = await User.findById(recipient);
    if (!userSender.friends.includes(recipient)) {
      userSender.friends.push(recipient);
    }

    if (!userRecipient.friends.includes(sender)) {
      userRecipient.friends.push(sender);
    }
    await userSender.save({ new: true, validateModifiedOnly: true });
    await userRecipient.save({ new: true, validateModifiedOnly: true });
    socket.emit("accept_success", "success");
    socket.to(userSender.socket_id).emit("accept_success", "success");
  });
  socket.on("start_conversation", async function (data) {
    const { to, from } = data;

    //check existing conversation
    const existing_conversations = await Message.find({
      participants: { $size: 2, $all: [to, from] },
    }).select(["_id", "participants"]);
    if (existing_conversations.length === 0) {
      let new_chat = await Message.create({
        participants: [to, from],
      }).select(["_id", "participants"]);
      socket.emit("start_chat", new_chat);
      ///test
      socket.join(new_chat._id);
      //////
    } else {
      socket.emit("start_chat", existing_conversations[0]);
      ///tets
      socket.join(existing_conversations[0]._id);
      /////
    }
  });
  socket.on("send_message", async function (data) {
    const { conversation_id, to, from, message, type } = data;
    const conversation = await Message.findById(conversation_id);
    const to_user = await User.findById(to);
    const from_user = await User.findById(from);
    const new_chat = {
      to: to,
      from: from,
      type: type,
      created_at: Date.now(),
      text: message,
    };
    conversation.messages.push(new_chat);
    await conversation.save({ new: true, validateModifiedOnly: true });

    socket.emit("new_message", {
      conversation_id,
      message: new_chat,
    });
    socket.to(from_user.socket_id).emit("new_message", {
      conversation_id,
      message: new_chat,
    });
  });
  //////////////////////////////etsttttt

  socket.on("callUser", async (data) => {
    const userToCall = await User.findById(data.userToCall);
    io.to(userToCall.socket_id).emit("hey", { signal: data.signal, from: data.userCall });
  });

  socket.on("acceptCall", async (data) => {
    const user = await User.findById(data.to);
    io.to(user.socket_id).emit("callAccepted", data.signal);
  });
  ///////////////////////////////////

  ///socket off
  socket.on("disconnect", async function (data) {
    try {
      user = await User.findOneAndUpdate(
        {
          username: username,
        },
        {
          socket_id: socket.id,
          status: "Offline",
        }
      ).populate("friends");
    } catch (err) {
      return responseServerError({ res, err: err.message });
    }
    if (Array.isArray(user?.friends)) {
      user.friends.forEach((user) => {
        if (user.socket_id) {
          socket.to(user.socket_id).emit("offline", { status: "offline", friendId: user._id });
        }
      });
    }
  });
});
