const {Router} = require('express')
const faker = require("../Faker/index")
const modelProductos = require('../models/productos')
const modelMensajes = require('../models/mensajes')

const router = Router()


router.get('/', async (req,res)=>{

    const items = await modelProductos.cargarProductos()
    const mensajes = await modelMensajes.cargarMensajes()
   
    res.render('index', {items: items, mensajes: mensajes})    

})



router.get('/add', (req,res)=>{

    res.render('add')
})

router.post('/add', (req,res)=>{
    res.redirect('/')
})

router.get('/api/productos-test', (req,res)=>{

    const listaFake = faker.crearLista()
    res.render('faker', { listaFake: listaFake })
  })

  module.exports = router