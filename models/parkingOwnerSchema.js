const mongoose = require('mongoose');

const parkingOwnerSchema =mongoose.Schema({
userId:{
  type:mongoose.Types.ObjectId,
  ref:'User' 
},

isBike:{
    type:Boolean
},
isCar:{
    type:Boolean
},
isTruck:{
    type:Boolean
},
totalBikeLane:{
    type:Number
},
totalCarLane:{
    type:Number
},
totalTruckLane:{
    type:Number
},
occupiedBikeLane:{
    type:Number
},
occupiedCarLane:{
    type:Number
},
occupiedTruckLane:{
    type:Number
},
bikepricePerHour:{
    type:Number
},
carpricePerHour:{
    type:Number
},
truckpricePerHour:{
    type:Number
},
lat:{
    type:String 
},
lon:{
    type:String
}
},
{ timestamps: true }
);

const ParkingOwner = mongoose.model("ParkingOwner",parkingOwnerSchema);

module.exports = {ParkingOwner,parkingOwnerSchema};