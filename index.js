const express = require('express')
const app = express()
const path = require('path')
const multer = require('multer')

app.set('views', path.join(__dirname, "views")) //setting the view folder for 'views' which has html files

app.set('view engine', "ejs") //denoting view engine


//setting storage configurations for media
var storage = multer.diskStorage({
    destination: function (req, file, cb) {   //locate the destination, will take req object, file object and callback
        //custom logic
        cb(null, 'uploads') //used to set the location first arg for error. as of now setting to null
    },
    filename: function (req, file, cb) {   //confguring file name
        //custom logic
        cb(null, file.originalname.replace(/\.[^/.]+$/, '') + '-' + Date.now() + path.extname(file.originalname))
        //original file name + underscore + unique string(date) + extension from original file name
    }
})
//configurin multer object
let maxSize = 2 * 1000 * 1000 //will get bytes for 2mb if want for 5mb -> 5 * 1000 * 1000
let upload = multer({
    storage: storage,
    limits: {
        fileSize: maxSize,
    },
    //filtering file based on extension
    fileFilter: function(req,file,cb){
        let filetypes = /jpg|jpeg|png/  //regex for filetypes
        let mimetype = filetypes.test(file.mimetype) //file.mimetype will have the type of file
        //if the uploaded file was jpeg then mimetype -> image/jpeg
        let extname = filetypes.test(path.extname(file.originalname)) //taking extension name

        if(mimetype && extname){
           return cb(null,true) //boolean value decides acceptance of uploaded file. program should termiate here
        }
         cb("JPEG | JPG | PNG only Allowed")



    }
}).single('mypic')  //input field name

app.get('/',(req,res)=>{
    res.render('singup')
})

app.post('/upload',(req,res)=>{
    //calling the request handler function we have created
    upload(req,res,function(err){  //passing the req and res, thir arg will going to have specified in upload fn
        if(err) res.send(err)
            else res.send("Successfully Uploaded!!")
    })
})

app.listen(8005,()=> console.log("Server running"))