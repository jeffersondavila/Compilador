const identificadores = /^[A-Za-z]+[\_]?[A-Za-z]*[\/d]$/i;

const operadoresComparacion = /^(?=.*\b(Qmas|Qopc|Q<|Q>|Q#<|Q#>|Q+)\b).*$/i

const operadoresAritmeticos = /^(?=.*\b(Q#|Q\?|Q@|Q~|>>|QNEL|Q>>|%%)\b).*$/i

// const palabrasReservadas = /^(?=.*\b(QUETZAL|CENTAVO|CHOCA|PISTO|LEN|sinPisto|Regalado|Reservado|Tapado|Quieto|Acabado|Declaraciones|salida|paso|paso-Fin|paso-porque-paso|Repite|hastaQ|Repite-Fin|Variar|desde|fin|paso|Variar-Fin|Chispudo|Chispudo-Fin|Qpistudo|tieneCasaca|vosPlatica|coperachaMucha|queChilero|Reintegro|;|camioneta|camioneta-Fin|Fabricar|Fabricar-Fin|Principal\(\))\b).*$/i
const palabrasReservadas = /^(QUETZAL|CENTAVO|CHOCA|PISTO|LEN|sinPisto|Regalado|Reservado|Tapado|Quieto|Acabado|Declaraciones|salida|paso|paso-Fin|paso-porque-paso|Repite|hastaQ|Repite-Fin|Variar|desde|fin|paso|Variar-Fin|Chispudo|Chispudo-Fin|Qpistudo|tieneCasaca|vosPlatica|coperachaMucha|queChilero|Reintegro|;|camioneta|camioneta-Fin|Fabricar|Fabricar-Fin|Principal\(\))$/;

export const operadores = {
    identificadores,
    palabrasReservadas,
    operadoresComparacion,
    operadoresAritmeticos
};