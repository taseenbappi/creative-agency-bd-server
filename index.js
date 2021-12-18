const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// node midleware
app.use(cors());
app.use(express.json());

// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wyglv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(client)

async function run() {

    try {

        await client.connect();
        const database = client.db("creativeAgencyBD");
        const usersCollection = database.collection("users");

        //getting users info api
        app.get("/users", async (req, res) => {

            const users = usersCollection.find({});
            const result = await users.toArray();
            res.json(result);
        })
        //getting users info api
        app.get("/users/:email", async (req, res) => {

            const email = req.params.email;
            const query = { email: email };
            const users = await usersCollection.findOne(query);
            if (users?.email === email) {
                res.json({ message: true });
            }
            else {
                res.json({ message: false });
            }
            // res.json(users);
        })
        //added user info 
        app.post("/users", async (req, res) => {

            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}

run().catch(console.dir);


// root api
app.get('/', (req, res) => {
    res.send('Hello! Welcome Creative Agency BD server');
})

//server port listen
app.listen(port, () => {
    console.log(`Creative Agency BD App listen at ${port}`)
})