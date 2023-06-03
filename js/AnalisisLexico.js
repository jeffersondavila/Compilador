import { operadores } from "./operadores.js";

const textareaCodigo = document.getElementById('floatingTextarea1');
const textareaError = document.getElementById('floatingTextarea2');
const botonAnalisisLexico = document.getElementById('botonAnalisisLexico');

function PrimerToken(token) {
    const listaErrores = [];
    let fila = token[0];
    let subcadena = token[1];
    let validaToken = token[2];
    let finDeclaracion = token[3];
    let sentencia = token[4];

    if (subcadena !== "<QC-") {
        listaErrores.push(`Error en la fila ${fila + 1} | Para declarar una instrucción se debe inicializar con "<QC-"\n`);
    }

    if (!validaToken) {
        listaErrores.push(`Error en la fila ${fila + 1} | La palabra reservada no es válida\n`);
    }

    if (finDeclaracion !== ":") {
        if (sentencia === 0 || sentencia === 1) {
            listaErrores.push(`Error en la fila ${fila + 1} | Después de declarar una instrucción, debe finalizar con ":"\n`);
        }
    }

    return listaErrores;
}

function TokenIntermedio(token) {
}

function UltimoToken(token) {
}

function SentenciaDeControl(token) {
    let validaSentencia = 0;
    const listaSentenciasDeControl1 = [/paso-Fin/g];
    const listaSentenciasDeControl2 = [/paso/g];
    const listaSentenciasDeControl3 = [/paso-porque-paso/g];

    for (const lista of listaSentenciasDeControl1) {
        if (lista.test(token)) {
            validaSentencia = 11;
        }
    }

    if (validaSentencia === 0) {
        for (const lista of listaSentenciasDeControl3) {
            if (lista.test(token)) {
                validaSentencia = 12;
            }
        }
    }

    if (validaSentencia === 0) {
        for (const lista of listaSentenciasDeControl2) {
            if (lista.test(token)) {
                validaSentencia = 1;
            }
        }
    }
    return validaSentencia;
}


function Ciclos(token) {
    let validaCiclo = 0;
    const lista1 = [/Repite/g];
    const lista2 = [/Variar/g];
    const lista3 = [/Chispudo/g];

    for (const list of lista1) {
        if (list.test(token)) {
            validaCiclo = 1;
        }
    }

    if (validaCiclo === 0) {
        for (const list of lista2) {
            if (list.test(token)) {
                validaCiclo = 2;
            }
        }
    }

    if (validaCiclo === 0) {
        for (const list of lista3) {
            if (list.test(token)) {
                validaCiclo = 3;
            }
        }
    }
    return validaCiclo;
}

