const botonCargaCodigo = document.getElementById('botonCargaCodigo');
const inputFile = document.getElementById('archivo');
const textareaCodigo = document.getElementById('floatingTextarea1');

botonCargaCodigo.addEventListener('click', () => {
    inputFile.click();
});

inputFile.addEventListener('change', () => {
    const file = inputFile.files[0];
    const reader = new FileReader();

    if (file.type !== 'text/plain') {
        alert('Solo se permiten archivos TXT');
        return;
    }

    reader.addEventListener('load', () => {
        textareaCodigo.value = reader.result;
    });

    reader.readAsText(file);
});
