const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let nextId = 4;
let names = [
  { id: 1, name: "Tuna Fish", votes: 5 },
  { id: 2, name: "Small Bear", votes: 3 },
  { id: 3, name: "Miss Jenkins", votes: 1 },
];

app.get("/api/names", (req, res) => {
  const sorted = [...names].sort((a, b) => b.votes - a.votes);
  res.json(sorted);
});

app.post("/api/names", (req, res) => {
  const rawName = typeof req.body.name === "string" ? req.body.name.trim() : "";

  if (!rawName) {
    return res.status(400).json({ error: "A name is required." });
  }
  if (rawName.length > 40) {
    return res.status(400).json({ error: "Keep the name under 40 characters." });
  }

  const entry = { id: nextId++, name: rawName, votes: 0 };
  names.push(entry);
  res.status(201).json(entry);
});

app.post("/api/names/:id/vote", (req, res) => {
  const id = Number(req.params.id);
  const entry = names.find((n) => n.id === id);

  if (!entry) {
    return res.status(404).json({ error: "Name not found." });
  }

  entry.votes += 1;
  res.json(entry);
});

app.listen(PORT, () => {
  console.log(`Puppy naming contest running on port ${PORT}`);
});
