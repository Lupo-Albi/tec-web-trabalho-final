// Imports
const mongoose = require('mongoose');
const functions = require('./functions');
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

/**
 * Expressões regulares
 */
// Expressão regular para validar os nomes
// Explicação dessa RegExp: http://tinyurl.com/y9hpd9jv
reNome = new RegExp(/^[a-záàâãéêíïóôõöúüçñ\s]+$/, 'i');
// Expressão regular pra validar o email, que deve corresponder ao critérios dessa expressão
// Explicação dessa RegExp: http://tinyurl.com/yaptcjo4
var reEmail = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/);
// Essa expressão regular procura por caracteres que são números (0-9), hífen(-) e ponto(.)
// Explicação dessa RegExp: http://tinyurl.com/yanejejo
var reCPF = new RegExp(/^[0-9]{3}(?:\.)?[0-9]{3}(?:\.)?[0-9]{3}(?:-)?[0-9]{2}$/); 
// Expressão regular para validar a data de nascimento no formato dd/mm/yyyy
// Explicação dessa RegExp: http://tinyurl.com/yckrrktk
var reData = new RegExp(/^[0-9]{4}-((?:0)?[1-9]|1[1-2])-((?:0)?[1-9]|[1-2][0-9]|3[0-1])$/);

/**
 * Schemas
 */
const Schema = mongoose.Schema;

const personSchema = new Schema 
({
    name: 
    {
        first: { type: String, required: [true, '000'], trim: true, match: [reNome, '001'], set: functions.TitleCase },
        last: { type: String, required: [true, '000'], trim: true, match: [reNome, '001'], set: functions.TitleCase  },
    },
    email: { type: String, required: [true, '002'], trim: true, lowercase: true, match: [reEmail, '003'] },
    cpf: { type: String, required: [true, '004'], trim: true, unique: true, minlength: [11, '005'],  maxlength: [14, '006'], match: [reCPF, '007'], validate: [functions.ValidarCPF, '008'], get: functions.gFormatarCPF, set: functions.sFormatarCPF },
    sexo: { type: String, required: [true, '009'], trim: true, set: functions.TitleCase },
    nascimento: { type: Date, required: [true, '010'], /*match: reData,*/ get: functions.FormatarData },

});
/**
 * Middleware (pre and post Hooks)
 */
// Error Handler
personSchema.post('save', function(error, doc, next)
{
    {
        if (error.name === 'MongoError' && error.code === 11000)
        {
            next (new Error('Erro de valor único duplicado.'))
        } else if (error.name === 'ValidationError' && error.message.match(/000$/))
        {
            next (new Error('O campo Nome e Sobrenome são obrigatórios.'));
        } else if (error.name === 'ValidationError' && error.message.match(/001$/))
        {
            next (new Error('Nome Inválido. Insira um nome válido (sem números ou caracteres especiais).'));
        } else if (error.name === 'ValidationError' && error.message.match(/002$/))
        {
            next (new Error('Campo e-mail é obrigatório.'));
        } else if (error.name === 'ValidationError' && error.message.match(/003$/))
        {
            next (new Error('E-mail inválido.'));
        } else if (error.name === 'ValidationError' && error.message.match(/004$/))
        {
            next (new Error('CPF é obrigatório.'));
        } else if (error.name === 'ValidationError' && error.message.match(/005$/))
        {
            next (new Error('CPF possui dígitos a menos do requirido.'));
        } else if (error.name === 'ValidationError' && error.message.match(/006$/))
        {
            next (new Error('CPF possui dígitos a mais do requirido.'));
        } else if (error.name === 'ValidationError' && error.message.match(/007$/))
        {
            next (new Error('CPF possui dígitos inválidos. Use apenas caracteres numéricos (0-9), hífen (-) e ponto (.).'));
        } else if (error.name === 'ValidationError' && error.message.match(/008$/))
        {
            next (new Error('CPF inválido! Insira um CPF válido.'));
        } else if (error.name === 'ValidationError' && error.message.match(/009$/))
        {
            next (new Error('Informe o sexo.'));
        } else if (error.name === 'ValidationError' && error.message.match(/010$/))
        {
            next (new Error('Informe a data de nascimento.'));
        } else
        {
            next();
        }
    }
});

/**
 * Virtuals
 */

var Person = mongoose.model('Person', personSchema);

var pessoa = new Person 
({
    name: { first: 'Vinicius', last: 'eu' },
    email: 'eu@hotmail.com',
    cpf: '261.362.600-34',
    sexo: 'masculino',
    nascimento: new Date('December 30, 1990'),
});

pessoa.save(function(err){
    if(err) return console.error(err.message);
    console.log(pessoa.name.first);
    console.log(pessoa.name.last);
    console.log(pessoa.cpf);
    console.log(pessoa.nascimento);
});