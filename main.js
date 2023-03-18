const variables = /^(?=.*\b(Dim|Integer|Decimal|String|As)\b).*$/gi;

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
        xhttp.open("GET", "./prueba.txt", true);
        // enviar la solicitud y leer el contenido del archivo
        xhttp.send();
    });
}

/* Función asincrónica que analiza la lista de líneas de código
para encontrar patrones específicos*/
async function obtenerListaToken() {
    // Obtener la lista de líneas de código
    const lista = await obtenerLista();
    const lineaCodigo = [], lineaErrores = [];

    // Analizar cada línea de código
    for (let i = 0; i < lista.length; i++) {
        let tokens = [];
        const element = lista[i];

        tokens = element.trim().split(" ");
        let lastIndex = tokens.length - 1;
        let lastToken = tokens[lastIndex];
        const hasPuntoComa = lastToken.endsWith(";");

        // Si el último token contiene un ; se separa en otro token
        if (hasPuntoComa) {
            const parts = lastToken.split(";");
            // Se agregar manualmente el punto y coma a la segunda parte
            parts[1] = ";" + parts[1];
            tokens.splice(lastIndex, 1, parts[0], parts[1]);
        }

        lineaCodigo.push(tokens);
    }

    return { lineaCodigo, lista, lineaErrores };
}

obtenerListaToken().then((resultado) => {
    // console.log(resultado.lista);
    // console.log(resultado.lineaErrores);
    console.log(resultado.lineaCodigo);
});