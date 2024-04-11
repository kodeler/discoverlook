const fs = require('fs').promises;
const path = require('path');

// Ruta del proyecto Next.js
const projectPath = process.cwd();

// Función para recorrer el directorio y extraer el código de los archivos
async function extractCode(dirPath, outputFile) {
    try {
        const files = await fs.readdir(dirPath);

        for (let file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await fs.stat(filePath);

            if (stats.isDirectory() && !['node_modules', '.next'].includes(file)) {
                await extractCode(filePath, outputFile);
            } else if (stats.isFile() && /\.(js|jsx|ts|tsx)$/.test(file)) {
                const data = await fs.readFile(filePath, 'utf8');
                await fs.appendFile(outputFile, `// Archivo: ${filePath}\n${data}\n\n`);
            }
        }
    } catch (err) {
        console.error('Error al procesar el directorio:', err);
    }
}

// Función principal para iniciar la extracción
async function runExtraction() {
    const outputFile = 'codigo_extraido.txt';

    try {
        // Limpiar el archivo de salida si ya existe
        await fs.writeFile(outputFile, '');

        // Extraer el código del proyecto
        await extractCode(projectPath, outputFile);
        console.log('Extracción completada con éxito.');
    } catch (err) {
        console.error('Error en la extracción:', err);
    }
}

runExtraction();
