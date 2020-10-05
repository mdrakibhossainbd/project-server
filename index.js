const express = require('express')
const app = express()
const port = 4000
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q43xx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const eventsCollection = client.db("volunteerdb").collection("events");
    const registersCollection = client.db("volunteerdb").collection("registers");

    app.get('/events', (req, res) => {
        eventsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/register', (req, res) => {
        const register = req.body;
        registersCollection.insertOne(register)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/register', (req, res) => {
        registersCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.delete('/delete/:id', (req, res) => {
        registersCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            });
    });
});

app.listen(process.env.PORT || port)