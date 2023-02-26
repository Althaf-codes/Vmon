const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
userName:{
    required:true,
    type:String,
},
email:{
    required:true,
    type:String,
    unique:true
},
password:{
    required:true,
    type:String
},
isParkingOwner:{
    type:Boolean,
    default:false

},
isTrackerEnabled:{
    type:Boolean,
    default:false
    
},
parkingOwnerId:{
  type:mongoose.Types.ObjectId,
  ref:'ParkingOwner'  
},

vehicleConnectionId:{
    type:String,
    unique:true,
},
vehicleConnectionPassword:{
    type:String
},
lat:{
    type:String,
    default:''
},
lon:{
    type:String,
    default:''

},
fuelLevel:{
    type:String,
    default:''

},
speed:{
    type:String,
    default:''
    
},
isBikeTheft:{
    type:Boolean,
    default:false
},
},{ timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = {User,userSchema};