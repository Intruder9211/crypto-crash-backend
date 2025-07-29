const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Transaction = require("../models/Transaction");
const { fetchPrices } = require("../services/cryptoService");
const { v4: uuidv4 } = require("uuid");

// Mock multiplier (actual multiplier should come from gameEngine)
let currentMultiplier = 2.0; // Replace with real-time value later

router.post("/", async (req, res) => {
  const { playerId, cryptoAmount, currency } = req.body;

  try {
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ error: "Player not found" });

    const prices = await fetchPrices();
    const price = prices[currency];

    const payout = cryptoAmount * currentMultiplier;
    player.wallet[currency] += payout;
    await player.save();

    const tx = new Transaction({
      playerId,
      usdAmount: payout * price,
      cryptoAmount: payout,
      currency,
      transactionType: "cashout",
      transactionHash: uuidv4(),
      priceAtTime: price,
    });
    await tx.save();

    // TODO: Broadcast via WebSocket
    req.app.get("io").emit("playerCashout", {
      playerId,
      payout,
      usd: payout * price,
      multiplier: currentMultiplier,
    });

    res.json({
      message: "Cashout successful",
      payout,
      usdEquivalent: (payout * price).toFixed(2),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
