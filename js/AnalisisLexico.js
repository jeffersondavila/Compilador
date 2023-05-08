import { operadores } from "./operadores.js";

const textareaCodigo = document.getElementById('floatingTextarea1');
const textareaError = document.getElementById('floatingTextarea2');
const botonAnalisisLexico = document.getElementById('botonAnalisisLexico');

botonAnalisisLexico.addEventListener('click', function () {
    console.clear();
    let indice = 0, fila = 1;
    let listaErrores = [];
    const codigoFuente = textareaCodigo.value.trim();
    const filasCodigo = codigoFuente.split('\n');
    const palabrasPorLinea = filasCodigo.map(linea => linea.replace(/\t+/g, '').split(' '));

    if (codigoFuente.length === 0) {
        codigoFuente = '';
        textareaCodigo.value = '';
        alert('No hay información que analizar');
        return;
    }

    for (let arregloInterior of palabrasPorLinea) {
        let longitud = arregloInterior.length;
        for (let elemento of arregloInterior) {
            let declaraInstruccion;
            // Valida el primer indice, para determinar que tipo de operacion es y si cumple con el formato
            if (indice === 0) {
                let longitudElemento = elemento.length;

                // Obtiene la posición cuando detecta el signo -
                let posicionGuion = elemento.indexOf("-") + 1;

                // Obtiene la instrucción principal que se utiliza para inicializar algo en el lenguaje <QC-
                let subcadena = elemento.substring(0, posicionGuion);

                // Obtiene la posición cuando detecta el signo :
                let posicionDoblePunto = elemento.indexOf(":");

                // Obtiene la instrucción que se esta inicializando
                declaraInstruccion = elemento.substring(posicionGuion, posicionDoblePunto);

                // Obtiene el : cuando se declara una instrucción
                let finDeclaracion = elemento.substring(longitudElemento - 1, longitudElemento);

                // Valida que el toquen sea una palabra reservada
                let validaToken = operadores.palabrasReservadas.test(declaraInstruccion);

                if (subcadena !== "<QC-") {
                    listaErrores.push(`Error en la fila ${fila} | Para declarar una instrucción se debe inicializar con "<QC-"\n`);
                }

                if (validaToken === false) {
                    listaErrores.push(`Error en la fila ${fila} | La palabra reservada después de la instrucción "<QC-" no es valida\n`);
                }

                if (finDeclaracion !== ":") {
                    listaErrores.push(`Error en la fila ${fila} | Después de declarar una instrucción, debe finalizar con ":"\n`);
                }
            } else if (indice > 0 && indice !== longitud - 1) {
                let validaToken = operadores.palabrasReservadas.test(elemento);

                if (validaToken === false) {
                    listaErrores.push(`Error en la fila ${fila} | La palabra reservada "${elemento}" no es valida\n`);
                }
            } else {
                // Valida el último indice, para determinar que se haya finalizado correctamente la instrucción
                let indiceCierre = elemento.length;
                let cadenaIdentificador = elemento.substring(0, indiceCierre);
                let instruccionCierre = elemento.substring(indiceCierre - 1, indiceCierre);

                if (cadenaIdentificador.endsWith(">")) {
                    cadenaIdentificador = cadenaIdentificador.replace(/>$/, "");
                }

                let validaToken = operadores.identificadores.test(cadenaIdentificador);

                if (instruccionCierre !== ">") {
                    listaErrores.push(`Error en la fila ${fila} | Para finalizar una instrucción se debe agregar la terminación ">"\n`);
                }

                if (validaToken === false) {
                    listaErrores.push(`Error en la fila ${fila} | El identificador "${cadenaIdentificador}" no es valido\n`);
                }
            }
            indice++;
        }
        // Reiniciar el índice para el próximo arreglo interno
        indice = 0;

        // Si contiene errores, suma la fila para registrar las filas donde se detectan los errores
        if (listaErrores.length > 0) {
            fila += 1;
        }
    }

    textareaError.value = listaErrores;
});