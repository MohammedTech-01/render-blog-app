require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "temp/" });
const fs = require("fs");

const app = express();

// Environment variables
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

app.use(
  cors({
    credentials: true,
    origin: `http://localhost:${PORT}`,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/temp", express.static(__dirname + "/temp"));

// MongoDB connection
mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  try {
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userDoc = await User.create({ username, password: hashedPassword });
    res.json(userDoc);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (userDoc && bcrypt.compareSync(password, userDoc.password)) {
      const token = jwt.sign({ username, id: userDoc._id }, TOKEN_SECRET_KEY);
      res.cookie("token", token).json({ id: userDoc._id, username });
    } else {
      res.status(400).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.json(decoded);
    }
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts.pop();
  const newPath = `${path}.${ext}`;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, TOKEN_SECRET_KEY, async (err, decoded) => {
    if (err) {
      res.status(400).json(err);
    } else {
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: decoded.id,
      });
      res.json(postDoc);
    }
  });
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, TOKEN_SECRET_KEY, {}, async (err, info) => {
    if (err) return res.status(400).json(err);
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    if (!postDoc) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(403).json({ message: 'You are not the author' });
    }
    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    postDoc.cover = newPath || postDoc.cover;
    await postDoc.save();

    res.json(postDoc);
  });
});

app.get('/post', async (req, res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  if (!postDoc) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(postDoc);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
