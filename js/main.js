import { operadores } from "./operadores.js";

const textareaCodigo = document.getElementById('floatingTextarea1');
const textareaError = document.getElementById('floatingTextarea2');
let botonAnalisisLexico = document.getElementById('botonAnalisisLexico');

botonAnalisisLexico.addEventListener('click', function () {
    let lexemas = [], codigoFuente = textareaCodigo.value.trim();

    if (codigoFuente.length === 0) {
        codigoFuente = '';
        textareaCodigo.value = '';
        alert('No hay información que analizar');
        return;
    }

    for (let i = 0; i < codigoFuente.length; i++) {
        let tokens = [], element = codigoFuente[i];

        tokens = element.trim().split(" ");
        lastIndex = tokens.length - 1;
        lastToken = tokens[lastIndex];
        let hasPuntoComa = lastToken.endsWith(";");

        // Si el último token contiene un ; se separa en otro token
        if (hasPuntoComa) {
            const tokenPuntoComa = lastToken.split(";");
            // Se agregar manualmente el punto y coma a la segunda parte
            tokenPuntoComa[1] = ";" + tokenPuntoComa[1];
            tokens.splice(lastIndex, 1, tokenPuntoComa[0], tokenPuntoComa[1]);
        }
        lexemas.push(tokens);
    }

    console.log(lexemas);
    codigoFuente = '';
});

// obtenerListaToken().then((resultado) => {
//     let mensajeError;
//     for (let i = 0; i < resultado.lexemas.length; i++) {
//         for (let j = 0; j < resultado.lexemas[i].length; j++) {
//             let token = (resultado.lexemas[i][j]).trim();
//             let validaVariable = operadores.variables.test(token);
//             let validaIdentificador = operadores.identificadores.test(token);
//             let validaOperador = operadores.opAritmeticos.test(token);
//             if (validaVariable) {
//                 if (mensaje = "") {
//                     mensaje = `Error en fila ${fila} columna ${j + 1}: ${token} no es una palabra reservada, identificador o operador válido.\n`;
//                 } else {
//                     mensaje += `Error en fila ${fila} columna ${j + 1}: ${token} no es una palabra reservada, identificador o operador válido.\n`;
//                 }
//                 continue;
//             }
//             if (validaOperador) {
//                 if (mensaje = "") {
//                     mensaje = `Error en fila ${fila} columna ${j + 1}: ${token} no es una palabra reservada, identificador o operador válido.\n`;
//                 } else {
//                     mensaje += `Error en fila ${fila} columna ${j + 1}: ${token} no es una palabra reservada, identificador o operador válido.\n`;
//                 }
//                 continue;
//             }
//             if (validaIdentificador) {
//                 if (mensaje = "") {
//                     mensaje = `Error en fila ${fila} columna ${j + 1}: ${token} no es una palabra reservada, identificador o operador válido.\n`;
//                 } else {
//                     mensaje += `Error en fila ${fila} columna ${j + 1}: ${token} no es una palabra reservada, identificador o operador válido.\n`;
//                 }
//                 continue;
//             }
//         }
//     }
//     textareaError.value = mensajeError.join('\n');
// });