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

router.post("/categorias/nova",(req,res)=>{
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined ||req.body.nome == null){
            erros.push({texto:"nome invalido"})

    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.nome == null){

            erros.push({texto:"slug invalido"})

    }
    if(req.body.nome.length < 2){

        erros.push({texto:"nome da categoria muito pequeno"})

    }

    if(erros.length> 0){

        res.render("../views/admin/addcategoria.handlebars",{erros: erros})

    }else{

         const novoCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria (novoCategoria).save().then(()=>{
            req.flash("success_msg","Categoria criada com sucesso!")
            res.redirect("/admin/categorias")

        }).catch((err)=>{
            req.flash("error_msg","Hove um erro ao registra a categoria tente novamente!")
            res.redirect("/admin")
            //console.log("erro ao salvar categoria")
        })
    }

   
})

module.exports = router