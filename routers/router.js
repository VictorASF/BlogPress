const express = require('express')
const router = express.Router()
const Article = require('./articles/Article')
const Category = require('./categories/Category')
const Users = require('./users/User')

const routerCategories = require('./categories/CategoriesController')
const routerArticles = require('./articles/ArticlesController')
const routerUsers = require('./users/UsersController')

router.use('/', 
        routerCategories, 
        routerArticles,
        routerUsers
        )

router.get('/', (req,res)=>{
    Article.findAll({
        include : [{model: Category}],
        order: [["id", "DESC"]],
        limit: 4
    }).then(articles=>{

        Category.findAll().then(categories =>{
            res.render('index.ejs', {articles: articles, categories: categories})
        })
    }).catch((error)=>{console.log(error)})
})

module.exports = router

