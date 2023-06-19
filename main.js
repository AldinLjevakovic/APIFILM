const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://admin:admin123@cluster0.hhu4wc6.mongodb.net/filmoviDB?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const filmSchema = new mongoose.Schema({
  ime: String,
  godinaNastanka: Number,
  zanr: String,
});

const Film = mongoose.model("Film", filmSchema);

app.get("/api/filmovi", async (req, res) => {
  const filmovi = await Film.find();
  res.send(filmovi);
});

app.post("/api/filmovi", async (req, res) => {
  const film = new Film({
    ime: req.body.ime,
    godinaNastanka: req.body.godinaNastanka,
    zanr: req.body.zanr,
  });
  await film.save();
  res.send(film);
});

app.put("/api/filmovi/:id", async (req, res) => {
  const film = await Film.findByIdAndUpdate(
    req.params.id,
    {
      ime: req.body.ime,
      godinaNastanka: req.body.godinaNastanka,
      zanr: req.body.zanr,
    },
    { new: true }
  );

  if (!film) return res.status(404).send("Film nije pronađen.");
  res.send(film);
});

app.delete("/api/filmovi/:id", async (req, res) => {
  const film = await Film.findByIdAndRemove(req.params.id);

  if (!film) return res.status(404).send("Film nije pronađen.");
  res.send(film);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
