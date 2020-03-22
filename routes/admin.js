const express= require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

router.get('/',(req,res)=>{
   //da erro quando eu chamo res.render("admin/index")
   res.render("../views/admin/index.handlebars")

})
router.get('/posts',(req,res)=>{
    res.send("Página de Posts")
})

router.get('/categorias',(req,res)=>{
    res.render("../views/admin/categorias.handlebars")
})
router.get('/categorias/add',(req,res)=>{
        res.render("../views/admin/addcategoria.handlebars")
})

router.post("/categorias/nova",(req,ras)=>{
    const novoCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    new Categoria (novoCategoria).save().then(()=>{
        console.log("Categoria salva com sucesso!");

    }).catch((err)=>{
        console.log("erro ao salvar categoria")
    })
})

module.exports = router