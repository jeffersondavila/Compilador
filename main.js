let codigo, lineas;
let lista = [];

var xhttp = new XMLHttpRequest();

// abrir una conexión con el archivo de texto
xhttp.open("GET", "./prueba.txt", true);

// enviar la solicitud y leer el contenido del archivo
xhttp.send();

// función que se llame cada vez que cambia el estado de la conexión.
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        codigo = this.responseText;
        // console.log(codigo);

        // se divide cada saldo de linea
        lineas = codigo.split('\n');

        for (let i = 0; i < lineas.length; i++) {
            lista.push(lineas[i]);
        }
    }
};
console.log(lista);