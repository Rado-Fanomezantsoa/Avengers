const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");


const app = express();
const port = process.env.PORT || 8080;
const DATA_FILE = path.join(__dirname, "characters.json");

app.use(cors());
app.use(express.json());


const readCharacters = () => {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
};





app.get("/characters", (req, res) => {
  res.json(readCharacters());
});

app.get("/characters/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const character = readCharacters().find((c) => c.id === id);
  if (!character)
    return res.status(404).json({ message: "Character not found" });
  res.json(character);
});