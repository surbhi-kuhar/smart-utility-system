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
const payment = require("./routes/payment");
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
  
  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });

  socket.on('sendMessage', ({ conversationId, senderId, content }) => {
    const message = {
      senderId,
      content,
      createdAt: new Date(),
    };

    io.to(conversationId).emit('receiveMessage', message);
    
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
app.use("/api/v1/payment",payment);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("connection successful"))
//   .catch((err) => {
//     console.log(err);
//   });

server.listen(process.env.PORT, () => {
  console.log("listening on port 3300");
});
