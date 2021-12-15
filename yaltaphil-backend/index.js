// const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
// const app = express();
// const port = 3000;
const { MongoClient } = require("mongodb");

async function insertOne() {
    let client;
    try {
        client = new MongoClient(process.env.CONNECTIONSTRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 3000,
            keepAlive: 1,
        });
        client.connect(async (err) => {
            const collection = client.db("site-db").collection("posts");
            collection.insertOne({ item: "card", qty: 115 });
            // console.log( await collection.find().toArray());
        });
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

insertOne();
// app.get("/", (req, res) => {
//     res.send(`<h1>Hello pusya</h1><a href="/users">Users</a>`);
// });

// app.get("/users", (req, res) => {
//     client.connect((err) => {
//         db = client.db("testdb");
//         console.log("connected to mongo");
//         db.collection("users").insertOne({ a: 1 }, function (err, r) {});

//         client.close();

//         res.send(
//             `<h1>This is my server users page</h1><p>And I'd like to describe all users here: </p>`
//         );
//     });
// });

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });
