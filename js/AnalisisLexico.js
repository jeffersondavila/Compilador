import { operadores } from "./operadores.js";

const textareaCodigo = document.getElementById('floatingTextarea1');
const textareaError = document.getElementById('floatingTextarea2');
const botonAnalisisLexico = document.getElementById('botonAnalisisLexico');

botonAnalisisLexico.addEventListener('click', function () {
    let indice = 0, fila = 1;
    let listaErrores = [];
    const codigoFuente = textareaCodigo.value.trim();
    const filasCodigo = codigoFuente.split('\n');
    const palabrasPorLinea = filasCodigo.map(linea => linea.replace(/\t+/g, '').split(' '));

    if (codigoFuente.length === 0) {
        codigoFuente = '';
        textareaCodigo.value = '';
        alert('No hay información que analizar');
        return;
    }

    for (let arregloInterior of palabrasPorLinea) {
        let longitud = arregloInterior.length;
        for (let elemento of arregloInterior) {
            let declaraInstruccion;
            // Valida el primer indice, para determinar que tipo de operacion es y si cumple con el formato
            if (indice === 0) {
                let longitudElemento = elemento.length;
                let subcadena = elemento.substring(0, 4);
                declaraInstruccion = elemento.substring(4, longitudElemento);
                if (subcadena !== "<QC-") {
                    listaErrores.push(`Para declarar una instrucción se debe inicializar con <QC- | Error en la fila ${fila}\n`);
                    fila += 1;
                    textareaError.value = listaErrores;
                }
                if (declaraInstruccion === "Declaraciones") {
                } else if (declaraInstruccion === "salida") {
                }
                console.log(elemento);
            } else if (indice > 0 && indice !== longitud - 1) {
                console.log(elemento);
            } else {
                // Valida el último indice, para determinar que se haya finalizado correctamente la instrucción
                let longitudElemento = elemento.length;
                let subcadena = elemento.substring(longitudElemento - 1, longitudElemento);
                if (subcadena !== ">") {
                    listaErrores.push(`Para finalizar una instrucción se debe agregar la terminación > | Error en la fila ${fila}\n`);
                    fila += 1;
                    textareaError.value = listaErrores;
                }
            }
            indice++;
        }
        indice = 0; // Reiniciar el índice para el próximo arreglo interno
    }

});