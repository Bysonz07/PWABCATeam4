// // // const { MongoClient, ServerApiVersion } = require('mongodb');
// // import { MongoClient, ServerApiVersion } from 'mongodb'
// // // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// // const client = new MongoClient(uri, {
// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   }
// // });
// // async function run() {
// //   try {
// //     // Connect the client to the server	(optional starting in v4.7)
// //     await client.connect();
// //     // Send a ping to confirm a successful connection
// //     await client.db("admin").command({ ping: 1 });
// //     console.log("Pinged your deployment. You successfully connected to MongoDB!");
// //   } finally {
// //     // Ensures that the client will close when you finish/error
// //     await client.close();
// //   }
// // }
// // // run().catch(console.dir);

// // export default {client}

// import mongodb from 'mongodb'
// const MongoClient = mongodb.MongoClient
// const uri = "mongodb+srv://timpwa:H0reminipr0jectpw4@receipts.lgnlv6q.mongodb.net/?retryWrites=true&w=majority";



// const client = new MongoClient(uri)
// await client.connect()
// const db = client.db()

// const collection = db.collection("admin")
// console.log(db)

// export default client;

