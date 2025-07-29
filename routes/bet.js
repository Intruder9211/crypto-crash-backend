const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Transaction = require("../models/Transaction");
const { fetchPrices } = require("../services/cryptoService");
const { v4: uuidv4 } = require("uuid");

// @route POST /bet
router.post("/", async (req, res) => {
  const { playerId, usdAmount, currency } = req.body;

  if (!["BTC", "ETH"].includes(currency)) {
    return res.status(400).json({ error: "Invalid currency" });
  }

  if (usdAmount <= 0) {
    return res.status(400).json({ error: "USD amount must be positive" });
  }

  try {
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ error: "Player not found" });

    const prices = await fetchPrices();
    const price = prices[currency];

    const cryptoAmount = usdAmount / price;
    if (player.wallet[currency] < cryptoAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Deduct from wallet
    player.wallet[currency] -= cryptoAmount;
    await player.save();

    // Log transaction
    const tx = new Transaction({
      playerId,
      usdAmount,
      cryptoAmount,
      currency,
      transactionType: "bet",
      transactionHash: uuidv4(),
      priceAtTime: price,
    });
    await tx.save();

    res.json({
      message: "Bet placed",
      cryptoAmount,
      transactionHash: tx.transactionHash,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
