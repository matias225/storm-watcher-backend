const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
// Crear el sevidor de express
const app = express();

const serviceAccount = require('./stormapp-2ff78-firebase-adminsdk-7lqiy-b7b5b69236.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(bodyParser.json());

// Debo utilizar cors para poder deshabiilitar CORS y que el navegador me deje probar desde 2 local host.
app.use(cors());

// Rutas
app.get('/', (req, res) => {
  res.json({
    server_online: true,
  })
});

app.post('/send-notification', async (req, res) => {
  try {
    const { title, body, token } = req.body;
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: token
    }
    const response = await admin.messaging().send(message);
    res.status(200).send('Notification send successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error sending notification');
  }
});

// Escuchar peticiones
app.listen(3050, () => {
  console.log('Servidor escuchando en puerto', 3050);
});
