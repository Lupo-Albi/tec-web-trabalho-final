var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// URL de conexão
var url = 'mongodb://localhost:27017';

// Nome do banco de dados
var dbName = 'tec-web';

// Criando um novo MongoClient
var client = new MongoClient(url);

// Conectando com o servidor
client.connect(function(err){
    assert.equal(null, err); // callback function - checa se houve erros
    console.log('Conexão bem sucedida');

    var db = client.db(dbName); // Banco de dados

    // Criando a coleção 'clientes'
    db.createCollection('clientes', function(err){
        assert.equal(null, err);
        console.log('Coleção criada!');
    });

    // Objetos para o povoamento do banco
    var myobj = [
        { _id: 0, name: 'Anderson', address: 'Rua A', number: 1, sexo: 'm'},
        { _id: 1, name: 'Jeferson', address: 'Rua B', number: 1, sexo: 'm'},
        { _id: 2, name: 'Maria', address: 'Rua C', number: 1, sexo: 'f'},
        { _id: 3, name: 'Joana', address: 'Rua A', number: 2, sexo: 'f'},
        { _id: 4, name: 'Laura', address: 'Rua A', number: 3, sexo: 'f'},
        { _id: 5, name: 'Manoela', address: 'Rua B', number: 2, sexo: 'f'},
        { _id: 6, name: 'Pedro', address: 'Rua C', number: 2, sexo: 'm'},
        { _id: 7, name: 'Renata', address: 'Rua C', number: 3, sexo: 'f'},
        { _id: 8, name: 'Carol', address: 'Rua B', number: 3, sexo:'f'},
        { _id: 9, name: 'Felipe', address: 'Rua B', number: 4, sexo: 'm'},
        { _id: 10, name: 'Diego', address: 'Rua A', number: 4, sexo: 'm'}
    ];

    // Povoando o banco com os objetos
    db.collection('clientes').insertMany(myobj, function(err, res){
        assert.equal(null, err);
        assert.equal(11, res.insertedCount);
        console.log("Número de inserções feitas: " + res.insertedCount);
        console.log(res);
        client.close();
    });
});
/*
    // Variáveis para consultas
    var query = { address: 'Rua A'};

    // Variáveis para ordenação
    var mysort = { name: -1};

    // Consulta: achar quais objetos tem o endereço na 'Rua A' e listar seus nomes em ordem alfabética decrescente
    db.collection('clientes').find(query, { projection: { _id: 0, name: 1}}).sort(mysort).toArray(function(err, res){
        assert.equal(null, err);
        console.log(res);
        client.close();
    });
})
*/