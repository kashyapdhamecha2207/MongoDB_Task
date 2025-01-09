const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "LinkedIn";

// Middleware
app.use(express.json());

let db, users;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        users = db.collection("users");

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

// GET: List all users
app.get('/users', async (req, res) => {
    try {
        const allusers = await users.find().toArray();
        res.status(200).json(allusers);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});

// POST: Add a new users
app.post('/users', async (req, res) => {
    try {
        console.log("Request Object : ", req)
        console.log("Request Body : ", req.body)
        const newusers = req.body;
        const result = await users.insertOne(newusers);
        res.status(201).send(`users added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding users: " + err.message);
    }
});

// PUT: Update a users completely
app.put('/users/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const updatedusers = req.body;
        const result = await users.replaceOne({ userId }, updatedusers);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating users: " + err.message);
    }
});

// PATCH: Partially update a users
app.patch('/users/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const updates = req.body;
        const result = await users.updateOne({ userId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating users: " + err.message);
    }
});


// DELETE: Remove a users
app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const result = await users.deleteOne({ userId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting users: " + err.message);
    }
});