const express = require('express');
const userRouter = express.Router();
const auth  =require('../middleware/auth');
const {User} = require('../models/userSchema'); 
const bcrypt = require('bcrypt');
var server = require('../index');
const { Socket } = require('socket.io');
//var io = server.getIO;


userRouter.post('/api/registerTracker',async(req,res)=>{
    const {email,password,vehicleConnectionId,vehicleConnectionPassword} = req.body;

    try {
        let user = await User.findOne({"email":email});

        console.log(`The user is ${user}`);
        
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
            
           user = await User.findByIdAndUpdate(user._id,{
            "vehicleConnectionId":vehicleConnectionId,
            "vehicleConnectionPassword":vehicleConnectionPassword
           })
           user.save().then(()=>{

               return  res.status(200).json({ "user":user});
           })
          
     
    
             
         } catch (e) {
          return res.status(500).json({ error: e.message });
         } 

})
userRouter.post('/api/enableTracker',auth,async(req,res)=>{
   
    const {vehicleConnectionId,vehicleConnectionPassword} = req.body;

  try {
      let user =await  User.findById(req.user);
  
      console.log(`the user is ${user}`);
      if(!user)
      {
        return res.status(400).json({msg:"User does not exists!!"});
      }
      if(user.vehicleConnectionId!= vehicleConnectionId||user.vehicleConnectionPassword!=vehicleConnectionPassword){
          return res.status(400).json({msg:"Invalid Tracker Credential"});
  
      }else{
          user = await User.findByIdAndUpdate(req.user,{
              "isTrackerEnabled":true
          })
         return res.status(200).json({"user":user});
      }
  
  } catch (e) {
    console.log(`The error in enabletrackerRoute is ${e.m}`);
    return res.status(500).json({ "error": e.message });
    
  }
})



//Route For GSM

userRouter.get('/api/gsmUpdate/:tracker_id/:lat/:lon/:gsm_data',async(req,res)=>{


   try {
     let gsmdata = req.params.gsm_data.split(",");
     let fuelLevel = gsmdata[0];
     let speed = gsmdata[1];
     
     console.table([{lat:req.params.lat,lon:req.params.lon,fuelLevel:fuelLevel,speed:speed}]);
 
     let user = await User.findOneAndUpdate({"vehicleConnectionId":req.params.tracker_id},{
         "lat":req.params.lat,
         "lon":req.params.lon,
         "fuelLevel":fuelLevel,
         'speed':speed,
        
     });

         if(user==''||user==null){
            return res
            .status(400)
            .json({ msg: "Tracker with this ID does not exist" });
           }
        
             // SOCKET EMIT SHOULD HAPPEN HERE  
            //  io.on("connection",(socket)=>{
            //   console.log(`Socket is connected`);
             
            //   socket.join(vehicleConnectionId);

            //   io.to(vehicleConnectionId).emit('getGpsData',user);
            //  })
         
             return res.status(200).json({"user":user});
     
        
     
   } catch (e) {
    console.log(`The error in gsmupdateRoute is ${e.message}`);
    return res.status(500).json({ "error": e.message });
   }

});
module.exports = userRouter;