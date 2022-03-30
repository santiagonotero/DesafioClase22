
let socket = io.connect("http://localhost:8080", { forceNew: true });

let date=new Date()

socket.on("messages", (message)=> {  //Mensaje para actualizar el listado de mensajes de la página index.html
    let plantillaChat=document.getElementById('areaChat')
    if(plantillaChat){
        let compile = Handlebars.compile(plantillaChat.innerHTML)
        let result = compile({message})
        let msgPool=document.getElementById('messagePool')
        msgPool.innerHTML = result
    }
})

socket.on('server:productList', (items)=>{  //Mensaje para actualizar el listado de productos de la página index.htm
    let plantillaProductos=document.getElementById('plantillaProductos')
    if( plantillaProductos){
        console.log('server:productList ->items: ' , items)
        let compile = Handlebars.compile(plantillaProductos.innerHTML)
        let result = compile({items})
        let listado=document.getElementById("listado")
        listado.innerHTML = result
    }
})

addMessage=(e)=>{
    console.log("addMessage")
    let message={
        author:{
            id: document.getElementById('id').value,
            nombre: document.getElementById('nombreUsuario').value,
            apellido: document.getElementById('apellidoUsuario').value,
            edad: document.getElementById('edad').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: document.getElementById('mensaje').value
        // date: date.getDate() +'/' + (date.getMonth() +1) + '/' + date.getFullYear(),
        // time: date.getHours()+ ':' + date.getMinutes().toPrecision(2) + ':' + date.getSeconds().toPrecision(2)
    }

    socket.emit('new-message', message) // Envía mensaje indicando un nuevo mensaje en el chat, junto con su contenido. Este mensaje es recibido en /server/main.js
    return false
}

addProduct=(e)=>{
    console.log('addProduct')
    let article={
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        foto: document.getElementById('foto').value
    }

    socket.emit('new-product', article) // Envía mensaje indicando un nuevo producto agregado. Este mensaje es recibido en /server/main.js
    return false
}