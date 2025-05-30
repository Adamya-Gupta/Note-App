require("dotenv").config();

const express = require('express')
const app = express();
const path = require('path')
const fs = require('fs')

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"pubilc")))


app.get('/',(req,res)=>{
    fs.readdir(`./files`,(err,files)=>{
        res.render("index" ,{files:files})
    })   
})

app.get('/file/:filename',(req,res)=>{
   fs.readFile(`./files/${req.params.filename}`,"utf-8", (err , filedata)=>{
    res.render('show',{filename: req.params.filename, filedata: filedata})
   })
})


app.get('/edit/:filename',(req,res)=>{
    res.render('edit',{filename: req.params.filename})
 })

 app.post('/edit',(req,res)=>{
    fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`,(err)=>{
        res.redirect("/")
    })
 })

app.post('/create',(req,res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,(err)=>{
        res.redirect("/")
    })
})

app.get('/delete/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'files', req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("Failed to delete:", err);
            return res.status(500).send("Failed to delete the note.");
        }
        res.redirect('/');
    });
})

const PORT = process.env.PORT || 3000

app.listen(PORT)