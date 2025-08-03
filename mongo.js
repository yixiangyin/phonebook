const mongoose = require("mongoose");

if (!(process.argv.length === 3 || process.argv.length === 5)) {
  console.log("correct usage: node mongo.js password [name number]");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://yinyixiang:${password}@cluster0.curz74q.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
    console.log('phonebook:');
    
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
    const name = process.argv[3]
    const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number,
  });
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
