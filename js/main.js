import { operadores } from "./operadores.js";

const botonCargarArchivo = document.querySelector('.btn.btn-outline-secondary.mt-3.ms-2');
const textarea = document.getElementById('floatingTextarea1');
const textareaError = document.getElementById('floatingTextarea2');

/* Función asincrónica que leerá un archivo de texto y
devolverá una lista de líneas de código*/
async function obtenerLista() {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();

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
        xhttp.open("GET", "./js/prueba.txt", true);
        // enviar la solicitud y leer el contenido del archivo
        xhttp.send();
    });
}

// Detectar evento de clic
botonCargarArchivo.addEventListener('click', async function () {
    // Obtener la lista de la función obtenerLista()
    const lista = await obtenerLista();

    // Actualizar el valor del elemento textarea con la lista
    textarea.value = lista.join('\n');
});

/* Función asincrónica que analiza la lista de líneas de código
para encontrar patrones específicos*/
async function obtenerListaToken() {
    // Obtener la lista de líneas de código
    const lexemas = [];
    let lastIndex, lastToken;
    const codigoFuente = await obtenerLista();
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
    return { lexemas };
}

obtenerListaToken().then((resultado) => {
    resultado.lexemas.map((linea, i) => {
        let fila = i + 1;
        linea.map((token, j) => {
            token = token.trim();
            let validaPalabraReservada = operadores.variables.test(token);
            if (validaPalabraReservada) {
                return;
            }
            let validaIdentificador = operadores.identificadores.test(token);
            if (validaIdentificador) {
                return;
            }
            let validaOperador = operadores.opAritmeticos.test(token);
            if (!validaOperador) {
                let mensajeError = `Error en fila ${fila} columna ${(j + 1)}: ${token} no es una palabra reservada, identificador o operador válido.`;
                textareaError.value = mensajeError;
            }
        });
    });
});