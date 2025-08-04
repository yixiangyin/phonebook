require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const Person = require("./models/person");
const app = express();

app.use(express.json());
app.use(express.static("dist"));

morgan.token("data", (req, res) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "The name or number is missing",
    });
  }
  // if (persons.some((p) => p.name === body.name)) {
  //   return res.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.get("/info", (req, res) => {
  const time = new Date();
  const count = persons.length;
  res.send(`<p>Phonebook has info for ${count} people</p>
        <p>${time}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id).then(() => {
    res.status(204).end();
  })
  .catch(error => next(error));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
