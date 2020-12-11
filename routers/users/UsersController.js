const express = require('express')
const User = require('./User')
const routerUsers = express.Router()
const bcrypt = require('bcryptjs')
const adminAuth = require('./../../middlewares/adminAuth')


routerUsers.get('/admin/users', adminAuth, (req,res)=>{

    User.findAll().then((users)=>{
        res.render('admin/users/list', {users: users})
    })
})

routerUsers.get('/admin/users/create', adminAuth, (req,res)=>{
    res.render('admin/users/create.ejs')
})

routerUsers.get('/login', (req,res)=>{
    res.render('login.ejs')
})

routerUsers.get('/logout', adminAuth, (req,res)=>{
    req.session.user = undefined
    res.redirect('/')
})

routerUsers.post('/authenticate', (req,res)=>{
    
    var email = req.body.email
    var password = req.body.password

    User.findOne({where:{email : email}}).then(user=>{
        if(user!=undefined){
            var correct = bcrypt.compareSync(password, user.password)
        
            if(correct){
                req.session.user = {
                    id: user.id,
                    email:user.email,
                    name:user.name
                }
                res.redirect('/admin/articles')
            }else{
                res.redirect('/login')
            }
        }else{
            res.redirect('/login')
        }
    })
})

routerUsers.post('/users/create', adminAuth, (req,res)=>{
    var name = req.body.name
    var email= req.body.email
    var password = req.body.password

    User.findOne({
        where: {email:email}
    }).then(user=>{
        if(user == undefined){
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password,salt)

            if(name!=undefined && email!=undefined && password!=undefined){
                User.create({
                    name: name,
                    email: email,
                    password: hash
                }).then(()=>{
                    res.redirect('/admin/users/list')
                }).catch(error=>{console.log(error)})
            }else{
                res.redirect('/')
            }
        }else{
            res.redirect('/admin/users/create')
        }
    })
})

routerUsers.post('/admin/users/delete', adminAuth, (req,res)=>{
    var id = req.body.id
    if(id!=undefined){
        if(!isNaN(id)){
            User.destroy({where:{id:id}})
                .then(()=>{
                    res.redirect('/admin/users/list')
                }).catch(error=>{
                    console.log(error)
                })
        }
    }else{
        res.redirect('/admin/users/list')
    }
})

module.exports = routerUsers