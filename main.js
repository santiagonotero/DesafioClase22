// >> Consigna 1: 
// Sobre el desafío entregable de la clase 8 (sql y node: nuestra primera base de datos), 
// crear una vista en forma de tabla que consuma desde la ruta ‘/api/productos-test’ del servidor 
// una lista con 5 productos generados al azar utilizando Faker.js como generador de información aleatoria de test 
// (en lugar de tomarse desde la base de datos). Elegir apropiadamente los temas para conformar el objeto ‘producto’ 
// (nombre, precio y foto).

// >> Consigna 2: 
// Ahora, vamos a reformar el formato de los mensajes y la forma de comunicación del chat (centro de mensajes).
// El nuevo formato de mensaje será:

//           { 
//             author: {
//                 id: 'mail del usuario', 
//                 nombre: 'nombre del usuario', 
//                 apellido: 'apellido del usuario', 
//                 edad: 'edad del usuario', 
//                 alias: 'alias del usuario',
//                 avatar: 'url avatar (foto, logo) del usuario'
//             },
//             text: 'mensaje del usuario'
//           }

// >> Aspectos a incluir en el entregable: 
// 1. Modificar la persistencia de los mensajes para que utilicen un contenedor que permita guardar objetos anidados (archivos, mongodb, firebase).
// 2. El mensaje se envía del frontend hacia el backend, el cual lo almacenará en la base de datos elegida. Luego cuando el cliente se conecte o 
//    envie un mensaje, recibirá un array de mensajes a representar en su vista. 
// 3. El array que se devuelve debe estar normalizado con normalizr, conteniendo una entidad de autores. Considerar que el array tiene sus autores 
//    con su correspondiente id (mail del usuario), pero necesita incluir para el proceso de normalización un id para todo el array en su conjunto 
//    (podemos asignarle nosotros un valor fijo).
//    Ejemplo: { id: ‘mensajes’, mensajes: [ ] }
// 4. El frontend debería poseer el mismo esquema de normalización que el backend, para que este pueda desnormalizar y presentar la información 
//    adecuada en la vista.
// 5. Considerar que se puede cambiar el nombre del id que usa normalizr, agregando un tercer parametro a la función schema.Entity, por ejemplo:
//    const schemaAuthor = new schema.Entity('author',{...},{idAttribute: 'email'});
//    En este schema cambia el nombre del id con que se normaliza el nombre de los autores a 'email'. Más info en la web oficial.  
// 6. Presentar en el frontend (a modo de test) el porcentaje de compresión de los mensajes recibidos. Puede ser en el título del centro de mensajes.

// >> Nota: incluir en el frontend el script de normalizr de la siguiente cdn: https://cdn.jsdelivr.net/npm/normalizr@3.6.1/dist/normalizr.browser.min.js
// Así podremos utilizar los mismos métodos de normalizr que en el backend. Por ejemplo:  new normalizr.schema.Entity , normalizr.denormalize(...,...,...)



let express = require("express");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);
const {engine} = require ("express-handlebars")
const path = require("path")
const mongoose = require('mongoose')
const prodMethod = require('./models/productos')
const msgMethod = require('./models/mensajes')
const { HOSTNAME, SCHEMA, DATABASE, USER, PASSWORD, OPTIONS } = require("./DBconfig/Mongo")
const homeRouter = require('./routes/routes')

const PORT = process.env.PORT || 8080

mongoose.connect(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`).then(()=>{
  console.log("Conectado con base de datos MongoDB")
})

let messagePool=[]
let productList=[]

//Iniciamos las bases de datos
//msgMethod.init()
//prodMethod.init()

// msgMethod.readData().then((info)=>{
//   messagePool = info
// })

messagePool = msgMethod.cargarMensajes()
productList = prodMethod.cargarProductos()
// .then((data)=>{
//   console.log('main.js -> productList: %o', data)
// })


// prodMethod.readData().then((info)=>{
//   productList = info
// })

app.use("/static/", express.static(path.join(__dirname, "public")))

app.set('view engine', 'hbs')
app.engine('hbs',engine({
  layoutsDir: path.join(__dirname,'/views'),
  extname: 'hbs',
  defaultLayout:''
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/', homeRouter)

// iniciamos la conexión del socket
io.on("connection", function (socket) {   //Mensaje que indica una conexión. 
  console.log("Un cliente se ha conectado")

  socket.emit("messages", messagePool)

  prodMethod.cargarProductos().then((listaProductos)=>{
    socket.emit('server:productList', listaProductos)
  })

  socket.on('new-message', async (data)=>{  // Mensaje que indica un nuevo mensaje de chat recibido
      msgMethod.appendMessage(data)  // Almacenar mensaje en la base de datos
      messagePool = await msgMethod.cargarMensajes()
      io.sockets.emit("messages", messagePool)
    })

  socket.on('new-product', (prodInfo)=>{ //Mensaje que indica un nuevo producto agregado al stock de productos
    prodInfo.precio = JSON.parse(prodInfo.precio)
    prodMethod.agregarProducto(prodInfo) // Almacenar nuevo producto en la base de datos
      
    //Desnormalización de datos de product
      
    prodMethod.cargarProductos().then((listaProductos)=>{

      productList = prodMethod.data
      console.log('main.js-> mensaje new-product: ' + listaProductos)
      
      io.sockets.emit('server:productList', listaProductos)
    })
  })    
    
})

server.listen(PORT, function () {
    console.log("Servidor corriendo en http://localhost:8080")
  })

