const express = require('express');
const bodyParser = require('body-parser');

const pessoa = require('./routes/person.route');

const app = express();

// Conexão
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://root@localhost:27017';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/person', pessoa);

let port = 1234;
app.listen(port, () => 
{
    console.log('Servidor conectado na porta de número ' + port);
});

