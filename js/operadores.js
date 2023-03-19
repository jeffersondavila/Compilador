const opAritmeticos = /^(:=|[+\-*/])$/;

const identificadores = /^[A-Za-z]+[\_]?[A-Za-z]*[\/d]$/i;

const variables = /^(?=.*\b(Main()|Dim|Integer|Decimal|String|As|Variable|COMO|ENTERO)\b).*$/i

const caracteres = ['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H',
    'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'ñ', 'Ñ', 'o', 'O', 'p', 'P', 'q',
    'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', 'y', 'Y', 'z', 'Z'];

const signo = ['(', ')', '{', '}', ';', '.', ','];

const signos = [['(', 'signo de puntuación-parentesis que abre'],
[')', ', signo de puntuación-parentesis que cierra']
    , ['{', ' signo de puntuacion llave que abre'], ['}', ' signo de puntuacion llave que cierra']
    , [';', ' signo de puntuacion punto y coma'], ['.', ' signo de puntuacion punto']
    , [',', ' signo de puntuacion coma']];

export const operadores = {
    signo,
    signos,
    variables,
    caracteres,
    opAritmeticos,
    identificadores,
};