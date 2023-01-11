//jshint esversion:6
const express =require('express');
const bodyparser=require('body-parser');
const ejs =require('ejs');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');
const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('public'));
const options = {
useNewUrlParser: true,
useUnifiedTopology: true,
serverSelectionTimeoutMS: 5000,
autoIndex: false, // Don't build indexes
maxPoolSize: 10, // Maintain up to 10 socket connections
serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
family: 4 // Use IPv4, skip trying IPv6
}
mongoose.connect('mongodb://localhost:27017/userDB',options);
const userSchema= new mongoose.Schema({
  email:String,
  password:String
});
const secret='thisisourlittlesecret';
userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']});
const User=mongoose.model('user',userSchema);
app.get('/',function(req,res){
  res.render('home');
});
app.get('/login',function(req,res){
  res.render('login');
})
app.get('/register',function(req,res){
  res.render('register');
})
app.post('/register',function(req,res){
  const newUser=new User({
    email:req.body.username,
    password:req.body.password
  })
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render('secrets');
    }
  });

})
app.post('/login',function(req,res){
  const userEmail=req.body.username;
  const userPassword=req.body.password;
  User.findOne({email:userEmail},function(err,foundOne){
    if(!err){
      if(foundOne.password==userPassword){
        res.render('secrets');
      }
      else{
        console.log('wrong password');
      }
    }
    else{
      console.log(err);
    }
  })
})
app.listen(3000,function(){
  console.log('server starts on port 3000');
})
