Idade = function(Data)
{
    var hoje = new Date();
    var nascimento = new Date(Data);

    var diaHoje = hoje.getDate();
    var mesHoje = hoje.getMonth() + 1; // Janeiro é 0
    var anoHoje = hoje.getFullYear();

    var diaNascimento = nascimento.getDate();
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

var data = new Date('1990-12-30');

console.log(Idade(data));