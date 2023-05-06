const identificadores = /^[A-Za-z]+[\_]?[A-Za-z]*[\/d]$/i;

const operadoresComparacion = /^(?=.*\b(Qmas|Qopc|Q<|Q>|Q#<|Q#>|Q+)\b).*$/i

const operadoresAritmeticos = /^(?=.*\b(Q#|Q@|Q~|>>|QNEL|Q>>|%%)\b).*$/i

const palabrasReservadas = /^(?=.*\b(QUETZAL|CENTAVO|CHOCA|PISTO|LEN|sinPisto|Regalado|Reservado|Tapado|Quieto|Acabado)\b).*$/i

export const operadores = {
    identificadores,
    palabrasReservadas,
    operadoresComparacion,
    operadoresAritmeticos
};