import { operadores } from "./operadores.js";

const textareaCodigo = document.getElementById('floatingTextarea1');
const textareaError = document.getElementById('floatingTextarea2');
const botonAnalisisLexico = document.getElementById('botonAnalisisLexico');

botonAnalisisLexico.addEventListener('click', function () {
    const codigoFuente = textareaCodigo.value.trim();
    const filasCodigo = codigoFuente.split('\n');
    const palabrasPorLinea = filasCodigo.map(linea => linea.split(' '));

    if (codigoFuente.length === 0) {
        codigoFuente = '';
        textareaCodigo.value = '';
        alert('No hay información que analizar');
        return;
    }

    console.log(filasCodigo);
    console.log(palabrasPorLinea);
});