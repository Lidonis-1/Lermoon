import express from 'express'
import cors from "cors";
import fs from "fs"
import multer from "multer"

const upload = multer({dest: 'uploads/'});
const app = express();
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use('/uploads', express.static('uploads'));
app.use(express.json())
app.use(cors(corsOptions));

app.post("/work", upload.array("images"), (req, res)=>{
    console.log("файли збереженні")
    console.log(req.files)
})

app.get("/work", (req, res) => {
   
    const files = fs.readdirSync('./uploads'); 
    res.json(files);
    console.log("na")
   
});

app.listen(8080, ()=>{
    console.log("server is started on port 8080")
})

