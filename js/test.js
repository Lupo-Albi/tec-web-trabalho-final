var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
  
// Connection URL
var url = 'mongodb://localhost:27017';

// Database Name
var dbName = 'tec-web';

// Create a new MongoClient
var client = new MongoClient(url);

client.connect(function(err){
  assert.equal(null, err);
  console.log('Conexão bem sucedida!');

  var db = client.db(dbName);

  /*
  db.createCollection('clientes', function(err){
    assert.equal(null, err);
    console.log('Coleção criada!');
  });
  */

  /*var myobj = [
    { _id: 100, name: 'Anderson', address: 'Rua A', number: 1},
    { _id: 101, name: 'Jeferson', address: 'Rua B', number: 1},
    { _id: 102, name: 'Maria', address: 'Rua C', number: 1},
    { _id: 103, name: 'Joana', address: 'Rua A', number: 2},
    { _id: 104, name: 'Laura', address: 'Rua A', number: 3},
    { _id: 105, name: 'Manoela', address: 'Rua B', number: 2},
    { _id: 106, name: 'Pedro', address: 'Rua C', number: 2},
    { _id: 107, name: 'Renata', address: 'Rua C', number: 3},
    { _id: 108, name: 'Carol', address: 'Rua B', number: 3},
    { _id: 109, name: 'Felipe', address: 'Rua B', number: 4},
    { _id: 110, name: 'Diego', address: 'Rua A', number: 4}
  ];

  db.collection('clientes').insertMany(myobj, function(err, r){
    assert.equal(null, err);
    assert.equal(11, r.insertedCount);
    console.log("Número de documentos inseridos: " + r.insertedCount);
  })*/
    
  // var query = { name: 'Anderson'};

  // var mysort = { name: -1};

  db.collection('clientes').find({}).toArray(function(err, result){
    assert.equal(null, err);
    console.log(result);
    client.close;
  });
});