const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} =require('../models/userSchema');
const auth = require('../middleware/auth');

authRouter.post("/api/signup",async (req,res)=>{
    //const {phoneNumber,userName,password} = req.body;
     var email = req.body.email;
     var userName =req.body.userName;
     var password = req.body.password;
    console.log(`the email is : ${email}, username : ${userName}, password :${password} `);
    try {
      let existingUser = await User.findOne({"email":email});
   
    
   console.log(`the existing user is ${existingUser}`);
        if( existingUser!=null){
          return res.status(400).json({msg:"User with same phone number already exists"})
      
        }else{
          // const hashedPassword = await bcrypt.hash(password, 8);
        await  bcrypt.hash(password, 8, async function(err, hashedPassword) {
             
              if(err){
                return res.status(400).json({ "msg": "error occurred" });
              }
              var user =new  User({
               "userName": userName,
               "email": email,
               "password": hashedPassword
              })
              
              user = await user.save().then((data)=>{
                  console.log(`the user is ${data}`);
                  const token = jwt.sign({ id: user._id }, "passwordKey");
                  console.log(`the token is ${token}`);
                console.log(`the user is ${user}`);
                res.status(200).json({ "token":token,"user":user});
       
              
              });
  
          });
        }
      
      
      
  } catch (e) {
      console.log(`the error is ${e}`);
      return res.status(400).json({ "msg": e.message })
  }
  
  });
  
  
  authRouter.post("/api/signIn", async(req,res)=>{
      
      const {email,password} = req.body;
      console.log(`the email is : ${email}, , password :${password} `);
  
      
      try {
          let user = await User.findOne({"email":email});
          
          if(user==''||user==null){
              return res
              .status(400)
              .json({ msg: "User with this email does not exist!.Create an account " });
             }
          
             const isMatch = await bcrypt.compare(password,user.password);
             console.log(`the ismatch is ${isMatch}`);
       
       
             if(!isMatch){
               return res.status(400).json({ msg: "Incorrect password." });
              }
              
              const token = jwt.sign({ id: user._id }, "passwordKey");
              console.log(`the token is ${token}`);
            console.log(`the user is ${user}`);
            
            return res.status(200).json({ "token":token,"user":user});
       
       
       
               
           } catch (e) {
            return res.status(500).json({ error: e.message });
           } 
  
       
          
      
  
  
      
  })
  
  

  authRouter.post("/tokenIsValid", async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);
      const verified = jwt.verify(token, "passwordKey");
      if (!verified) return res.json(false);
  
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);
      res.json(true);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  
  
authRouter.get('/',async(req,res)=>{
  res.status(200).json({"msg":"Hi from welcome page"});
})

  authRouter.post("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({ ...user._doc, token: req.token });
  });
  
  
  authRouter.get('/api/getbyid/:id',async( req,res)=>{
      let Id = req.params.id;
      console.log(`the id is ${Id}`);
      var user = await User.findById(Id);
        
      console.log(`the user is ${user}`);
  try {
      if(user){
          console.log(`the user is ${user}`);
          return res.status(500).send(user);
  
      }else{
          return res.status(400).json({"msg":"no user with the id found"});
      }
  } catch (e) {
      console.log(`the error is ${e}`);
      return res.status(400).json({ "msg": e.message })
  }   
  
  })


  
  module.exports = authRouter;
  
    