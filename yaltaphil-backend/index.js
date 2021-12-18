const cors = require("cors");
const express = require("express");

require("dotenv").config();
const port = process.env.PORT || 8080;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());


// app.set("view engine", "html");

// // Static folder
// app.use(express.static(__dirname + "/views/"));

// // Defining route middleware
// app.use("/api", require("./routes/api"));



const { MongoClient } = require("mongodb");
const mongo = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let user;

mongo.connect((err) => {
    app.get("/", async (req, res) => {
        // for (let i = 0; i < 10000; i++) {
        //     mongo
        //         .db("site-db")
        //         .collection("users")
        //         .insertOne({ name: `User-${i}`, role: "user2" });
        // }

        res.send(
            `<h1>This is my server users page</h1>
       <p>And I'd like to describe all users here: </p>
       <form action="/result" method="POST">
       <input type="text" name="name"/>
       <button>Submit</button>
       </form>
        <a href="/exit">exit</a>`
        );
    });
    app.post("/result", (req, res) => {
        console.log(req.body.name);
        mongo
            .db("site-db")
            .collection("users")
            .find({ name: req.body.name })
            .toArray()
            .then((result) => result.forEach((item) => console.log(item.role)));

        res.send(`We got ${user}`);
    });

    app.listen(port, () => {
        console.log(`listening at http://localhost:${port}`);
    });
});
