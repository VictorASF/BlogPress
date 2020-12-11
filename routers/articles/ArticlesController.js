const express = require('express')
const routerArticles = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')
const adminAuth = require('./../../middlewares/adminAuth')

//Gets
routerArticles.get('/admin/articles', adminAuth, (req,res)=>{
    Article.findAll({
        include: [{model: Category}]
    }).then((articles)=>{
            res.render('admin/articles/list',{articles: articles})
    })
})

routerArticles.get('/admin/articles/new', adminAuth,(req,res)=>{
    Category.findAll().then((categories=>{
        res.render('admin/articles/new', {categories: categories})
    }))
    
})

routerArticles.get('/articles/:slug', (req,res)=>{
    var slug = req.params.slug
    Article.findOne({
        where:{
            slug: slug
        }
    }).then((article)=>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render('article.ejs', {article: article, categories: categories})
            })
        }else{
            res.redirect('/')
        }
    }).catch((error)=>{res.redirect('/')})
})

routerArticles.get('/admin/articles/edit/:id', adminAuth, (req,res)=>{
    var id = req.params.id
    Article.findByPk(id).then((article)=>{
        if(article != undefined){

            Category.findAll().then(categories => {
                res.render('admin/articles/edit', {article: article, categories: categories})
            })

        }else{res.redirect('/admin/articles/list')}
    }).catch( error => {res.redirect('/admin/articles/list')})
})

routerArticles.get('/articles/page/:num', (req,res)=>{
    var page = req.params.num
    var offset = 0

    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = (parseInt(page)-1)*4
    }

    Article.findAndCountAll({
        limit:4,
        order: [["id", "DESC"]],
        offset: offset
    }).then(articles =>{

        var next
        if(offset + 4>= articles.count){
            next = false
        }else{
            next = true
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles : articles,
        }

        Category.findAll().then(categories=>{
            res.render('admin/articles/page',{result: result, categories: categories})
        })
    })

})

//Posts
routerArticles.post('/articles/save', adminAuth, (req,res)=>{
    var body = req.body.body
    var title = req.body.title
    var category = req.body.category


    Article.create({
        title: title,
        slug: slugify(title,{lower: true}),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect('/admin/articles/')
    })
    
})

routerArticles.post('/admin/articles/delete', adminAuth, (req,res)=>{
    var id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){
            
            Article.destroy({where:{id: id}})
                .then(()=>{
                    res.redirect('/admin/articles')
                }).catch((error)=>{console.log(error)})

        }else{
            res.redirect('/admin/articles')
        }
    }else{
        res.redirect('/admin/articles')
    }
})

routerArticles.post('/articles/update', adminAuth, (req,res)=>{
    var id = req.body.articleId
    var title = req.body.title
    var category = req.body.category
    var body = req.body.body

    Article.update({title: title, 
                    slug: slugify(title,{lower:true}),
                    categoryId: category,
                    body: body},
    {
        where:{id: id}
    }).then(()=>{
        res.redirect('/admin/articles')
    })
})

module.exports = routerArticles