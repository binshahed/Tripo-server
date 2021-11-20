const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
const cors = require('cors')

require('dotenv').config()

const port = process.env.DB_HOST || 6000

//middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World! asdf')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hoqfp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
console.log(uri)

async function run () {
  try {
    await client.connect()
    const database = client.db('tripoDb')
    const packagesCollection = database.collection('packages-collection')
    // create a document to insert
    app.get('/packages', async (req, res) => {
      const cursor = packagesCollection.find({})
      const packages = await cursor.toArray()
      res.send(packages)
    })
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
