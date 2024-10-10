const express = require("express");
const dotenv = require("dotenv");
const user = require("./routes/user");
const serviceprovider = require("./routes/serviceprovider");
const booking = require("./routes/booking");
const rating = require("./routes/rating");
const location = require("./routes/location");
const distance = require("./routes/distance");
const notify = require("./routes/notify");
const chat = require("./routes/chat");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a specific conversation (room)
  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });

  // Handle sending messages
  socket.on('sendMessage', ({ conversationId, senderId, content }) => {
    const message = {
      senderId,
      content,
      createdAt: new Date(),
    };

    // Emit the message to everyone in the conversation (room)
    io.to(conversationId).emit('receiveMessage', message);
    
    // Optionally, save the message to the database here.
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1/user", user);
app.use("/api/v1/serviceprovider", serviceprovider);
app.use("/api/v1/booking", booking);
app.use("/api/v1/rating", rating);
app.use("/api/v1/location", location);
app.use("/api/v1/distance", distance);
app.use("/api/v1/chat",chat);
app.use("/api/v1/notify",notify);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("connection successful"))
//   .catch((err) => {
//     console.log(err);
//   });

server.listen(process.env.PORT, () => {
  console.log("listening on port 3300");
});
