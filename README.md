# 💥 Crypto Crash Backend

This is a full-featured backend for a real-time crypto crash game — inspired by games like Bustabit.  
It includes a live multiplier engine, WebSocket-based real-time updates, betting and cashout logic, and a basic test frontend inside `public/test-client.html`.



## 🚀 Features

- 🎰 Real-time multiplier generator (with crash point)
- 📡 WebSocket events for game updates
- 🧾 Player wallet with BTC/ETH balances
- 💸 Bet & Cashout APIs
- 🧪 Built-in HTML test client
- 🛢 MongoDB-powered persistent storage



## 🧠 Tech Stack

- **Node.js + Express.js**
- **MongoDB + Mongoose**
- **Socket.IO (WebSockets)**
- **Pure HTML/CSS for test UI**



## 📂 Folder Structure



crypto-crash-backend/
├── models/              # Mongoose schemas (Player, Transaction)
├── public/              # Static frontend (test-client.html)
├── routes/              # API routes for wallet, bet, cashout
├── services/            # Utility files (e.g., price logic)
├── socket.js            # WebSocket handlers
├── gameEngine.js        # Core game loop & multiplier logic
├── server.js            # Main Express server
├── .env                 # MongoDB config (not included in repo)



## 🛠️ Installation

bash
git clone https://github.com/<your-username>/crypto-crash-backend.git
cd crypto-crash-backend
npm install


Create a `.env` file:

env
MONGO_URI=mongodb://localhost:27017/crypto_crash
PORT=3000


Then run:

npm run dev

## 🌐 Access the Test Frontend

Once server is running, open:

http://localhost:3000/test-client.html

You'll see:

* Live multiplier
* Wallet balance
* Cashout button
* Real-time crash logs


## 🔌 WebSocket Events

| Event           | Sent By Server                     |
| --------------- | ---------------------------------- |
| `roundStart`    | New round begins                   |
| `multiplier`    | Multiplier updated every 100ms     |
| `roundCrash`    | Crash happens                      |
| `playerCashout` | Broadcast when a player cashes out |


## 📬 API Endpoints

### `GET /wallet/:playerId`

Returns player's wallet with BTC/ETH and USD equivalent.


### `POST /bet`

{
  "playerId": "64abc123...",
  "usdAmount": 10,
  "currency": "BTC"
}

### `POST /cashout`


{
  "playerId": "64abc123...",
  "cryptoAmount": 0.0001,
  "currency": "BTC"
}


## 🧪 Seeding a Player

If `players` collection is empty:


db.players.insertOne({
  username: "test_user",
  wallet: {
    BTC: 0.002,
    ETH: 0.01,
    USD_Equivalent: 150
  }
})


Copy the generated `_id` and update it in `test-client.html`.

## 📦 Future Plans

* ✅ Bet placement form
* ✅ History & round tracking
* 🔒 Authentication
* 📊 Admin dashboard
* 💰 Provably fair logic

## 📄 License

MIT — use it, improve it, fork it 🔓

> Built with 💚 by Mohit



