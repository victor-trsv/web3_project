const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const COMMENTS_FILE = path.join(__dirname, "comments.txt");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Получение комментариев
app.get("/comments", (req, res) => {
    if (!fs.existsSync(COMMENTS_FILE)) return res.json([]);
    const data = fs.readFileSync(COMMENTS_FILE, "utf-8");
    const comments = data
        .split("\n")
        .filter(Boolean)
        .map(line => JSON.parse(line));
    res.json(comments);
});

// Добавление комментария
app.post("/comments", (req, res) => {
    const { name, text } = req.body;
    if (!name || !text) return res.status(400).json({ error: "Нет имени или текста" });

    const date = new Date().toLocaleString("ru-RU", { hour12: false });
    const comment = { name, text, date };

    fs.appendFileSync(COMMENTS_FILE, JSON.stringify(comment) + "\n");
    res.json(comment);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
