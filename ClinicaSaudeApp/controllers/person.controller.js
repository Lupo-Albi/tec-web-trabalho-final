const Person = require('../models/person.model');

exports.test = function(req, res) 
{
    res.send('Greetings from the test controller.');
};

exports.person_create = function(req, res)
{
    let pessoa = new Person
    ({
        name: req.body.name,
        email: req.body.email,
        cpf: req.body.cpf,
        sexo: req.body.sexo,
        nascimento: req.body.nascimento,
        estadoCivil: req.body.estadoCivil,
    });

    pessoa.save(function(err)
    {
        if(err)
        {
            res.send(err.message);
        }
        res.send('Cadastro realizado com sucesso.');
    });
}