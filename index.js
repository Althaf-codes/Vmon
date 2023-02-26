const express = require('express');
require('dotenv').config();
const http = require('http');
const app = express();
const PORT = process.env.PORT||3000; 
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRoute');

const server = http.createServer(app);



app.use(
    cors({
    origin:"*",}
    
    ));

app.use(express.json());
app.use(authRouter);
app.use(userRouter);

mongoose.set('strictQuery',false);


mongoose.connect(process.env.DB).then(()=>{
    console.log(`DB connected successfully`);
}).catch((e)=>{
    console.log(`THE DB CONNECTION ERROR IS ${e} `);
})



server.listen(PORT,"0.0.0.0",()=>{
    console.log(`server listening at port ${PORT}`);
})


