const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const EventEmitter = require("events");
const gameEvents = new EventEmitter();

let currentMultiplier = 1.0;
let crashPoint = 0;
let roundId = uuidv4();
let startTime;
let growthFactor = 0.005; // tweak for speed
let interval;

const getProvablyFairCrashPoint = (roundId) => {
  const seed = "some-static-secret";
  const hash = crypto.createHash("sha256").update(seed + roundId).digest("hex");
  const int = parseInt(hash.substring(0, 8), 16);
  return (int % 10000) / 100 + 1.0; // 1.00x to 100.00x
};

const startGameRound = () => {
  currentMultiplier = 1.0;
  roundId = uuidv4();
  startTime = Date.now();
  crashPoint = getProvablyFairCrashPoint(roundId);

  gameEvents.emit("roundStart", { roundId, crashPoint });

  interval = setInterval(() => {
    const timeElapsed = (Date.now() - startTime) / 1000;
    currentMultiplier = 1 + timeElapsed * growthFactor;

    if (currentMultiplier >= crashPoint) {
      clearInterval(interval);
      gameEvents.emit("roundCrash", { crashPoint, roundId });
    } else {
      gameEvents.emit("multiplierUpdate", currentMultiplier);
    }
  }, 100);
};

setInterval(startGameRound, 10000); // every 10s

module.exports = { gameEvents, startGameRound };
