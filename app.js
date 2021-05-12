const express=require('express');
const path=require('path');
app=express();
const port=8000;
const bodyparser=require("body-parser");
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/logindb', {useNewUrlParser: true ,useUnifiedTopology: true});

const Bcrypt = require("bcryptjs");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extend: true }));



const loginschema = new mongoose.Schema({
    Name:String,
    Email: String,
    Pass: String
  });

  const login = mongoose.model('login', loginschema);

  app.use('/static',express.static('static'));
app.use(express.urlencoded());

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

app.get('/',(req,res)=>{
    const params={ };
    res.status(200).render('login.pug',params);
})
app.get('/register',(req,res)=>{
    const params={ };
    res.status(200).render('register.pug',params);
})
// app.get('/dashboard',(req,res)=>{
//     const params={ };
//     res.status(200).render('dashboard.pug',params);
// })

app.post('/',(req,res)=>{
    
    req.body.Pass = Bcrypt.hashSync(req.body.Pass, 10);
    var mydata=new login(req.body);
     mydata.save().then(()=>{
         res.send("You have registered successfully");
         
     }).catch(()=>{
         res.status(400).send("Email Id must be unique");
     })
 
     // res.status(200).render('contact.pug',params);
 })


 app.post("/dashboard", async (request, response) => {
    try {
        const params={ };
        var user = await login.findOne({ Email: request.body.Email }).exec();
        if(!user) {
            return response.status(400).send("The username does not exist" );
        }
        if(!Bcrypt.compareSync(request.body.Pass, user.Pass)) {
            return response.status(400).send( "The password is invalid" );
        }
        // response.send({ message: "The username and password combination is correct!" });
            // res.status(200).render('dashboard.pug');
            response.status(200).render('dashboard.pug',params);
            // res.redirect("/dashboard"); 
        
    } catch (error) {
        response.status(500).send(error);
    }
});

 
 app.listen(port,()=>{
    console.log(`Server connected successfully on port ${port}`);
})