function ValidarCodigo(lineas) {
    const listaErrores = [];
    let longitudListaErrores;

    for (let fila = 0; fila < lineas.length; fila++) {
        const arregloInterior = lineas[fila];
        let declaraInstruccion = "";
        let estado = 0;
        let sentencia;

        for (let indice = 0; indice < arregloInterior.length; indice++) {
            const elemento = arregloInterior[indice];

            if (elemento === "") {
                continue;
            }

            if (indice === 0) {
                let instruccion, validaToken;
                const longitudElemento = elemento.length;
                const posicionGuion = elemento.indexOf("-") + 1;
                const subcadena = elemento.substring(0, posicionGuion);
                const posicionDoblePunto = elemento.indexOf(":");

                if (posicionDoblePunto !== -1) {
                    instruccion = elemento.substring(posicionGuion, posicionDoblePunto);
                } else {
                    instruccion = elemento.substring(posicionGuion, longitudElemento);
                }

                sentencia = SentenciaDeControl(instruccion);

                if (sentencia === 0) {
                    sentencia = Ciclos(instruccion);
                }

                if (instruccion.endsWith(">")) {
                    instruccion = instruccion.replace(/>$/, "");
                }

                const finDeclaracion = elemento.substring(longitudElemento - 1, longitudElemento);
                validaToken = operadores.palabrasReservadas.test(instruccion);

                if (sentencia === 12) {
                    if (elemento === "<QC-paso-porque-paso> <QC-paso:" || elemento === "<QC-paso-porque-paso><QC-paso:") {
                        validaToken = true;
                    }
                }

                let contenido = [fila, subcadena, validaToken, finDeclaracion, sentencia];

                let resultado = PrimerToken(contenido);
                let longitudResultado = resultado.length;

                if (longitudResultado > 0) {
                    listaErrores.push(resultado);
                }
            } else if (indice !== arregloInterior.length - 1) {
                estado++;
                let validaToken;

                if (sentencia === 0) {
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
                } else if (sentencia === 1) {
                    switch (estado) {
                        case 1: // Variable
                            let tokenElemento;
                            let tokenInicio = elemento.startsWith("[");
                            let longitud = elemento.length;

                            if (tokenInicio) {
                                tokenElemento = elemento.substring(1, longitud);
                            } else {
                                tokenElemento = elemento.substring(0, longitud);
                            }
                            if (!tokenInicio) {
                                listaErrores.push(`Error en la fila ${fila + 1} | La condicion no es valida\n`);
                            }

                            validaToken = operadores.identificadores.test(tokenElemento);

                            if (!validaToken) {
                                listaErrores.push(`Error en la fila ${fila + 1} | El identificador no es válida\n`);
                            }
                            break;
                        case 2: // Identificadores
                            validaToken = operadores.operadoresComparacion.test(elemento);
                            if (!validaToken) {
                                listaErrores.push(`Error en la fila ${fila + 1} | El signo de comparacion no es válido\n`);
                            }
                            break;
                        case 3: // Asignación
                            validaToken = operadores.identificadores.test(elemento);
                            if (!validaToken) {
                                listaErrores.push(`Error en la fila ${fila + 1} | El identificador no es válida\n`);
                            }
                            break;
                    }
                }
            } else {
                const indiceCierre = elemento.length;
                let cadenaIdentificador = elemento.substring(0, indiceCierre);
                const instruccionCierre = elemento.substring(indiceCierre - 1, indiceCierre);
                let validaToken, validaString;

                if (instruccionCierre !== ">") {
                    listaErrores.push(`Error en la fila ${fila} | Para finalizar una instrucción se debe agregar la terminación ">"\n`);
                }
                if (cadenaIdentificador.endsWith(">")) {
                    cadenaIdentificador = cadenaIdentificador.replace(/>$/, "");
                }

                if (sentencia === 0) {
                    if (cadenaIdentificador.startsWith('"') && cadenaIdentificador.endsWith('"')) {
                        validaString = true;
                    }

                    if (declaraInstruccion === "Declaraciones" || declaraInstruccion === "salida" && !validaString) {
                        if (!cadenaIdentificador.startsWith('"')) {
                            validaToken = operadores.identificadores.test(cadenaIdentificador);
                        }
                    }

                    if (validaToken === false) {
                        listaErrores.push(`Error en la fila ${fila} | El identificador no es valido\n`);
                    }

                    if (validaString === false) {
                        listaErrores.push(`Error en la fila ${fila} | La palabra reservada no es valida\n`);
                    }
                } else if (sentencia === 1) {
                    let indiceif = cadenaIdentificador.length;
                    let cadenaif = cadenaIdentificador.substring(0, indiceif - 1);

                    if (!cadenaIdentificador.endsWith("]")) {
                        listaErrores.push(`Error en la fila ${fila + 1} | La condicion no es valida\n`);
                    }

                    validaToken = operadores.identificadores.test(cadenaif);

                    if (!validaToken) {
                        listaErrores.push(`Error en la fila ${fila + 1} | El signo de comparacion no es válido\n`);
                    }
                }
            }
        }
        // Cambia la linea que se esta iterando del código
        // fila += 1;
        declaraInstruccion = "";
    }

    longitudListaErrores = listaErrores.length;

    if (longitudListaErrores === 0) {
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

    var resultadoAnalisis = ValidarCodigo(palabrasPorLinea);

    textareaError.value = resultadoAnalisis;
});