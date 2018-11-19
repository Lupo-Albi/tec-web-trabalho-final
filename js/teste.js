const mongoose = require('mongoose');
mongoose.connect('mongodb://root:abc123@ds151207.mlab.com:51207/teste', { useNewUrlParser:true });

const Schema = mongoose.Schema;

const pacienteSchema = new Schema ({
    nome: { type: String, required: true },
    email: { type: String, required: true },
});

const Paciente = mongoose.model('Paciente', pacienteSchema);

var primeiro = new Paciente ({
    nome: 'Fulano',
    email: 'fulano@exemplo.com',
});

primeiro.save(function (err){
    if (err) return console.error(err);
});

var segundo = new Paciente ({
    nome: 'Sicrano',
    email: 'sicrano@exemplo.com',
});

segundo.save(function (err){
    if (err) return console.error(err);
});