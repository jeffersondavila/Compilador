import { operadores } from "./operadores.js";

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
    console.log(resultado.lexemas);
});