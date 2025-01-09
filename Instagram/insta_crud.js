const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://localhost:27017/"; 
const dbName = "instagram_crud";

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
        posts = db.collection("posts");
        comments = db.collection("comments");
        followers = db.collection("followers");
        stories = db.collection("stories");

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

//=================================================== Users Collections =================================================== //

// GET: List all Users
app.get('/users', async (req, res) => {
    try {
        const allUsers = await users.find().toArray();
        res.status(200).json(allUsers);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching users: " + err.message);
    }
});

// GET: Using UserID List all Users
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

// POST: Add a new users
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


// PATCH: Partially update a users
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

// DELETE: Remove a users
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

//=================================================== Posts Collections =================================================== //

//GET: List all Posts
app.get('/posts', async (req, res) => {
    try {
        const allPosts = await posts.find().toArray();
        res.status(200).json(allPosts);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching posts: " + err.message);
    }
});

//GET: Using PostID List all Posts
app.get('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId; 
        if (!postId || typeof postId !== 'string') {
            return res.status(400).json({ error: 'Invalid post ID format' });
        }
        const post = await posts.findOne({ postId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});


//POST: Add a new posts
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

//PATCH: Partially update a posts
app.patch('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const updates = req.body;
        const result = await posts.updateOne({ postId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error partially updating posts: " + err.message);
    }
});

//DELETE: Remove a posts
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

//=================================================== Comments Collections =================================================== //

//GET: List all Comments
app.get('/comments', async (req, res) => {
    try {
        const allComments = await comments.find().toArray();
        res.status(200).json(allComments);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching comments: " + err.message);
    }
});

//POST: Add a new Comments
app.post('/comments', async (req, res) => {
    try {
        const newComments = req.body;
        const result = await comments.insertOne(newComments);
        res.status(201).send(`Comments added with ID: ${result.insertedId}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding comments: " + err.message);
    }
});

//PATCH: Partially update a Comments
app.patch('/comments/:commentId', async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const updates = req.body;
        const result = await comments.updateOne({ commentId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error partially updating comments: " + err.message);
    }
});

//DELETE: Remove a Comments
app.delete('/comments/:commentId', async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const result = await comments.deleteMany({ commentId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting comments: " + err.message);
    }
});

//=================================================== Followers Collections =================================================== //

//GET: List all Followers
app.get('/followers', async (req, res) => {
    try {
        const allFollowers = await followers.find().toArray();
        res.status(200).json(allFollowers);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching followers: " + err.message);
    }
});

//POST: Add a new Followers
app.post('/followers', async (req, res) => {
    try {
        const newFollowers = req.body;
        const result = await followers.insertOne(newFollowers);
        res.status(201).send(`Users added with ID: ${result.insertedId}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding followers: " + err.message);
    }
});

//DELETE: Remove a Followers
app.delete('/followers/:followerId', async (req, res) => {
    try {
        const followerId = req.params.followerId; 
        const result = await followers.deleteMany({ followerId });
        if (result.deletedCount > 0) {
            res.status(200).send(`${result.deletedCount} document(s) deleted`);
        } else {
            res.status(404).send(`No followers found with followerId: ${followerId}`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting followers: " + err.message);
    }
});


//=================================================== Stories Collections =================================================== //

//GET: List all Stories
app.get('/stories', async (req, res) => {
    try {
        const allStories = await stories.find().toArray();
        res.status(200).json(allStories);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching stories: " + err.message);
    }
});

//POST: Add a new Stories
app.post('/stories', async (req, res) => {
    try {
        const newStories = req.body;
        const result = await stories.insertOne(newStories);
        res.status(201).send(`Stories added with ID: ${result.insertedId}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding stories: " + err.message);
    }
});

//DELETE: Remove a Stories
app.delete('/stories/:storyId', async (req, res) => {
    try {
        const storyId = req.params.storyId; 
        const result = await stories.deleteMany({ storyId });
        
        if (result.deletedCount > 0) {
            res.status(200).send(`${result.deletedCount} document(s) deleted`);
        } else {
            res.status(404).send(`No stories found with storyId: ${storyId}`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting stories: " + err.message);
    }
});


//=================================================== Compelate Instagram Query Task =================================================== //