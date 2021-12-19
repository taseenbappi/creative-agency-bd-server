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

        // database collection
        const database = client.db("creativeAgencyBD");
        const usersCollection = database.collection("users");
        const placedOrderCollection = database.collection("placedOrder");
        const servicesCollection = database.collection("services");
        const reviewsCollection = database.collection("reviews");
        const orderCollection = database.collection("order");

        //////////////////all users api//////////////////////////////////

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

        })
        //getting exits user is admin api
        app.get("/users/admin/:email", async (req, res) => {

            const email = req.params.email;
            const query = { email: email };
            const users = await usersCollection.findOne(query);
            if (users?.role === "admin") {
                res.json({ message: true });
            }
            else {
                res.json({ message: false });
            }

        })

        // update user to admin api
        app.put("/users/admin", async (req, res) => {
            const email = req.body;
            const filter = { email: email.email };
            const options = { upsert: true };
            const updateUser = {
                $set: {
                    role: "admin"
                }
            };
            const result = await usersCollection.updateOne(filter, updateUser, options);
            res.json(result);
        })

        //added user info 
        app.post("/users", async (req, res) => {

            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        //////////////////all services api//////////////////////////////////////

        //getting specific services
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })

        //getting all services
        app.get('/services', async (req, res) => {
            const services = servicesCollection.find({});
            const result = await services.toArray();
            res.json(result);
        })

        //insert services api
        app.post("/services", async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result);
        })


        //////////////////all order releted api//////////////////////////////////

        //placedOrder post api
        app.post('/placedOrder', async (req, res) => {
            const servicesList = req.body;
            const result = await placedOrderCollection.insertOne(servicesList);
            res.json(result);
        })
        //placedOrder getting api
        app.get('/placedOrder', async (req, res) => {
            const servicesList = placedOrderCollection.find({});
            const result = await servicesList.toArray();
            res.json(result);
        })

        //insert Order post api
        app.post('/order', async (req, res) => {
            const orderInfo = req.body;
            const result = await orderCollection.insertOne(orderInfo);
            res.json(result);
        })

        // getting order api
        app.get('/order', async (req, res) => {
            const orderList = orderCollection.find({});
            const result = await orderList.toArray();
            res.json(result);
        })


        //////////////////reaview api//////////////////////////////////////////////

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