//carregando modulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express();
    const admin = require('./routes/admin')
    const path = require("path")
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")
    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")
    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")
    const usuarios = require("./routes/usuario")
    const passport = require("passport")
    require("./config/auth")(passport)
    

//configurações
    //sessão
        app.use(session({
            secret:"cursodenode",
            resave: true,
            saveUninitialized:true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    //middleware 
      app.use((req,res,next)=>{
          res.locals.success_msg = req.flash("success_msg")
          res.locals.error_msg = req.flash("error_msg")
          res.locals.error = req.flash("error")
          res.locals.user = req.user || null;
          next()
      })

    //body parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //handlebars
        app.engine('handlebars',handlebars({defaultLayout:'main'}))
        app.set('views engine','handlebars');
    //mongoose

        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/blogapp").then(()=>{
            console.log("conectado ao mongoDB!")
        }).catch((err)=>{
            console.log("erro ao de conexão: "+err)
        })

    //public
        app.use(express.static(path.join(__dirname,"public")))
       // app.use(express.static('public'));
      // app.use('/static', express.static('public'));

      
//rotas
    app.get("/",(req,res)=>{
        Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens)=>{
            res.render("../views/index.handlebars",{postagens: postagens})
        }).catch((err)=>{
        req.flash("error_msg","Erro interno")
        res.redirect("/404")
          })
        
      //res.send("pagina principal")
    })
    app.get("/postagem/:slug",(req,res)=>{
        Postagem.findOne({slug: req.params.slug}).then((postagem)=>{

            if(postagem){
                res.render("../views/postagem/index.handlebars",{postagem:postagem})

            }else{
                req.flash("error_msg","essa postagem nao existe!")
                res.redirect("/")

            }

        }).catch((err)=>{
            req.flash("error_msg","Erro interno")
            res.redirect("/")
        })

    })
    app.get("/404",(req,res)=>{
        res.send("Erro 404!")
    })

    app.get("/categorias",(req,res)=>{

        Categoria.find().then((categorias)=>{
            res.render("../views/categoria/index.handlebars",{categorias: categorias})

        }).catch((err)=>{
            req.flash("error_msg","Erro interno")
            res.redirect("/")
        })

    })

    app.get("/categorias/:slug",(req,res)=>{
        Categoria.findOne({slug: req.params.slug}).then((categoria)=>{

            if(categoria){

                Postagem.find({categoria: categoria._id}).then((postagens)=>{

                    res.render("../views/categoria/postagem.handlebars",{postagens: postagens, categoria: categoria})

                }).catch((err)=>{
                    req.flash("error_msg","Erro interno")
                    res.redirect("/")
                })

            }else{
                req.flash("error_msg","Erro essa categoria nao existe!")
                res.redirect("/")
            }

        }).catch((err)=>{
            req.flash("error_msg","Erro ao carregar as categorias")
            res.redirect("/")
        })
    })
    app.use('/usuarios',usuarios)
    app.use('/admin',admin)
//outros
const PORT = 8081

app.listen(PORT,()=>{
    console.log("servidor rodando!");
})
