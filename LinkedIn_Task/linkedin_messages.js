const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 4000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "LinkedIn";

// Middleware
app.use(express.json());

let db, messages;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        messages = db.collection("messages");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

// GET: List all messages
app.get('/messages', async (req, res) => {
    try {
        const allmessages = await messages.find().toArray();
        res.status(200).json(allmessages);
    } catch (err) {
        res.status(500).send("Error fetching messages: " + err.message);
    }
});

// POST: Add a new messages
app.post('/messages', async (req, res) => {
    try {
        console.log("Request Object : ", req)
        console.log("Request Body : ", req.body)
        const newmessages = req.body;
        const result = await messages.insertOne(newmessages);
        res.status(201).send(`messages added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding messages: " + err.message);
    }
});

// PUT: Update a messages completely
app.put('/messages/:messageId', async (req, res) => {
    try {
        const messageId = parseInt(req.params.messageId);
        const updatedmessages = req.body;
        const result = await messages.replaceOne({ messageId }, updatedmessages);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating messages: " + err.message);
    }
});

// PATCH: Partially update a messages
app.patch('/messages/:messageId', async (req, res) => {
    try {
        const messageId = parseInt(req.params.messageId);
        const updates = req.body;
        const result = await messages.updateOne({ messageId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating messages: " + err.message);
    }
});


// DELETE: Remove a messages
app.delete('/messages/:messageId', async (req, res) => {
    try {
        const messageId = parseInt(req.params.messageId);
        const result = await messages.deleteOne({ messageId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting messages: " + err.message);
    }
});