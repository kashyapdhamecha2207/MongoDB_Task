const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 6000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "LinkedIn";

// Middleware
app.use(express.json());

let db, connections;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        connections = db.collection("connections");

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

// GET: List all connections
app.get('/connections', async (req, res) => {
    try {
        const allconnections = await connections.find().toArray();
        res.status(200).json(allconnections);
    } catch (err) {
        res.status(500).send("Error fetching connections: " + err.connections);
    }
});

// POST: Add a new connections
app.post('/connections', async (req, res) => {
    try {
        console.log("Request Object : ", req)
        console.log("Request Body : ", req.body)
        const newconnections = req.body;
        const result = await connections.insertOne(newconnections);
        res.status(201).send(`connections added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding connections: " + err.message);
    }
});

// PUT: Update a connections completely
app.put('/connections/:connectionId', async (req, res) => {
    try {
        const connectionId = parseInt(req.params.connectionId);
        const updatedconnections = req.body;
        const result = await connections.replaceOne({ connectionId }, updatedconnections);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating connections: " + err.connections);
    }
});

// PATCH: Partially update a connections
app.patch('/connections/:connectionId', async (req, res) => {
    try {
        const connectionId = parseInt(req.params.connectionId);
        const updates = req.body;
        const result = await connections.updateOne({ connectionId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating connections: " + err.connections);
    }
});


// DELETE: Remove a connections
app.delete('/connections/:connectionId', async (req, res) => {
    try {
        const connectionId = parseInt(req.params.connectionId);
        const result = await connections.deleteOne({ connectionId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting connections: " + err.connections);
    }
});