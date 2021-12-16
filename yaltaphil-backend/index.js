const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = 3000;

const { MongoClient } = require("mongodb");
const mongo = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.get("/", (req, res) => {
    res.send(`<h1>Hello</h1><a href="/users">Users</a>`);
});

app.get("/users", (req, res) => {
    connect();
    res.send(
        `<h1>This is my server users page</h1>
        <p>And I'd like to describe all users here: </p>
        <a href="/exit">exit</a>`
    );
});
app.get("/exit", (req, res) => {
    res.send(`<button>EXIT</button>`);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

function connect() {
    mongo.connect((err) => {
        console.log("MongoDB connected");
        collection = mongo.db("site-db").collection("users");
        for (let i = 0; i < 11; i++) {
            collection.insertOne({ name: `Player ${i}` });
        }
        collection.find({ name: "Philip" }).toArray((err, result) => {
            console.log(result);
        });

        collection.deleteMany({ name: /^Player/ }, (err, result) =>
            console.log(result)
        );
    });
}
