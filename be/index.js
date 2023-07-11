const express = require("express");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./config/index");
const cors = require("cors");
const User = require("./models/users");
const Message = require("./models/messages");
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
  const username = socket.handshake.query["username"];

  try {
    const user = await User.findOneAndUpdate(
      {
        username: username,
      },
      {
        socket_id: socket.id,
        status: "Online",
      }
    );
  } catch (err) {
    console.log(err);
  }
  //send request friend
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
  });
  socket.on("start_conversation", async function (data) {
    const { to, from } = data;

    //check existing conversation
    const existing_conversations = await Message.find({
      participants: { $size: 2, $all: [to, from] },
    });
    if (existing_conversations.length === 0) {
      let new_chat = await Message.create({
        participants: [to, from],
      });
      socket.emit("start_chat", new_chat);
    } else {
      socket.emit("start_chat", existing_conversations[0]);
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
    console.log({
      conversation_id,
      message: new_chat,
    });
    // socket.to(to_user.socket_id).emit("new_message", {
    //   conversation_id,
    //   message: new_chat,
    // });
    socket.emit("new_message", {
      conversation_id,
      message: new_chat,
    });
    socket.to(from_user.socket_id).emit("new_message", {
      conversation_id,
      message: new_chat,
    });
  });

  ///socket off
  // socket.on("disconnect", async function (data) {
  //   await User.findByIdAndUpdate(user_id, {
  //     status: "Offline",
  //   });
  //   console.log("user offline");
  // });
});
