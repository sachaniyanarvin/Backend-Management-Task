const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://localhost:27017/"; 
const dbName = "youtube_clone";

// Middleware
app.use(express.json());

let db, users, videos, comments, playlists, subscriptions;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        users = db.collection("users");
        videos = db.collection("videos");
        comments = db.collection("comments");
        playlists = db.collection("playlists");
        subscriptions = db.collection("subscriptions");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

// Initialize Database
initializeDatabase();

//=================================================== Users Collections =================================================== //

app.get('/users', async (req, res) => {
    try {
        const allUsers = await users.find().toArray();
        res.status(200).json(allUsers);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching users: " + err.message);
    }
});

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

app.post('/users', async (req, res) => {
    try {
        const newUser = {
            ...req.body,
            subscribers: 0,
            joinedDate: new Date()
        };
        const result = await users.insertOne(newUser);
        res.status(201).json({ message: "User created successfully", userId: result.insertedId });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding user: " + err.message);
    }
});

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

//=================================================== Videos Collections =================================================== //

app.get('/videos', async (req, res) => {
    try {
        const allVideos = await videos.find().toArray();
        res.status(200).json(allVideos);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching videos: " + err.message);
    }
});

app.get('/videos/:videoId', async (req, res) => {
    try {
        const video = await videos.findOne({ videoId: req.params.videoId });
        if (!video) return res.status(404).json({ message: 'Video not found' });
        res.status(200).json(video);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/videos', async (req, res) => {
    try {
        const newVideo = {
            ...req.body,
            views: 0,
            likes: 0,
            dislikes: 0,
            uploadDate: new Date()
        };
        const result = await videos.insertOne(newVideo);
        res.status(201).json({ message: "Video uploaded successfully", videoId: result.insertedId });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error uploading video: " + err.message);
    }
});

app.patch('/videos/:videoId/likes', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const result = await videos.updateOne(
            { videoId: videoId },
            { $inc: { likes: 1 } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.status(200).json({ message: "Video likes updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/videos/:videoId', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const result = await videos.deleteOne({ videoId: videoId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.status(200).json({ message: "Video deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//=================================================== Comments Collections =================================================== //

app.get('/videos/:videoId/comments', async (req, res) => {
    try {
        const videoComments = await comments.find({ videoId: req.params.videoId }).toArray();
        res.status(200).json(videoComments);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/comments', async (req, res) => {
    try {
        const newComment = {
            ...req.body,
            likes: 0,
            postedAt: new Date()
        };
        const result = await comments.insertOne(newComment);
        res.status(201).json({ message: "Comment added successfully", commentId: result.insertedId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.patch('/comments/:commentId/likes', async (req, res) => {
    try {
        const result = await comments.updateOne(
            { commentId: req.params.commentId },
            { $inc: { likes: 1 } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: "Comment likes updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/comments/:commentId', async (req, res) => {
    try {
        const result = await comments.deleteOne({ commentId: req.params.commentId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//=================================================== Playlists Collections =================================================== //

app.get('/playlists/:userId', async (req, res) => {
    try {
        const userPlaylists = await playlists.find({ userId: req.params.userId }).toArray();
        res.status(200).json(userPlaylists);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/playlists', async (req, res) => {
    try {
        const newPlaylist = {
            ...req.body,
            videos: [],
            createdDate: new Date()
        };
        const result = await playlists.insertOne(newPlaylist);
        res.status(201).json({ message: "Playlist created successfully", playlistId: result.insertedId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/playlists/:playlistId/videos', async (req, res) => {
    try {
        const result = await playlists.updateOne(
            { playlistId: req.params.playlistId },
            { $push: { videos: req.body.videoId } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json({ message: "Video added to playlist successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/playlists/:playlistId', async (req, res) => {
    try {
        const result = await playlists.deleteOne({ playlistId: req.params.playlistId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json({ message: "Playlist deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//=================================================== Subscriptions Collections =================================================== //

app.get('/subscriptions/:userId', async (req, res) => {
    try {
        const userSubscriptions = await subscriptions.find({ subscriber: req.params.userId }).toArray();
        res.status(200).json(userSubscriptions);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/subscriptions', async (req, res) => {
    try {
        const newSubscription = {
            ...req.body,
            subscribedAt: new Date()
        };
        const result = await subscriptions.insertOne(newSubscription);
        
        // Update subscriber count for the channel
        await users.updateOne(
            { userId: req.body.channel },
            { $inc: { subscribers: 1 } }
        );
        
        res.status(201).json({ message: "Subscription added successfully", subscriptionId: result.insertedId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});