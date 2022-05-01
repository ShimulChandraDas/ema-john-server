const express = require('express');

const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
require('dotenv').config()

const port = process.env.PORT || 5000
const app = express();

app.use(cors());
app.use(express.json());




// const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.lchib.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const uri = `mongodb://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0-shard-00-00.lchib.mongodb.net:27017,cluster0-shard-00-01.lchib.mongodb.net:27017,cluster0-shard-00-02.lchib.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-12g22n-shard-0&authSource=admin&retryWrites=true&w=majority`;
//console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db('emaJohn').collection('product');


        app.get('/product', async (req, res) => {
            console.log('query ', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            //const products = await cursor.limit(10).toArray(); //use limit show product
            let product;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray(); //use limit show product
            } else {
                products = await cursor.toArray();
            }
            res.send(products)
        })
        app.get('/productCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count });
        })

        //use post get product by ids


        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id));
            const query = { _id: { $in: ids } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();

            console.log(keys);
            res.send(products);
        })
    }
    finally {

    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('John is Running and waiting for Ema')
})
app.listen(port, () => {
    console.log('John is running on port', port);
})