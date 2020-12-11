const express = require('express')
const routerCategories = express.Router()
const Category = require('./Category')
const Article = require('../articles/Article')
const slugify = require('slugify')
const adminAuth = require('./../../middlewares/adminAuth')

routerCategories.get('/admin/categories/new', adminAuth, (req, res)=>{
    res.render('admin/categories/new.ejs')
})

routerCategories.get('/admin/categories', adminAuth, (req,res)=>{
    Category.findAll({raw:true})
    .then((categories)=>{
        res.render('admin/categories/list.ejs',{categories: categories})
    }).catch((error)=>{console.log(error)})
    
    
})

routerCategories.get('/admin/categories/edit/:id', adminAuth, (req,res)=>{
    var id = req.params.id

    if(isNaN(id)){
        res.redirect('/admin/categories')
    }

    Category.findByPk(id).then((category)=>{
        if(category != undefined){

            res.render('admin/categories/edit',{category:category})

        }else{
            res.redirect('/admin/categories')
        }
    }).catch((error)=>{
        res.redirect('/admin/categories')
    })

})

routerCategories.get('/categories/:slug', (req,res)=>{
    var slug = req.params.slug
    Category.findOne({
        where:{
            slug: slug
        },
        include: [{model: Article}]
    }).then((category)=>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render('category.ejs',{articles: category.articles, categories: categories})
            })
        }else{
            res.redirect('/')
        }
    }).catch((error)=>{res.redirect('/')})
})

routerCategories.post('/categories/save', adminAuth, (req,res)=>{
    var title = req.body.title
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title,{lower: true}) 
        }).then(()=>{
            res.redirect('/admin/categories')
        })
        
    }else{
        res.redirect('/admin/categories/new')
    }  
})

routerCategories.post('/admin/categories/delete', adminAuth, (req,res)=>{
    var id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){
            
            Category.destroy({where:{id: id}})
                .then(()=>{
                    res.redirect('/admin/categories')
                }).catch((error)=>{console.log(error)})

        }else{
            res.redirect('/admin/categories')
        }
    }else{
        res.redirect('/admin/categories')
    }
})

routerCategories.post('/categories/update', adminAuth, (req,res)=>{
    var id = req.body.id
    var title = req.body.title

    Category.update({title: title, 
                    slug: slugify(title,{lower:true})},
    {
        where:{id: id}
    }).then(()=>{
        res.redirect('/admin/categories')
    })
})

module.exports = routerCategories
