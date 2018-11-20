/**
 * Bloco de conexão
 */
const mongoose = require('mongoose');
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
 * Bloco de Funções
 */

/**
 * Coloca em caixa alta a primeira letra de cada palavra de uma string
 * 
 * @param {*} str string a ser modificada 
 * 
 * @return {string}
 */
function TitleCase (str) 
{
    if (typeof str !== 'string')
    {
        var splitStr = '';
    } else
    {
        var splitStr = str.toLowerCase().split(' ');

        for (var i = 0; i < splitStr.length; i++)
        {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
    }

    return splitStr.join(' ');
}

/**
 * Concatena o primeiro nome e sobrenome de uma pessoa
 * 
 * @return {string}
 */
function FullName()
{
    return this.name.first + ' ' + this.name.last;
}

/**
 * Calcula a idade a partir da data de nascimento
 * 
 * @param {Date} Data data de nascimento passada para ser retornada a idade 
 * 
 * @return {Number}
 */
function Idade(Data)
{
    var hoje = new Date();
    var nascimento = new Date(Data);

    var diaHoje = hoje.getDay();
    var mesHoje = hoje.getMonth() + 1; // Janeiro é 0
    var anoHoje = hoje.getFullYear();

    var diaNascimento = nascimento.getDay();
    var mesNascimento = nascimento.getMonth() + 1;
    var anoNascimento = nascimento.getFullYear();

    var idade = anoHoje - anoNascimento;

    if(mesHoje < mesNascimento)
    {
        idade = idade - 1;
    } else if (mesHoje == mesNascimento)
    {
        if (diaHoje < diaNascimento)
        {
            idade = idade - 1;
        }
    }

    return idade;
}

/**
 * Retorna uma string com a data de nascimento no formato dd/mm/yyyy
 * 
 * @param {Date} Data data de nascimento a ser formatada
 * 
 * @return {String}
 */
function FormatarData(Data)
{
    return Data.getDay() + "/" + (Data.getMonth() + 1) + "/" + Data.getFullYear();
}

/**
 * Retorna uma string com o CPF formatado no formato xxx.xxx.xxx-XX
 * 
 * @param {String} CPF string com os dígitos do CPF
 * 
 * @return {String}
 */
function gFormatarCPF(CPF)
{
    return CPF.substring(0, 3) + '.' + CPF.substring(3, 6) + '.' + CPF.substring(6, 9) + '-' + CPF.substring(9);
}

/**
 * Retorna uma string somente com os dígitos do CPF, no formato xxxxxxxxxXX
 * 
 * @param {String} CPF 
 * 
 * @return {String}
 */
function sFormatarCPF(CPF)
{
    // Expressão regular para encontrar os caracteres hífen (-) e ponto (.)
    var re = new RegExp('([-.])', 'g') ;
    // Salva o array com os caracteres encontrados em uma variável
    var arrCPF = CPF.match(re);
    // String que vai ser passada com o CPF formatado
    var strFinal = CPF;
    // Caso o array esteja vazio (não foi encontrado os caracteres), retornar o CPF
    if (arrCPF == null)
    {
        return strFinal;
    }

    var dotArray = strFinal.split('.');
    strFinal = '';

    for (var i = 0; i < dotArray.length; i++)
    {
        strFinal = strFinal + dotArray[i];
    }

    var dashArray = strFinal.split('-');
    strFinal= '';

    for (var i = 0; i < dashArray.length; i++)
    {
        strFinal = strFinal + dashArray[i];
    }

    return strFinal;
}

/**
 * Verifica se o CPF passado é válido
 * 
 * @return {Boolean}
 */
function ValidarCPF(CPF)
{
    var strCPF = sFormatarCPF(CPF);

    var soma = 0;
    var resto = 0;

    if (strCPF === '00000000000')
    {
        return false;
    }

    // Multiplica, da esquerda para a direita, os nove primeiros dígitos do CPF pelos números 
    // decrescentes de 10 à 2 e soma cada um dos resultados obtidos
    for (var i = 0; i < 9; i++)
    {  
        soma = soma + (parseInt(strCPF.charAt(i)) * (10 - i));
    }

    // Multiplica por 10 e divide por 11 o resultado da soma, considerando apenas o resto
    resto = (soma * 10) % 11;

    // Caso o resto seja 10 ou 11, ele será considerado como 0
    if ((resto == 10) || (resto == 11))
    {
        resto = 0;
    }

    // Se o resto obtido não for igual ao valor do primeiro dígito verificador, 
    // o CPF é inválido, retornando false
    if(resto != parseInt(strCPF.charAt(9)))
    {
        return false;
    } else 
    {
        // Sendo o primeiro dígito válido, faz-se agora a validação do segundo dígito
        soma = 0;

        // Multiplica, da esquerda para a direita, os dez primeiros dígitos do CPF (incluindo o 
        // primeiro dígito verificador) pelos números decrescentes de 11 à 2 e soma cada um dos 
        // resultados obtidos
        for (var i = 0; i < 10; i++)
        {
            soma = soma + (parseInt(strCPF.charAt(i)) * (11 - i));
        }
        
        resto = (soma * 10) % 11;

        if((resto == 10) || (resto == 11))
        {
            resto = 0;
        }

        // Se o resto obtido não for igual ao valor do segundo dígito verificador, 
        // o CPF é inválido, retornando false
        if(resto != parseInt(strCPF.charAt(10)))
        {
            return false;
        }
    }
    // O CPF é válido já que houve correspondência da validação com os dígitos verificadores
    return true;
}

// Variável de validação  do CPF com mensagem de erro passada para o SchemaType.validate()
var CPF = [ValidarCPF, 'CPF inválido! Insira um CPF válido.']

// Essa expressão regular procura por caracteres que são números (0-9), hífen(-) e ponto(.)
// Explicação dessa RegExp: http://tinyurl.com/yanejejo
var reCPF = new RegExp(/^[0-9]{3}(?:\.)?[0-9]{3}(?:\.)?[0-9]{3}(?:-)?[0-9]{2}$/, 'g'); 

// Expressão regular pra validar o email, que deve corresponder ao critérios dessa expressão
// Explicação dessa RegExp: http://tinyurl.com/yaptcjo4
var reEmail = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/, 'g');

