const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Category = require('./routers/categories/Category')
const Article = require('./routers/articles/Article')
const session = require('express-session')

const router = require('./routers/router')

const app = express()

app.use(session({
    secret: 'dakfjofjriajaeijioefjspowewer',
    cookie: { maxAge: 30000000 },
    resave: true,
    saveUninitialized: true
}))

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

connection
    .authenticate()
    .then(()=>{
        console.log('Connected')
    }).catch((error)=>{
        console.log(error)
    })

app.use('/', router)

app.listen(3000,()=>{

    console.log('http://localhost:3000')

})