import express from 'express'
import cors from "cors";
import fs from "fs"
import multer from "multer"
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Пріоритет на Query Params
        const workID = req.query.workID;

        if (!workID || workID === 'undefined' || workID === 'null') {
            return cb(new Error("ID роботи не передано!"), null);
        }

        const dir = `./uploads/${workID}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });
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
    res.send("ok")
})

app.delete("/work/delete", (req, res)=>{
    const workID = req.query.workID;
    const directory = `./uploads/${workID}`; 

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
  
    const workID = req.query.workID; 

    if (!workID) {
        return res.status(400).send("workID не вказано");
    }
    const dirPath = `./uploads/${workID}`;

    if (!fs.existsSync(dirPath)) {
        return res.json([]); 
    }
    const files = fs.readdirSync(dirPath); 
    const sortedFiles = files.map(file => ({
        name: file,
        time: fs.statSync(`${dirPath}/${file}`).mtime.getTime() 
    }))
    .sort((a,b)=> a.time - b.time)
    .map(file => file.name);

    res.json(sortedFiles);
    console.log(`Список файлів для ${workID} відправлено`);
});

app.get("/profile",(req,res)=>{
    const dirArr = fs.readdirSync('./uploads');
    const sortedarr = dirArr.map(file => ({
        name: file,
        time: fs.statSync(`./uploads/${file}`).mtime.getTime()
    }))
    .sort((a,b)=> a.time - b.time)
    .map(file=>file.name);
    res.json(sortedarr)
    console.log("сторінки відправленні")
})

app.post("/profile", (req, res)=>{
    const workID = req.body.workID;
    if (!workID){
        return res.status(400).send("сторінка втрачена")
    }
    const dirPath = path.join(import.meta.dirname, '..', 'uploads', workID)
    try {
       
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

       
        res.status(200).json("створена директорія");
    } catch (err) {
        console.error(err)
        res.status(500).json("помилка створення директорії");
    }
})