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
    Categoria.find().sort({data:'desc'}).then((categorias)=>{
        res.render("../views/admin/categorias.handlebars",{categorias: categorias.map(categoria => categoria.toJSON())})
    }).catch((err)=>{
        req.flash("error_msq","Hover um erro ao lista categorias!")
        res.redirect("/admin")
    })
    
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
router.get("/categoria/edit/:id",(req,res)=>{
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        
        res.render("../views/admin/editcategoria.handlebars",{categoria: categoria})
       // console.log("categoria :"+categoria)
    }).catch((err)=>{
        req.flash("error_msg","essa categoria nao existe!")
        res.redirect("/admin/categorias")
    })
    

})
router.post("/categorias/edit",(req,res)=>{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        categoria.save().then(()=>{
            req.flash("success_msg","categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg","hove um erro interno no salvamento da categoria!")
            res.redirect("/admin/categorias")
        })


    }).catch((err)=>{
        req.flash("error_msg","hover um erro ao editar a categoria!")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/deletar",(req,res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg","categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req.flash("error_msg","Erro ao deletar categoria")
        res.redirect("/admin/categorias")

    })
})

router.get("/postagens",(req,res)=>{
    res.render("../views/admin/postagens.handlebars")
})

router.get("/postagens/add",(req,res)=>{
    Categoria.find().then((categorias)=>{
         res.render("../views/admin/addpostagens.handlebars",{categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg","Erro ao carregar formulario")
        res.redirect("/admin")
    })
   
})

module.exports = router