const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
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
        const placedOrderCollection = database.collection("placedOrder");
        const servicesCollection = database.collection("services");
        const reviewsCollection = database.collection("reviews");

        //getting users info api
        app.get("/users", async (req, res) => {

            const users = usersCollection.find({});
            const result = await users.toArray();
            res.json(result);
        })
        //getting exits user info api
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
        //getting all services
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            console.log(query);
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })
        //getting all services
        app.get('/services', async (req, res) => {
            const services = servicesCollection.find({});
            const result = await services.toArray();
            res.json(result);
        })


        //oders releted api

        //placedOrder api
        app.post('/placedOrder', async (req, res) => {
            const orderInfo = req.body;
            const result = await placedOrderCollection.insertOne(orderInfo);
            res.json(result);
        })
        //reviews api
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
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