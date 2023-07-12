const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'https://proyectogrupalsw1-production.up.railway.app',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  let ubicacion = '';
  let mensaje = '';

  socket.on('sendChatToServer', (message) => {
    if (ubicacion === '') {
      ubicacion = message;
      // Preguntar por el problema
      io.emit('sendChatToClient', '¿Cuál es el problema?');
    } else if (mensaje === '') {
      mensaje = message;
      // Enviar la ubicación y el mensaje al servidor de Laravel
      const data = {
        ubicacion: ubicacion,
        mensaje: mensaje,
      };
      $.post('https://proyectogrupalsw1-production.up.railway.app/registrar-denuncia', data, (response) => {
        // Obtener la respuesta de la IA desde el servidor de Laravel
        const respuestaIA = response.respuesta;
        io.emit('sendChatToClient', respuestaIA);
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

http.listen(3000, () => {
  console.log('Socket.IO server running on port 3000');
});
