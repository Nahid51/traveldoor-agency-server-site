const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bsutc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const database = client.db("TravelDoor");
    const locationCollection = database.collection("locations");
    const destinationCollection = database.collection("destinations");
    const userCollection = database.collection("users");
    console.log('connected successfully');

    app.get('/locations', async (req, res) => {
        const result = await locationCollection.find({}).toArray();
        res.send(result);
    })
    app.get('/destinations', async (req, res) => {
        const result = await destinationCollection.find({}).toArray();
        res.send(result);
    })
    app.post('/addUser', async (req, res) => {
        console.log(req.body);
        const result = await userCollection.insertOne(req.body);
        res.send(result);
    })
    app.get('/users', async (req, res) => {
        const result = await userCollection.find({}).toArray();
        res.send(result);
    })
    app.delete('/user/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await userCollection.deleteOne(query);
        res.send(result);
    })
    app.get('/user/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await userCollection.findOne(query);
        res.send(result);
    })
    app.put('/user/:id', async (req, res) => {
        const id = req.params.id;
        const updateUser = req.body;
        console.log(updateUser);
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                name: updateUser.name,
                email: updateUser.email,
                contact: updateUser.contact,
                address: updateUser.address,
                count: updateUser.count,
                totalPrice: updateUser.totalPrice,
                tripPrice: updateUser.tripPrice,
                location: updateUser.location,
            },
        };
        const result = await userCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    })
});


app.get('/', (req, res) => {
    res.send('Hello Node JS!')
})

app.listen(port, () => {
    console.log('Running server at port:', port)
})