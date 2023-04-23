import { operadores } from "./operadores.js";

const inputFile = document.createElement('input');
const textarea = document.getElementById('floatingTextarea1');
const textareaError = document.getElementById('floatingTextarea2');
const botonCargarArchivo = document.getElementById('botonCargaCodigo');

function consultaArchivo(nombreArchivo) {
    return new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const lista = [];
                const codigo = this.responseText;
                // se divide cada salto de linea
                const lineas = codigo.split('\n');

                for (let i = 0; i < lineas.length; i++) {
                    lista.push(lineas[i]);
                }
                resolve(lista);
            }
        };
        // abrir una conexión con el archivo de texto
        xhttp.open("GET", `./js/${nombreArchivo}`, true);
        // enviar la solicitud y leer el contenido del archivo
        xhttp.send();
    });
}

// Detectar evento de clic
botonCargarArchivo.addEventListener('click', function () {
    inputFile.type = 'file';
    inputFile.style.display = 'none';
    inputFile.click();
});

/* Función asincrónica que leerá un archivo de texto y devolverá una lista de líneas de código*/
async function obtenerLista() {
    return new Promise((resolve, reject) => {
        inputFile.addEventListener('change', () => {
            const archivoSeleccionado = inputFile.files[0];

            if (!archivoSeleccionado || archivoSeleccionado.type !== 'text/plain') {
                alert('Por favor, seleccione un archivo de texto (.txt)');
                reject();
            } else {
                consultaArchivo(archivoSeleccionado.name).then((lista) => {
                    resolve(lista);
                    console.log(lista);
                }).catch((error) => {
                    console.log(error);
                    reject();
                });
            }
        });
    });
}


/* Función asincrónica que analiza la lista de líneas de código para encontrar patrones específicos*/
async function obtenerListaToken() {
    // Obtener la lista de líneas de código
    const lexemas = [];
    let lastIndex, lastToken;
    const codigoFuente = await obtenerContenidoArchivo();
    console.log("DOS = " + codigoFuente);
    if (codigoFuente === null || codigoFuente === undefined) {
        return { lexemas };
    }
    if (codigoFuente !== null && codigoFuente !== undefined) {
        textarea.value = codigoFuente.join('\n');
        // Analizar cada línea de código
        for (let i = 0; i < codigoFuente.length; i++) {
            let tokens = [];
            const element = codigoFuente[i];

            tokens = element.trim().split(" ");
            lastIndex = tokens.length - 1;
            lastToken = tokens[lastIndex];
            const hasPuntoComa = lastToken.endsWith(";");
            // Si el último token contiene un ; se separa en otro token
            if (hasPuntoComa) {
                const tokenPuntoComa = lastToken.split(";");
                // Se agregar manualmente el punto y coma a la segunda parte
                tokenPuntoComa[1] = ";" + tokenPuntoComa[1];
                tokens.splice(lastIndex, 1, tokenPuntoComa[0], tokenPuntoComa[1]);
            }
            lexemas.push(tokens);
        }
    }
    return { lexemas };
}

obtenerListaToken().then((resultado) => {
    if (resultado && resultado.lexemas) { // Validar que el objeto resultado y su propiedad 'lexemas' no sean nulos o indefinidos
        const mensajeError = resultado.lexemas.reduce((acc, linea, i) => {
            const fila = i + 1;
            const erroresFila = linea.reduce((acc, token, j) => {
                token = token.trim();
                const esPalabraReservada = operadores.variables.test(token);
                const esIdentificador = operadores.identificadores.test(token);
                const esOperador = operadores.opAritmeticos.test(token);
                if (!esPalabraReservada && !esIdentificador && !esOperador) {
                    acc.push(`Error en fila ${fila} columna ${j + 1}: ${token} no es una palabra reservada, identificador o operador válido.`);
                }
                return acc;
            }, []);
            return [...acc, ...erroresFila];
        }, []);
        textareaError.value = mensajeError.length ? mensajeError.join('\n') : '';
    }
});