// Expressão regular pra validar o telefone, que deve corresponder ao critérios dessa expressão
// Explicação dessa RegExp: http://tinyurl.com/y898etf8
var rePhone = new RegExp(/^(?:\()?[0-9]{2}(?:[\)]?[0-9]?)?[0-9]{8}$/, 'g');

// Expressão regular para validar a data de nascimento no formato dd/mm/yyyy
// Explicação dessa RegExp: http://tinyurl.com/yckrrktk
var reData = new RegExp(/^[0-9]{4}-((?:0)?[1-9]|1[1-2])-((?:0)?[1-9]|[1-2][0-9]|3[0-1])$/, 'g');

// Expressão regular para validar o tipo sanguíneo, aceitando apenas os valores O, A, B ou AB
// Explicação dessa RegExp: http://tinyurl.com/y8jgtxa9
var reSangue = new RegExp(/^([Oo]|[Aa]|[Bb]|[Aa][Bb])$/, 'g');

/**
 * Bloco de criação de Schemas
 */
const Schema = mongoose.Schema;


const personSchema = new Schema
({
    name: 
    {
        first: { type: String, required: true, trim: true, set: TitleCase },
        last: { type: String, required: true, trim: true, set: TitleCase  },
    },
    email: { type: String, required: true, trim: true, lowercase: true, match: reEmail },
    cpf: { type: String, required: true, trim: true, unique: true, minlength: 11, maxlength: 14, match: reCPF, validate: CPF, get: gFormatarCPF, set: sFormatarCPF },
    sexo: { type: String, required: true, trim: true },
    nascimento: { type: Date, required: true, match: reData, get: FormatarData },
    idade: { type: Number, min: 18, max: 65, set: Idade },
    estadoCivil: { type: String, required: true },
});

/**
 * Schema para os funcionários
 */
const staffSchema = new Schema
({
    person: personSchema,
    cargo: { type: String, required: true, trim: true },
});

/**
 * Schema para os pacientes
 */
const patientSchema = new Schema
({
    person: personSchema,
    address: { type: String, required: true, trim: true, set: TitleCase },
    telefone: { type: [Number], required: true, trim: true, default: undefined, match: rePhone },   
    blooType: { type: String, required: false, uppercase: true, match: reSangue },
    fatorRh: { type: String, required: false },
    observation: { type: String },
});

/**
 * Bloco de middleware (pre and post hooks)
 */
personSchema.pre('save', function(next){
    this.idade = Idade(this.nascimento);
    next();
});

/**
 * Bloco de Virtuals
 */
personSchema.virtual('fullName').get(function(){
    return this.name.first + ' ' + this.name.last;
});

var Staff = mongoose.model('Staff', staffSchema);

var funcionario = new Staff({
    person:
    {
        name: { first: 'Maria', last: 'Ribeiro'},
        email: 'mariaR@exemplo.com',
        cpf: '12345678909',
        sexo: 'feminino',
        nascimento: new Date('1990-12-5'),
        estadoCivil: 'Solteiro(a)',
    },
    cargo: 'Enfermeiro(a)',
});

funcionario.save(function(err)
{
    if(err) return console.error(err);
    console.log(funcionario.person.cpf);
    console.log(funcionario.cargo);
    console.log(funcionario.person.nascimento);
    console.log(funcionario.person.idade);
    console.log(funcionaro.person.fullName);
})