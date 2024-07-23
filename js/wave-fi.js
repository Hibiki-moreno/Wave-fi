//*****************************************escuchador de eventos de el formulario******************************************************** *//
document.getElementById('formulario').addEventListener('submit', async function(event) {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  try {
    const recognizedWord = await app(); // Obtener la palabra reconocida
   // Enviar la palabra reconocida al servidor
    // Puedes realizar acciones adicionales aquí si lo deseas
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
});

//*************************************** uso de TensorFlow ******************************************************************* */
async function app() {
  const recognizer = await createModel();

  return new Promise((resolve, reject) => {
    recognizer.listen(result => {
      const { scores } = result;
      const classLabels = recognizer.wordLabels();

      const maxScoreIndex = scores.indexOf(Math.max(...scores));

      if (classLabels[maxScoreIndex] !== '_background_noise_' && scores[maxScoreIndex] > 0.75) {
        const recognizedWord = classLabels[maxScoreIndex]; // Almacena la palabra reconocida
        console.log(`Palabra reconocida: ${recognizedWord}`);
        if (recognizedWord == "limpia"){
         
          datos(recognizedWord); // Enviar la palabra reconocida al servidor
          resolve(); // Resolver la promesa
          }
        }
        else{
          app()
      } 
    }, {
      includeSpectrogram: true,
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.50
    });
  });
}

//************************************************* mandar datos al servidor para mandar llamar al cliente ***************************************************************************** */
const URL = "https://teachablemachine.withgoogle.com/models/WG_aeCYi4/";
async function datos(recognizedWord) {
  const ip = document.getElementById('ip').value;
  const puerto = document.getElementById('puerto').value;

  console.log("dentro de datos");
  console.log(recognizedWord);
  
  try {
    const response = await fetch('/ejecutarcliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ip: ip,
        puerto: puerto,
        palabra: recognizedWord // Envía la palabra reconocida al servidor
      }),
    });
    // Puedes manejar la respuesta del servidor aquí si es necesario
  } catch (error) {
    // Manejar errores de red u otros errores
    console.error("Error al enviar los datos:", error);
  }
}

/************************************************************funcion app o main para ir ordenando procesos********************************************************** */
/************************************************************funcion app o main para ir ordenando procesos********************************************************** */

async function createModel() {
  const checkpointURL = URL + "model.json"; // model topology
  const metadataURL = URL + "metadata.json"; // model metadata

  const recognizer = speechCommands.create(
      "BROWSER_FFT", // fourier transform type, not useful to change
      undefined, // speech commands vocabulary feature, not useful for your models
      checkpointURL,
      metadataURL);

  // check that model and metadata are loaded via HTTPS requests.
  await recognizer.ensureModelLoaded();

  return recognizer;
}
