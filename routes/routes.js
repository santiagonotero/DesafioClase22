const {Router} = require('express')
const faker = require("../Faker/index")

const router = Router()

const Productos = require('../models/productos')


router.get('/', (req,res)=>{

    res.render('index',{})
})

router.get('/add', (req,res)=>{

    res.render('add')
})

router.post('/add', (req,res)=>{

    //const {body} = req

    //body.precio = JSON.parse(body.precio)
    //console.log('router.post -> body: %o' , body)
    //Productos.agregarProducto(body)

    res.redirect('/')
})

router.get('/api/productos-test', (req,res)=>{

    const listaFake = faker.crearLista()
    res.render('faker', { listaFake: listaFake })
  })

  module.exports = router