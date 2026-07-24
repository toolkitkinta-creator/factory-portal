const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Servis fail frontend dari direktori projek yang sama
app.use(express.static(__dirname));

// Sambungan ke MongoDB Atlas (menggunakan database name: factoryDB)[cite: 1]
const uri = "mongodb+srv://aniszahirah_db_user:nHp3lPm2rF33svVO@cluster0.wmhmpeu.mongodb.net/factoryDB?appName=Cluster0";

mongoose.connect(uri)
  .then(() => console.log("Berjaya sambung ke MongoDB Atlas"))
  .catch(err => console.error("Ralat sambungan MongoDB:", err));

// Skema & Model Data Rekod Kilang
const recordSchema = new mongoose.Schema({
    timestamp: String,
    stage: String,
    batchId: String,
    operator: String,
    date: String,
    size: String,
    summary: String
});

const Record = mongoose.model('Record', recordSchema);

// API untuk terima data (POST) daripada frontend
app.post('/api/records', async (req, res) => {
    try {
        const newRecord = new Record(req.body);
        await newRecord.save();
        res.json({ success: true, message: 'Data berjaya disimpan ke database!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// API untuk ambil senarai data (GET) untuk paparan jadual
app.get('/api/records', async (req, res) => {
    try {
        const records = await Record.find();
        res.json(records);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route asas untuk memastikan aplikasi memaparkan app.html secara langsung
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
