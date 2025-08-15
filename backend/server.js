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

const writeCharacters = (characters) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(characters, null, 2));
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


app.post("/characters", (req, res) => {
  const { name, realName, universe } = req.body;
  if (!name || !realName || !universe) {
    return res
      .status(400)
      .json({ message: "name, realName and universe are required" });
  }
  const characters = readCharacters();
  const newCharacter = { id: Date.now(), name, realName, universe };
  characters.push(newCharacter);
  writeCharacters(characters);
  res.status(201).json(newCharacter);
});


app.put("/characters/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, realName, universe } = req.body;
  let characters = readCharacters();
  const index = characters.findIndex((c) => c.id === id);
  
  if (index === -1)
    return res.status(404).json({ message: "Character not found" });
  
  characters[index] = {
    ...characters[index],
    ...(name && { name }),
    ...(realName && { realName }),
    ...(universe && { universe }),
  };
  writeCharacters(characters);
  res.json(characters[index]);
});




app.listen(port, () => {
  console.log(`Le serveur est en marche sur http://localhost:${port}`);
})