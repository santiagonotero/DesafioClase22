const knex = require('knex');
const mongoose = require('mongoose')
const fs = require('fs/promises');
const path = require('path');

class Mensajes{

    constructor(){
        const schema = new mongoose.Schema({
            author: {
                id: String, //'mail del usuario'
                nombre: String, //'nombre del usuario' 
                apellido: String, //'apellido del usuario' 
                edad: Number, //'edad del usuario' 
                alias: String, //'alias del usuario'
                avatar: String //'url avatar (foto, logo) del usuario'
            },
            text: String
        })

        this.model = mongoose.model ('mensajes', schema)
    }

    async cargarMensajes(){
        try{ 
            const msgPool = await this.model.find({})
            return msgPool
        }
        catch(err){
            console.log(err)
        }
    }

    async appendMessage(msg){
        try{ 
            const msgPool = await this.model.create(msg)
            return msgPool
        }
        catch(err){
            console.log(err)
        }
    }

}

module.exports = new Mensajes();