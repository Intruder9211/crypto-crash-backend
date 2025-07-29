// 🔧 Required modules
const path = require("path");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socket");
const { startGameRound } = require("./gameEngine");

// 📦 Express + HTTP + Socket setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io);

// 🔧 Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // 👈 Serve test-client.html

// 🚀 Routes
const walletRoutes = require("./routes/wallet");
const betRoutes = require("./routes/bet");
const cashoutRoutes = require("./routes/cashout");

app.use("/wallet", walletRoutes);
app.use("/bet", betRoutes);
app.use("/cashout", cashoutRoutes);

// 🌐 Fallback route (browser pe khud khulega)
app.get("/", (req, res) => {
  res.send("🚀 Crypto Crash Backend is running!");
});

// 🧠 MongoDB Connection
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
  startGameRound(); // 🌀 Start crash loop after DB is ready
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
});

// 🔌 Attach WebSocket logic
socketHandler(io);

// 🟢 Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
