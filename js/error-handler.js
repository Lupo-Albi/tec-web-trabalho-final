const mongoose = require('mongoose');

// Conexão
// URI de conexão para o MongoDB hospedado no MLab
const uri = 'mongodb://root:saude123@ds155653.mlab.com:55653/clinica-saude';
// Opções passadas para o driver do MongoDB
const options = 
{
    useNewUrlParser: true,
    family: 4, // Conectar usando IPv4, sem tentar com IPv6
};
// Método para conectar ao MongoDB
mongoose.connect(uri, options);

exports.personSchema.post('save', function(error, doc, next)
{
    {
        if (error.name === 'ValidationError' && error.message.match(/000$/))
        {
            next (new Error('O campo Nome e Sobrenome são obrigatórios.'));
        }
        if (error.name === 'ValidationError' && error.message.match(/001$/))
        {
            next (new Error('Nome Inválido. Insira um nome válido (sem números ou caracteres especiais).'));
        }
        if (error.name === 'ValidationError' && error.message.match(/002$/))
        {
            next (new Error('Campo e-mail é obrigatório'));
        }
        else
        {
            next();
        }
    }
});