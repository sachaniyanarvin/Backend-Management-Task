const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://localhost:27017/";
const dbName = "github_clone";

// Middleware
app.use(express.json());

let db, users, repositories, issues, pullRequests, commits, forks, stars;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        users = db.collection("users");
        repositories = db.collection("repositories");
        issues = db.collection("issues");
        pullRequests = db.collection("pullRequests");
        commits = db.collection("commits");
        forks = db.collection("forks");
        stars = db.collection("stars");

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

//=================================================== Users Management =================================================== //

app.get('/users', async (req, res) => {
    try {
        const allUsers = await users.find({}).toArray();
        res.status(200).json(allUsers);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/users/:userId', async (req, res) => {
    try {
        const user = await users.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/users', async (req, res) => {
    try {
        const newUser = {
            ...req.body,
            repositories: [],
            followers: 0,
            following: 0,
            isVerified: false
        };
        const result = await users.insertOne(newUser);
        res.status(201).json({ message: 'User created', userId: result.insertedId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.patch('/users/:userId', async (req, res) => {
    try {
        const result = await users.updateOne(
            { userId: req.params.userId },
            { $set: req.body }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/users/:userId', async (req, res) => {
    try {
        const result = await users.deleteOne({ userId: req.params.userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//=================================================== Repositories Management =================================================== //

app.get('/repositories', async (req, res) => {
    try {
        const allRepos = await repositories.find({}).toArray();
        res.status(200).json(allRepos);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/repositories/:repoId', async (req, res) => {
    try {
        const repo = await repositories.findOne({ repoId: req.params.repoId });
        if (!repo) return res.status(404).json({ message: 'Repository not found' });
        res.status(200).json(repo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/repositories', async (req, res) => {
    try {
        const newRepo = {
            ...req.body,
            stars: 0,
            forks: 0,
            issues: [],
            pullRequests: [],
            createdAt: new Date()
        };
        const result = await repositories.insertOne(newRepo);
        res.status(201).json({ message: 'Repository created', repoId: result.insertedId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.patch('/repositories/:repoId', async (req, res) => {
    try {
        const result = await repositories.updateOne(
            { repoId: req.params.repoId },
            { $set: req.body }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Repository not found' });
        }
        res.status(200).json({ message: 'Repository updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/repositories/:repoId', async (req, res) => {
    try {
        const result = await repositories.deleteOne({ repoId: req.params.repoId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Repository not found' });
        }
        res.status(200).json({ message: 'Repository deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//=================================================== Issues Management =================================================== //

app.get('/repositories/:repoId/issues', async (req, res) => {
    try {
        const repoIssues = await issues.find({ repoId: req.params.repoId }).toArray();
        res.status(200).json(repoIssues);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/issues', async (req, res) => {
    try {
        const newIssue = {
            ...req.body,
            status: 'open',
            createdAt: new Date(),
            closedAt: null
        };
        const result = await issues.insertOne(newIssue);
        res.status(201).json({ message: 'Issue created', issueId: result.insertedId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.patch('/issues/:issueId/status', async (req, res) => {
    try {
        const result = await issues.updateOne(
            { issueId: req.params.issueId },
            { $set: { status: req.body.status } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Issue not found' });
        }
        res.status(200).json({ message: 'Issue status updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/issues/:issueId', async (req, res) => {
    try {
        const result = await issues.deleteOne({ issueId: req.params.issueId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Issue not found' });
        }
        res.status(200).json({ message: 'Issue deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//=================================================== Pull Requests Management =================================================== //

app.get('/repositories/:repoId/pull-requests', async (req, res) => {
    try {
        const repoPRs = await pullRequests.find({ repoId: req.params.repoId }).toArray();
        res.status(200).json(repoPRs);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/pull-requests', async (req, res) => {
    try {
        const newPR = {
            ...req.body,
            status: 'open',
            createdAt: new Date(),
            mergedAt: null
        };
        const result = await pullRequests.insertOne(newPR);
        res.status(201).json({ message: 'Pull request created', prId: result.insertedId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/pull-requests/:prId', async (req, res) => {
    try {
        const result = await pullRequests.deleteOne({ prId: req.params.prId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Pull request not found' });
        }
        res.status(200).json({ message: 'Pull request deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//=================================================== Commits Management =================================================== //

app.get('/repositories/:repoId/commits', async (req, res) => {
    try {
        const repoCommits = await commits.find({ repoId: req.params.repoId }).toArray();
        res.status(200).json(repoCommits);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/commits', async (req, res) => {
    try {
        const newCommit = {
            ...req.body,
            createdAt: new Date()
        };
        const result = await commits.insertOne(newCommit);
        res.status(201).json({ message: 'Commit created', commitId: result.insertedId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/commits/:commitId', async (req, res) => {
    try {
        const result = await commits.deleteOne({ commitId: req.params.commitId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Commit not found' });
        }
        res.status(200).json({ message: 'Commit deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//=================================================== Forks and Stars Management =================================================== //

app.post('/forks', async (req, res) => {
    try {
        const newFork = {
            ...req.body,
            forkedAt: new Date()
        };
        const result = await forks.insertOne(newFork);
        
        // Update repository fork count
        await repositories.updateOne(
            { repoId: req.body.repoId },
            { $inc: { forks: 1 } }
        );
        
        res.status(201).json({ message: 'Fork created', forkId: result.insertedId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/stars', async (req, res) => {
    try {
        const newStar = {
            ...req.body,
            starredAt: new Date()
        };
        const result = await stars.insertOne(newStar);
        
        // Update repository star count
        await repositories.updateOne(
            { repoId: req.body.repoId },
            { $inc: { stars: 1 } }
        );
        
        res.status(201).json({ message: 'Star added', starId: result.insertedId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});