const { gameEvents } = require("./gameEngine");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Send real-time events
    gameEvents.on("roundStart", (data) => socket.emit("roundStart", data));
    gameEvents.on("multiplierUpdate", (multiplier) =>
      socket.emit("multiplier", multiplier)
    );
    gameEvents.on("roundCrash", (data) => socket.emit("roundCrash", data));

    socket.on("cashout", (data) => {
      // Validate and emit back
      console.log("Cashout requested:", data);
      socket.emit("cashoutSuccess", data);
    });
  });
};

module.exports = socketHandler;
