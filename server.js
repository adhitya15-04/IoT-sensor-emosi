const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost/iot_emosi', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Skema & Model MongoDB
const EmosiSchema = new mongoose.Schema({
  emosi: String,
  waktu: { type: Date, default: Date.now }
});
const Emosi = mongoose.model('Emosi', EmosiSchema);

// Routing statis ke folder public
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io untuk menerima data dari frontend
io.on('connection', (socket) => {
  console.log('👤 Client terhubung');

  socket.on('deteksiEmosi', async (data) => {
    console.log('🔍 Emosi terdeteksi:', data);
    await new Emosi({ emosi: data }).save();
  });

  socket.on('disconnect', () => {
    console.log('👤 Client terputus');
  });
});

// Jalankan server
server.listen(3000, () => {
  console.log('🚀 Server berjalan di http://localhost:3000');
});
