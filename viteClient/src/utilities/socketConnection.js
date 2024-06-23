import io from 'socket.io-client';
let socket = io.connect('http://localhost:8085');
socket.emit('clientAuth','uihjt3refvdsadf')
// console.log(socket)
export default socket;