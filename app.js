//carregando modulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express();
    const admin = require('./routes/admin')
    const path = require("path")
    //const mongoose = require('mongoose')

//configurações
    //body parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //handlebars
        app.engine('handlebars',handlebars({defaultLayout:'main'}))
        app.set('views engine','handlebars');
    //mongoose

    //public
        app.use(express.static(path.join(__dirname,"public")))
       // app.use(express.static('public'));
      // app.use('/static', express.static('public'));

//rotas
    app.use('/admin',admin)
//outros
const PORT = 8081

app.listen(PORT,()=>{
    console.log("servidor rodando!");
})
