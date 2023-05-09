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
    // const palabrasPorLinea = filasCodigo.map(linea => linea.replace(/\t+/g, '').split(' '));

    const palabrasPorLinea = filasCodigo.map(linea => {
        const lineaSinTab = linea.replace(/\t+/g, ''); // Eliminar tabulaciones
        const palabras = [];
        let palabraActual = '';
        let dentroDeComillas = false;

        for (let i = 0; i < lineaSinTab.length; i++) {
            const char = lineaSinTab.charAt(i);
            if (char === ' ' && !dentroDeComillas) {
                // Separar la palabra actual si no estamos dentro de comillas
                if (palabraActual !== '') {
                    palabras.push(palabraActual);
                    palabraActual = '';
                }
            } else if (char === '"') {
                // Cambiar el estado de dentroDeComillas al encontrar una comilla
                dentroDeComillas = !dentroDeComillas;
                palabraActual += char;
            } else {
                palabraActual += char;
            }
        }

        // Añadir la última palabra si no está vacía
        if (palabraActual !== '') {
            palabras.push(palabraActual);
        }

        return palabras;
    });


    if (codigoFuente.length === 0) {
        codigoFuente = '';
        textareaCodigo.value = '';
        alert('No hay información que analizar');
        return;
    }

    for (let arregloInterior of palabrasPorLinea) {
        let declaraInstruccion, estado = 0;
        let longitud = arregloInterior.length;
        for (let elemento of arregloInterior) {

            if (elemento === "") {
                continue
            }

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
                let instruccion = elemento.substring(posicionGuion, posicionDoblePunto);

                // Obtiene el : cuando se declara una instrucción
                let finDeclaracion = elemento.substring(longitudElemento - 1, longitudElemento);

                // Valida que el toquen sea una palabra reservada
                let validaToken = operadores.palabrasReservadas.test(instruccion);

                if (subcadena !== "<QC-") {
                    listaErrores.push(`Error en la fila ${fila} | Para declarar una instrucción se debe inicializar con "<QC-"\n`);
                }

                if (validaToken === false) {
                    listaErrores.push(`Error en la fila ${fila} | La palabra reservada después de la instrucción "<QC-" no es valida\n`);
                } else {
                    declaraInstruccion = instruccion;
                }

                if (finDeclaracion !== ":") {
                    listaErrores.push(`Error en la fila ${fila} | Después de declarar una instrucción, debe finalizar con ":"\n`);
                }
            } else if (indice > 0 && indice !== longitud - 1) {
                estado += 1;
                let validaToken;

                if (estado === 1) { // Variable
                    validaToken = operadores.palabrasReservadas.test(elemento);
                } else if (estado === 2) { // Identificadores
                    validaToken = operadores.identificadores.test(elemento);
                } else if (estado === 3) { // Asignación
                    validaToken = operadores.operadoresAritmeticos.test(elemento);
                }

                if (validaToken === false && estado === 1) {
                    listaErrores.push(`Error en la fila ${fila} | La palabra reservada "${elemento}" no es valida\n`);
                } else if (validaToken === false && estado === 2) {
                    listaErrores.push(`Error en la fila ${fila} | El identificador "${elemento}" no es valido\n`);
                } else if (validaToken === false && estado === 3) {
                    listaErrores.push(`Error en la fila ${fila} | El operador "${elemento}" no es valido\n`);
                }

            } else {
                // Valida el último indice, para determinar que se haya finalizado correctamente la instrucción
                let validaToken, validaString;
                let indiceCierre = elemento.length;
                let cadenaIdentificador = elemento.substring(0, indiceCierre);
                let instruccionCierre = elemento.substring(indiceCierre - 1, indiceCierre);

                if (cadenaIdentificador.endsWith(">")) {
                    cadenaIdentificador = cadenaIdentificador.replace(/>$/, "");
                }

                if (cadenaIdentificador.startsWith('"') || cadenaIdentificador.endsWith('"')) {
                    if (cadenaIdentificador.startsWith('"') && cadenaIdentificador.endsWith('"')) {
                        validaString = true;
                    } else if (!cadenaIdentificador.startsWith('"') && cadenaIdentificador.endsWith('"')) {
                        validaString = false;
                    } else if (cadenaIdentificador.startsWith('"') && !cadenaIdentificador.endsWith('"')) {
                        validaString = false;
                    }
                }

                if (declaraInstruccion === "Declaraciones" && validaString === undefined) {
                    validaToken = operadores.identificadores.test(cadenaIdentificador);
                } else if (declaraInstruccion === "salida" && validaString === undefined) {
                    validaToken = operadores.identificadores.test(cadenaIdentificador);
                }

                if (instruccionCierre !== ">") {
                    listaErrores.push(`Error en la fila ${fila} | Para finalizar una instrucción se debe agregar la terminación ">"\n`);
                }

                if (validaToken === false) {
                    listaErrores.push(`Error en la fila ${fila} | El identificador "${cadenaIdentificador}" no es valido\n`);
                }

                if (validaString === false) {
                    listaErrores.push(`Error en la fila ${fila} | La cadena PISTO no es valida\n`);
                }
            }
            indice++;
        }
        // Cambia la linea que se esta iterando del código
        fila += 1;
        // Reiniciar el índice para el próximo arreglo interno
        indice = 0;
        declaraInstruccion = "";
    }

    textareaError.value = listaErrores;
});