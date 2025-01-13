const express = required('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB Connection details
const uri = "mongodb://localhost:27017";        
const dbName = "linkedin_crud";

app.use(express.json());

let db, users;

// connect to MongoDB and initialize collection
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        users = db.collection('users');
        connetions = db.collection('connections');
        posts = db.collection('posts');
        messages = db.collection('messages');

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server started on http://localhost:${port}`);
        });
    } catch (err) {
        console.log(err);
        process.exit(1);// Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes 

//=================================================== Users Collections =================================================== //

//GET: List all users
app.get('/users', async (req, res) => {
    try {
        const Allusers = await users.find().toArray();
        res.status(200).json(Allusers)
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching users: " + err.message);
    }
});

//GET:Using userId List all Users
app.get('/users/:userId', async (req, res) => {
    try {
        const user = await users.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//POST: Create a new user
app.post('/users', async (req, res) => {
    try {
        const newUsers = req.body;
        const result = await users.insertOne(newUsers);
        res.status(201).send(`Users added with ID: ${result.insertedId}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding users: " + err.message);
    }
});

//PATCH: Update a user
app.patch('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;  
        const updates = req.body;
        const result = await users.updateOne(
            { userId: userId },  
            { $set: updates }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: `${result.modifiedCount} document(s) updated`,
            modifiedCount: result.modifiedCount
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//DELETE: Delete a user
app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;  
        const result = await users.deleteOne({ userId: userId });  
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: `User successfully deleted`,
            deletedCount: result.deletedCount
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});


//=================================================== Connections Collections =================================================== //

//GET: List all connections
app.get('/connections', async (req, res) => {
    try {
        const Allconnections = await connections.find().toArray();
        res.status(200).json(Allconnections)
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching connections: " + err.message);
    }
});

//POST: Create a new connection
app.post('/connections', async (req, res) => {
    try {
        const newConnections = req.body;
        const result = await connections.insertOne(newConnections);
        res.status(201).send(`Connections added with ID: ${result.insertedId}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding connections: " + err.message);
    }
});

//PATCH: Update a connection
app.patch('/connections/:connectionId', async (req, res) => {
    try {
        const connectionId = req.params.connectionId;  
        const updates = req.body;
        const result = await connections.updateOne(
            { connectionId: connectionId },  
            { $set: updates }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Connection not found' });
        }
        res.status(200).json({
            message: `${result.modifiedCount} document(s) updated`,
            modifiedCount: result.modifiedCount
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//DELETE: Delete a connection
app.delete('/connections/:connectionId', async (req, res) => {
    try {
        const connectionId = req.params.connectionId;  
        const result = await connections.deleteOne({ connectionId: connectionId });  
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Connection not found' });
        }
        res.status(200).json({
            message: `Connection successfully deleted`,
            deletedCount: result.deletedCount
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});


//=================================================== Posts Collections =================================================== //

//GET: List all posts
app.get('/posts', async (req, res) => {
    try {
        const Allposts = await posts.find().toArray();
        res.status(200).json(Allposts)
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching posts: " + err.message);
    }
});

//GET:Using postId List all Posts
app.get('/posts/:postId', async (req, res) => {
    try {
        const post = await posts.findOne({ postId: req.params.postId });
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//POST: Create a new post
app.post('/posts', async (req, res) => {
    try {
        const newPosts = req.body;
        const result = await posts.insertOne(newPosts);
        res.status(201).send(`Posts added with ID: ${result.insertedId}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding posts: " + err.message);
    }
});

//PATCH: Update a post
app.patch('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;  
        const updates = req.body;
        const result = await posts.updateOne(
            { postId: postId },  
            { $set: updates }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({
            message: `${result.modifiedCount} document(s) updated`,
            modifiedCount: result.modifiedCount
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//DELETE: Delete a post
app.delete('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const result = await posts.deleteMany({ postId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting posts: " + err.message);
    }
});


//=================================================== Messages Collections =================================================== //

//GET: List all messages
app.get('/messages', async (req, res) => {
    try {
        const Allmessages = await messages.find().toArray();
        res.status(200).json(Allmessages)
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching messages: " + err.message);
    }
});

//POST: Create a new message
app.post('/messages', async (req, res) => {
    try {
        const newMessages = req.body;
        const result = await messages.insertOne(newMessages);
        res.status(201).send(`Messages added with ID: ${result.insertedId}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding messages: " + err.message);
    }
});

//DELETE: Delete a message
app.delete('/messages/:messageId', async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const result = await messages.deleteMany({ messageId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting messages: " + err.message);
    }
});


//=================================================== Miscellaneous =================================================== //

//GET: Fetch profile views count
app.get('/users/:userId/profile-views', async (req, res) => {
    try {
        const user = await users.findOne({ userId: req.params.userId }, { projection: { profileViews: 1 } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ profileViews: user.profileViews });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//PUT: Add a skill to a user
app.put('/users/:userId/skills', async (req, res) => {
    try {
        const userId = req.params.userId;
        const skill = req.body.skill;
        const result = await users.updateOne({ userId: userId }, { $push: { skills: skill } });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Skill added successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//PATCH: Upgrade to premium account
app.patch('/users/:userId/premium', async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await users.updateOne({ userId: userId }, { $set: { isPremium: true } });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User upgraded to premium successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});