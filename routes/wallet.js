const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const { fetchPrices } = require("../services/cryptoService");

// @route GET /wallet/:playerId
router.get("/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ error: "Player not found" });

    const prices = await fetchPrices();
    const btcUsd = prices.BTC;
    const ethUsd = prices.ETH;

    const wallet = player.wallet;
    const usdValue = (wallet.BTC * btcUsd) + (wallet.ETH * ethUsd);

    res.json({
      wallet: {
        BTC: wallet.BTC,
        ETH: wallet.ETH,
        USD_Equivalent: usdValue.toFixed(2),
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
