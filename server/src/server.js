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

app.delete("/delete",(req,res)=>{
    fs.writeFiles("../uploads","",(err)=>{
        console.error(err);
        return res.status(500)
    })
    res.status(200)

})

app.get("/work", (req, res) => {
   
    const files = fs.readdirSync('./uploads'); 
    const sortedFiles = files.map(files => ({
        name: files,
        time: fs.statSync(`${'./uploads'}/${files}`).mtime.getTime()
    }))
    .sort((a,b)=> a.time - b.time)
    .map(file=>file.name);

    res.json(sortedFiles);
    console.log("na")
   
});

app.listen(8080, ()=>{
    console.log("server is started on port 8080")
})

