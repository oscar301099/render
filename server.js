const express = require('express');
const http = require('http').createServer(express);
const io = require('socket.io')(http, {
  cors: {
    origin: 'https://proyectogrupalsw1-production.up.railway.app/',
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

      // Generar una respuesta automática basada en el mensaje recibido
      const respuestaIA = generarRespuestaAutomatica(mensaje);
      io.emit('sendChatToClient', respuestaIA);

      // Enviar una respuesta de seguimiento después de un tiempo
      setTimeout(() => {
        const respuestaSeguimiento = '¿Hay algo más en lo que pueda ayudarte?';
        io.emit('sendChatToClient', respuestaSeguimiento);
      }, 5000);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

http.listen(3000, () => {
  console.log('Socket.IO server running on port 3000');
});

function generarRespuestaAutomatica(mensaje) {
  // Lógica para generar la respuesta automática basada en el mensaje recibido
  // Puedes implementar tus propias reglas o algoritmos aquí

  // Ejemplo de detección de problemas comunes en los barrios
  if (mensaje.includes('basura')) {
    return 'Entiendo que hay un problema con la recolección de basura en tu barrio. Te recomendaría contactar al servicio de recolección de residuos de tu localidad para informar sobre la situación.';
  } else if (mensaje.includes('incendio')) {
    return 'Lamento escuchar sobre el incendio en tu barrio. Por favor, llama de inmediato a los servicios de emergencia para informar sobre la situación y asegúrate de mantenerte a salvo.';
  } else if (mensaje.includes('choque')) {
    return 'Si has presenciado un choque, te sugiero que contactes a las autoridades de tránsito de tu localidad para reportar el incidente y proporcionarles los detalles necesarios.';
  } else if (mensaje.includes('poste caído')) {
    return 'Si hay un poste caído en tu barrio, te recomendaría que llames al servicio de electricidad correspondiente para informar sobre la situación y solicitar su atención lo antes posible.';
  } else if (mensaje.includes('árbol')) {
    return 'Si hay un árbol con maleza en tu barrio, puedes comunicarte con el departamento de parques y jardines de tu localidad para informar sobre el problema y solicitar su mantenimiento adecuado.';
  } else if (mensaje.includes('información')) {
    return 'Claro, puedo proporcionarte información sobre diversos temas. Por favor, especifica el tema sobre el cual deseas obtener información.';
  } else if (mensaje.includes('clima')) {
    return 'El clima actual en tu área es soleado y la temperatura es de 25 grados Celsius.';
  } else if (mensaje.includes('noticias')) {
    return 'Aquí tienes algunas noticias recientes: [Noticias]';
  } else {
    // Respuesta genérica si el problema no se puede identificar específicamente
    return 'Gracias por tu mensaje. Estoy aquí para ayudarte. Por favor, proporciona más detalles sobre el problema o el tema sobre el cual deseas obtener información para que pueda brindarte una mejor asistencia.';
  }
}
