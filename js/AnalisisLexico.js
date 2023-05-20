import { operadores } from "./operadores.js";

const textareaCodigo = document.getElementById('floatingTextarea1');
const textareaError = document.getElementById('floatingTextarea2');
const botonAnalisisLexico = document.getElementById('botonAnalisisLexico');

function validarCodigo(lineas) {
    const listaErrores = [];
    let longitudListaErrores;

    for (let fila = 0; fila < lineas.length; fila++) {
        const arregloInterior = lineas[fila];
        let declaraInstruccion = "";
        let estado = 0;

        for (let indice = 0; indice < arregloInterior.length; indice++) {
            const elemento = arregloInterior[indice];

            if (elemento === "") {
                continue;
            }

            if (indice === 0) {
                const longitudElemento = elemento.length;
                const posicionGuion = elemento.indexOf("-") + 1;
                const subcadena = elemento.substring(0, posicionGuion);
                const posicionDoblePunto = elemento.indexOf(":");
                const instruccion = elemento.substring(posicionGuion, posicionDoblePunto);
                const finDeclaracion = elemento.substring(longitudElemento - 1, longitudElemento);
                const validaToken = operadores.palabrasReservadas.test(instruccion);

                if (subcadena !== "<QC-") {
                    listaErrores.push(`Error en la fila ${fila + 1} | Para declarar una instrucción se debe inicializar con "<QC-"\n`);
                }

                if (!validaToken) {
                    listaErrores.push(`Error en la fila ${fila + 1} | La palabra reservada no es válida\n`);
                } else {
                    declaraInstruccion = instruccion;
                }

                if (finDeclaracion !== ":") {
                    listaErrores.push(`Error en la fila ${fila + 1} | Después de declarar una instrucción, debe finalizar con ":"\n`);
                }
            } else if (indice !== arregloInterior.length - 1) {
                estado++;
                let validaToken;

                switch (estado) {
                    case 1: // Variable
                        validaToken = operadores.palabrasReservadas.test(elemento);
                        if (!validaToken) {
                            listaErrores.push(`Error en la fila ${fila + 1} | La palabra reservada no es válida\n`);
                        }
                        break;
                    case 2: // Identificadores
                        validaToken = operadores.identificadores.test(elemento);
                        if (!validaToken) {
                            listaErrores.push(`Error en la fila ${fila + 1} | El identificador no es válido\n`);
                        }
                        break;
                    case 3: // Asignación
                        validaToken = operadores.operadoresAritmeticos.test(elemento);
                        if (!validaToken) {
                            listaErrores.push(`Error en la fila ${fila + 1} | El operador no es válido\n`);
                        }
                        break;
                }
            } else {
                const indiceCierre = elemento.length;
                let cadenaIdentificador = elemento.substring(0, indiceCierre);
                const instruccionCierre = elemento.substring(indiceCierre - 1, indiceCierre);
                let validaToken, validaString;

                if (cadenaIdentificador.endsWith(">")) {
                    cadenaIdentificador = cadenaIdentificador.replace(/>$/, "");
                }

                if (cadenaIdentificador.startsWith('"') && cadenaIdentificador.endsWith('"')) {
                    validaString = true;
                }

                if (declaraInstruccion === "Declaraciones" || declaraInstruccion === "salida" && !validaString) {
                    if (!cadenaIdentificador.startsWith('"')) {
                        validaToken = operadores.identificadores.test(cadenaIdentificador);
                    }
                }

                if (instruccionCierre !== ">") {
                    listaErrores.push(`Error en la fila ${fila} | Para finalizar una instrucción se debe agregar la terminación ">"\n`);
                }

                if (validaToken === false) {
                    listaErrores.push(`Error en la fila ${fila} | El identificador no es valido\n`);
                }

                if (validaString === false) {
                    listaErrores.push(`Error en la fila ${fila} | La palabra reservada no es valida\n`);
                }
            }
        }
        // Cambia la linea que se esta iterando del código
        fila += 1;
        declaraInstruccion = "";
    }

    longitudListaErrores = listaErrores.length;

    if (longitudListaErrores === 0){
        listaErrores.push(`Compilación Exitosa UwU\n`);
    }

    return listaErrores;
}

botonAnalisisLexico.addEventListener('click', function () {
    console.clear();
    const codigoFuente = textareaCodigo.value.trim();
    const filasCodigo = codigoFuente.split('\n');

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

    var resultadoAnalisis = validarCodigo(palabrasPorLinea);

    textareaError.value = resultadoAnalisis;
});