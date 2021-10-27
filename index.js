const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 4040;

app.use(cors());
app.use(express.json())

// user: manageUsers
// pass: eTnWEsJWHEJ0QMlm

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r9gms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("manageUsers");
        const usersCollection = database.collection("users");

        // create a document to insert
        app.post('/users', async (req, res) => {

            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        });

        // read document 
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        });

        // document delete 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.json(result)
        });

        // 
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.findOne(query);
            res.send(result)
        })

        // update document
        app.put('/users/update/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    job: updateUser.job,
                    age: updateUser.age
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })



    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/hello', (req, res) => {
    res.send('hello')
})

app.listen(port, () => {
    console.log('Users manage port', port)
})