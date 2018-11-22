const mongoose = require('mongoose');
const functions = require('../../js/functions');
const regexp = require('../../js/regexp');

const Schema = mongoose.Schema;

let personSchema = new Schema 
({
    name: { type: String, required: [true, '000'], trim: true, match: [regexp.Nome, '001'], set: functions.TitleCase },
    email: { type: String, required: [false, '002'], trim: true, lowercase: true, match: [regexp.Email, '003'] },
    cpf: { type: String, required: [true, '004'], trim: true, unique: true, minlength: [11, '005'],  maxlength: [14, '005'], match: [regexp.CPF, '005'], validate: [functions.ValidarCPF, '006'], get: functions.gFormatarCPF, set: functions.sFormatarCPF },
    sexo: { type: String, required: [true, '007'], trim: true, set: functions.TitleCase },
    nascimento: { type: Date, required: [true, '008'], get: functions.FormatarData, set: functions.SetarData },
    estadoCivil: { type: String, required: [true, '009'], set: functions.TitleCase },
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
    } /*else if (error.name === 'ValidationError' && error.message.match(/002$/))
        {
            next (new Error('Campo e-mail é obrigatório.'));
    }*/ else if (error.name === 'ValidationError' && error.message.match(/003$/))
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

// Exportar modelo
module.exports = mongoose.model('Person', personSchema);