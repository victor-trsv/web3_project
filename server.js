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
        .map((line, index) => ({ id: index, ...JSON.parse(line) })); // добавляем id
    res.json(comments);
});

// Добавление комментария
app.post("/comments", (req, res) => {
    const { name, text } = req.body;
    if (!name || !text) return res.status(400).json({ error: "Нет имени или текста" });

    const date = new Date().toLocaleString("ru-RU", { hour12: false });
    const comment = { name, text, date };

    fs.appendFileSync(COMMENTS_FILE, JSON.stringify(comment) + "\n");
    res.json({ id: fs.readFileSync(COMMENTS_FILE, "utf-8").split("\n").length - 1, ...comment });
});

// Удаление комментария по id
app.delete("/comments/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (!fs.existsSync(COMMENTS_FILE)) return res.status(404).json({ error: "Файл не найден" });

    const lines = fs.readFileSync(COMMENTS_FILE, "utf-8")
        .split("\n")
        .filter(Boolean);

    if (id < 0 || id >= lines.length) return res.status(400).json({ error: "Неверный id" });

    lines.splice(id, 1); // удаляем нужный комментарий
    fs.writeFileSync(COMMENTS_FILE, lines.join("\n") + (lines.length ? "\n" : ""));

    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
