const express= require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")

router.get('/',eAdmin,(req,res)=>{
   //da erro quando eu chamo res.render("admin/index")
   res.render("../views/admin/index.handlebars")

})
router.get('/posts',eAdmin,(req,res)=>{
    res.send("Página de Posts")
})

router.get('/categorias',eAdmin,(req,res)=>{
    Categoria.find().sort({data:'desc'}).then((categorias)=>{
        res.render("../views/admin/categorias.handlebars",{categorias: categorias.map(categoria => categoria.toJSON())})
    }).catch((err)=>{
        req.flash("error_msq","Hover um erro ao lista categorias!")
        res.redirect("/admin")
    })
    
})
router.get('/categorias/add',eAdmin,(req,res)=>{
        res.render("../views/admin/addcategoria.handlebars")
})

router.post("/categorias/nova",eAdmin,(req,res)=>{
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
router.get("/categoria/edit/:id",eAdmin,(req,res)=>{
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        
        res.render("../views/admin/editcategoria.handlebars",{categoria: categoria})
       // console.log("categoria :"+categoria)
    }).catch((err)=>{
        req.flash("error_msg","essa categoria nao existe!")
        res.redirect("/admin/categorias")
    })
    

})
router.post("/categorias/edit",eAdmin,(req,res)=>{
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

router.post("/categorias/deletar",eAdmin,(req,res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg","categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req.flash("error_msg","Erro ao deletar categoria")
        res.redirect("/admin/categorias")

    })
})

router.get("/postagens",eAdmin,(req,res)=>{

    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens)=>{
        res.render("../views/admin/postagens.handlebars",{postagens: postagens})
    }).catch((err)=>{
        req.flash("error_msg","Erro ao lista postagens!")
        res.redirect("/admin")
    })

    
})

router.get("/postagens/add",eAdmin,(req,res)=>{
    Categoria.find().then((categorias)=>{
         res.render("../views/admin/addpostagens.handlebars",{categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg","Erro ao carregar formulario")
        res.redirect("/admin")
    })
   
})

router.post("/postagens/nova",eAdmin,(req,res)=>{

    var erros= []

    if(req.body.categoria == "0"){
        erros.push({texto: "categoria invalida, registre uma categoria"})

    }
    if(erros.length > 0){

        res.render("../views/admin/addpostagens.handlebars",{erros: erros})

    }else{
        const novaPostagem = {
            titulo:req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg","Postagem criada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("error_msg","Erro no salvamento da postagem")
            res.redirect("/admin/postagens")
        })
    }

})
router.get("/postagens/edit/:id",eAdmin,(req,res)=>{
    Postagem.findOne({_id:req.params.id}).then((postagem)=>{

        Categoria.find().then((categorias)=>{

            res.render("../views/admin/editpostagens.handlebars",{categorias: categorias, postagem: postagem})

        }).catch((err)=>{

            req.flash("error_msg","Erro ao carregar as categorias!")
             res.redirect("/admin/postagens")
        })

    }).catch((err)=>{
        req.flash("error_msg","Erro ao carregar o formulario de edição!")
        res.redirect("/admin/postagens")
    })
    

})

router.post("/postagens/edit",eAdmin,(req,res)=>{
    Postagem.findOne({_id: req.body.id}).then((postagem)=>{
        postagem.titulo= req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(()=>{
            req.flash("success_msg","Postagem editada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            console.log("esse e o erro->"+err)
            req.flash("error_msg","erro interno!")
            res.redirect("/admin/postagens")

        })


    }).catch((err)=>{
        req.flash("error_msg","Erro ao salvar a edição!")
        res.redirect("/admin/postagens")
    })
})
//o uso do get nao e uma forma segura da deletar
router.get("/postagens/delete/:id",eAdmin,(req,res)=>{
    Postagem.remove({_id: req.params.id}).then(()=>{
        req.flash("success_msg","Postagem deletada com sucesso!")
        res.redirect("/admin/postagens")
    }).catch((err)=>{
        req.flash("error_msg","Erro interno")
        res.redirect("/admin/postagens")
    })
})

module.exports = router