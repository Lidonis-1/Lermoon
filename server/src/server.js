import express from 'express'
import cors from "cors";
import fs from "fs"
import multer from "multer"
import path from 'path';

const upload = multer({dest: 'uploads/'});
const app = express();
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use('/uploads', express.static('uploads'));
app.use(express.json())
app.use(cors(corsOptions));

app.listen(8080, ()=>{
    console.log("server is started on port 8080")
})

app.post("/work", upload.array("images"), (req, res)=>{
    console.log("файли збереженні")
    console.log(req.files)
    res.send("ok") // Додано: сервер має відповісти, щоб запит не "висів"
})

app.delete("/work/delete", (req, res)=>{
    // ЗМІНЕНО: прибрано ".." і додано перевірку шляху
    const directory = "./uploads"; 

    fs.readdir(directory, (err, files)=>{
        if (err){
            console.error(err);
            return res.status(500).send("помилка зчитання файлів")
        }
        for (const file of files){
            fs.unlink(path.join(directory, file), (err)=>{
                if (err) console.error(`помилка видалення ${file}:`, err);
            })
        }
        res.status(200).send("+ видалення")
    })
})

app.get("/work", (req, res) => {
    const files = fs.readdirSync('./uploads'); 
    const sortedFiles = files.map(file => ({ // виправлено назву аргументу з files на file
        name: file,
        time: fs.statSync(`./uploads/${file}`).mtime.getTime()
    }))
    .sort((a,b)=> a.time - b.time)
    .map(file=>file.name);

    res.json(sortedFiles);
    console.log("список відправлено")
});

app.get("/profile",(req,res)=>{
    console.log(req.body);
    const work = "/work/125"
    res.json(work).status(200)
})
app.post("/profile", (req, res)=>{
    console.log(req.body.workId)
    res.status(200)
})