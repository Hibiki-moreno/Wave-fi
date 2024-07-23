const net = require('net');

const ip = process.argv[2];
const puerto = process.argv[3];
const palabra = process.argv[4];


const options = {
    port: 80,
    host: ip


}

const client = net.createConnection(options);

client.on('connect', () => {
    console.log("Conectado a:", ip, puerto,palabra);
   
    // Envía el número del comando al servidor
  
    if (palabra === "limpia") {
        console.log("IP:", ip, "Puerto:", puerto, "Comando:",palabra);
        client.write("1");
    } 
});

// Manejar errores de conexión
client.on('error', (error) => {
    console.error("Error de conexión:", error);
});

// Manejar cierre de conexión
client.on('close', () => {
    console.log("Conexión cerrada");
});

