const express= require("express")
const router = express.Router()

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


module.exports = router