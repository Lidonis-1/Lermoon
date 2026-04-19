import express from 'express'
import cors from "cors";

const app = express();

/*
app.get('/hello',(req,res) =>{
    res.json({message: "hello world"})
});
*/

const PORT = 5000;
const server = app.listen(PORT, ()=>{
    console.log(`server is started on port ${PORT}`)
});

app.post('/api/upload', (req, res) => {
    console.log("Файл отримано!");
    res.status(200).send("Успішно завантажено");
});