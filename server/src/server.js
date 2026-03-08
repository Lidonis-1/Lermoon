import express from 'express'
import cors from "cors";

const app = express();

/*
app.get('/hello',(req,res) =>{
    res.json({message: "hello world"})
});
*/

const PORT = 5001;
const server = app.listen(PORT, ()=>{
    console.log(`server is started on port ${PORT}`)
});