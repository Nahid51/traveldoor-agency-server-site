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
    console.log('connected successfully');

    app.get('/locations', async (req, res) => {
        const result = await locationCollection.find({}).toArray();
        res.send(result);
    })
    app.get('/destinations', async (req, res) => {
        const result = await destinationCollection.find({}).toArray();
        res.send(result);
    })
});


app.get('/', (req, res) => {
    res.send('Hello Node JS!')
})

app.listen(port, () => {
    console.log('Running server at port:', port)
})