const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Your MongoDB Atlas Connection String
const uri = "mongodb+srv://aniszahirah_db_user:nHp3lPm2rF33svVO@cluster0.wmhmpeu.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let collection;

async function run() {
  try {
    await client.connect();
    const db = client.db("factoryDB");
    collection = db.collection("records");
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}
run();

// API to save a record
app.post('/api/records', async (req, res) => {
  try {
    if (!collection) return res.status(500).json({ error: "Database not connected yet" });
    const result = await collection.insertOne(req.body);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to fetch all records
app.get('/api/records', async (req, res) => {
  try {
    if (!collection) return res.status(500).json({ error: "Database not connected yet" });
    const records = await collection.find({}).toArray();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve the HTML portal file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});