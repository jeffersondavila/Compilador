let codigo, lineas, longitud, validaToken;
let lista = [], lineaErrores = [];
var xhttp = new XMLHttpRequest();
let variables = /^(?=.*\b(Dim|Integer|Decimal|String|As)\b).*$/gi;

// abrir una conexión con el archivo de texto
xhttp.open("GET", "./prueba.txt", true);

// enviar la solicitud y leer el contenido del archivo
xhttp.send();

// función que se llame cada vez que cambia el estado de la conexión.
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        codigo = this.responseText;

        // se divide cada salto de linea
        lineas = codigo.split('\n');

        for (let i = 0; i < lineas.length; i++) {
            lista.push(lineas[i]);
        }

        for (let i = 0; i < lista.length; i++) {
            const element = lista[i];
            let tokens = element.trim().split(" ");
            // console.log(tokens);
            validaToken = true;

            for (let j = 0; j < tokens.length; j++) {
                if (!variables.test(tokens[j])) {
                    validaToken = false;
                    lineaErrores.push(`Token inválido en línea ${i + 1}: ${tokens[j]}`);
                }
            }
        }
    }
};
console.log(lineaErrores);