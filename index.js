const express = require('express');
// require('dotenv').config({path:'.env'});
const http = require('http');
const app = express();
const PORT = process.env.PORT||3000; 
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const DB = "mongodb+srv://EmperorAlthaf:ciqGaOvSRHlAca4h@cluster0.wjshxgn.mongodb.net/?retryWrites=true&w=majority"
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRoute');

const server = http.createServer(app);

var io = require('socket.io')(server);

app.use(
    cors({
    origin:"*",}
    
    ));

app.use(express.json());
app.use(authRouter);
app.use(userRouter);

mongoose.set('strictQuery',false);


io.on("connection",(socket)=>{
    console.log(`Socket connected successfully`);

})
mongoose.connect(DB).then(()=>{
    console.log(`DB connected successfully`);
}).catch((e)=>{
    console.log(`THE DB CONNECTION ERROR IS ${e} `);
})



server.listen(PORT,"0.0.0.0",()=>{
    console.log(`server listening at port ${PORT}`);
})


module.exports.getIO = function(){
    return io;
}