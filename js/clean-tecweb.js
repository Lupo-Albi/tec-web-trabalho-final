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
var reNome = new RegExp(/^[a-záàâãéêíïóôõöúüçñ\s]+$/, 'i');
// Expressão regular pra validar o email, que deve corresponder ao critérios dessa expressão
// Explicação dessa RegExp: http://tinyurl.com/yaptcjo4
var reEmail = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/);
// Essa expressão regular procura por caracteres que são números (0-9), hífen(-) e ponto(.)
// Explicação dessa RegExp: http://tinyurl.com/yanejejo
var reCPF = new RegExp(/^[0-9]{3}(?:\.)?[0-9]{3}(?:\.)?[0-9]{3}(?:-)?[0-9]{2}$/);
// Expressão regular para validar o tipo sanguíneo, aceitando apenas os valores O, A, B ou AB
// Explicação dessa RegExp: http://tinyurl.com/y8jgtxa9
var reSangue = new RegExp(/^([o]|[a]|[b]|[a][b])$/, 'i');

/**
 * Schemas
 */
const Schema = mongoose.Schema;

const personSchema = new Schema
({
    _id: Schema.Types.ObjectId,
    name: 
    {
        first: { type: String, required: [true, '000'], trim: true, match: [reNome, '001'], set: functions.TitleCase },
        last: { type: String, required: [true, '000'], trim: true, match: [reNome, '001'], set: functions.TitleCase  },
    },
    email: { type: String, required: [true, '002'], trim: true, lowercase: true, match: [reEmail, '003'] },
    cpf: { type: String, required: [true, '004'], trim: true, unique: true, minlength: [11, '005'],  maxlength: [14, '005'], match: [reCPF, '005'], validate: [functions.ValidarCPF, '006'], get: functions.gFormatarCPF, set: functions.sFormatarCPF },
    sexo: { type: String, required: [true, '007'], trim: true, set: functions.TitleCase },
    nascimento: { type: Date, required: [true, '008'], get: functions.FormatarData, set: functions.SetarData },
    estadoCivil: { type: String, required: [true, '009'], set: functions.TitleCase },
});

const staffSchema = new Schema
({
    cargo: { type: String, required: [true, '010'], trim: true, set: functions.TitleCase },
    person: { type:Schema.Types.ObjectId, ref: 'Person' },
});

const patientSchema = new Schema
({
    address: { type: String, required: [true, '011'], trim: true, set: functions.TitleCase },
    telefones: { type: [Number], default: undefined },
    bloodType: { type: String, required: false, uppercase: true, match: [reSangue, '012'] },
    fatorRh: { type: String, required: false },
    observation: { type: String, required: false },
    person: { type: Schema.Types.ObjectId, ref: 'Person' },
});

/**
 * Middleware (pre and post Hooks)
 */
// Error Handler
personSchema.post('save', function(error, doc, next)
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
            next (new Error
                ('CPF possui dígitos inválidos ou foi inserido em um formato inválido. ' +
                'Certifique-se de usar apenas caracteres numéricos (0-9), hífen (-) e ponto (.), ' +
                'e escreva no formato xxx.xxx.xxx-xx ou xxxxxxxxxxx'));
    } else if (error.name === 'ValidationError' && error.message.match(/006$/))
        {
            next (new Error('CPF inválido! Insira um CPF válido.'));
    } else if (error.name === 'ValidationError' && error.message.match(/007$/))
        {
            next (new Error('Informe o sexo.'));
    } else if (error.name === 'ValidationError' && error.message.match(/008$/))
        {
            next (new Error('Informe a data de nascimento.'));
    } else if (error.name === 'ValidationError' && error.message.match(/Cast to Date/))
        {
            next (new Error('Formato de data inválido.'));
    } else if (error.name === 'ValidationError' && error.message.match(/009$/))
        {
            next (new Error('Campo Estado Civil é obrigatório.'));
    } else
        {
            next();
    }
});

staffSchema.post('save', function(error, doc, next)
{
    if (error.name === 'ValidationError' && error.message.match(/010$/))
    {
        next (new Error('É preciso especificar um cargo!'));
    } else
    {
        next();
    }
});

patientSchema.post('save', function(error, doc, next)
{
    if (error.name === 'ValidationError' && error.message.match(/011$/))
    {
        next (new Error('Campo endereço é obrigatório!'));
    } else if (error.name === 'ValidationError' && error.message.match(/012$/))
    {
        next (new Error('Valor inserido para tipo sanguíneo é inválido.'));
    } else
    {
        next();
    }
});


/**
 * Virtuals
 */
// Retorna o nome completo
personSchema.virtual('fullName').get(function(){
    var fullName = this.name.first + ' ' + this.name.last;
    return fullName;
});

// Retorna a idade
personSchema.virtual('idade').get(function()
{   
    var idade = functions.Idade(this.nascimento);
    return idade;
});

// Retorna o tipo sanguíneo com o Rh
patientSchema.virtual('blood').get(function()
{
    var blood = this.bloodType + this.fatorRh;
    return blood;
});

var Person = mongoose.model('Person', personSchema);
// _id: new mongoose.Types.ObjectId(),
var Staff = mongoose.model('Staff', staffSchema);
var Patient = mongoose.model('Patient', patientSchema);

var pessoa = new Person
({
    _id: new mongoose.Types.ObjectId(),
    name: { first: 'Luan', last: 'Martins' },
    email: 'luanderson@exemplo.com',
    cpf: '044.705.453-84',
    sexo: 'masculino',
    nascimento: '1997-05-07',
    estadoCivil: 'solteiro',
});

pessoa.save(function(err){
    if(err) return console.error(err.message);


    var paciente = new Patient
    ({
        address: 'Rua E',
        telefones: [88996354532, 8836451368],
        bloodType: 'O',
        fatorRH: '+',
        person: pessoa._id,
    });

    paciente.save(function(err1)
    {
        if(err1) return console.error(err1.message);
    });
});

Patient.
    findOne({ person: pessoa._id }).
    populate('pessoa').
    exec(function(err, paciente)
    {
        if (err) return console.error(err.message);
        console.log('Nome do Paciente: %s', paciente.pessoa.fullName);
        console.log('Idade: %s', paciente.pessoa.idade);
        console.log('Idade: %s', paciente.blood);
    });