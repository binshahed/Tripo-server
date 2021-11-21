const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId

const cors = require('cors')

require('dotenv').config()

const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hoqfp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

async function run () {
  try {
    await client.connect()
    const database = client.db('tripoDb')
    const packagesCollection = database.collection('packages-collection')
    const bookingCollection = database.collection('booking-collection')

    // post package from user
    app.post('/booking', async (req, res) => {
      const booking = req.body
      const result = await bookingCollection.insertOne(booking)
      console.log('hitted', booking)
      res.json(result)
    })

    //// get package from db
    app.get('/booking', async (req, res) => {
      const cursor = bookingCollection.find({})
      const packages = await cursor.toArray()
      res.send(packages)
    })

    //// delete my package from db
    app.delete('/booking/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await bookingCollection.deleteOne(query)
      res.json(result)
    })
    //// Update status
    app.put('/booking/:id', async (req, res) => {
      const id = req.params.id
      const updatedStatus = req.body
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          status: updatedStatus.status
        }
      }
      const result = await bookingCollection.updateOne(
        filter,
        updateDoc,
        options
      )

      res.json(result)
    })

    // get package
    app.get('/packages', async (req, res) => {
      const cursor = packagesCollection.find({})
      const packages = await cursor.toArray()
      res.send(packages)
    })
    // post package from user
    app.post('/packages', async (req, res) => {
      const booking = req.body
      const result = await packagesCollection.insertOne(booking)
      res.json(result)
    })
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World! asdf')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
