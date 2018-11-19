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

    // Variáveis de consulta
    var ruaA = { address: 'Rua A'};
    var ruaB = { address: 'Rua B'};
    var ruaC = { address: 'Rua C'};
    var mulheres = { sexo: 'f'};
    var homens = { sexo: 'm'};

    // Variáveis de ordenação
    var name_alf = { name: 1};
    var name_nalf = { name: -1};

    // Consultas

    // Nome, em ordem alfabética, e sexo das pessoas que moram na Rua A
    db.collection('clientes').find(ruaA, { projection: {_id: 0, number: 0, address: 0}}).sort(name_alf).toArray(function(err, res){
        assert.equal(null, err);
        console.log(res);
    });
    
    // Nome, em ordem alfabética-invertida, das mulheres que moram na Rua B
    db.collection('clientes').find( { $and: [ ruaB, mulheres ]}, { projection: { _id: 0, address: 0, number: 0, sexo: 0}}).sort(name_nalf).toArray(function(err, res){
        assert.equal(null, err);
        console.log(res);
    });

    // Homens que moram na Rua C ou tem o número 4
    db.collection('clientes').find( { 
        $or: [
            { $and: [  homens, ruaC  ] },
            { $and: [  homens, { number: 4 }]}
        ]}).toArray(function(err, res){
        assert.equal(null, err);
        console.log(res);
        client.close();
    });
});