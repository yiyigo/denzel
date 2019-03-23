const {
    MongoClient
} = require('mongodb');

const uri = "mongodb+srv://shangyiting:shangyiting@cluster0-xkalf.mongodb.net/test?retryWrites=true";

let mongoClient = null

MongoClient.connect(uri, {
    useNewUrlParser: true
}).then(client => {
    mongoClient = client
    const collection = client.db("movies").collection("movies");
    // perform actions on the collection object
    console.log(collection)
    client.close();
}).catch(reason => {
    console.log(reason)
})