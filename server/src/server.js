import express from 'express'
import cors from "cors";
import fs from "fs"
import multer from "multer"
import path from 'path';
import fsp from 'fs/promises'; 
import { pipeline } from 'stream/promises';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { workID, branch } = req.query;

        if (!workID || workID === 'undefined') {
            return cb(new Error("ID роботи не передано!"), null);
        }

        const branchName = branch || '1';
        const dir = `./uploads/${workID}/${branchName}`;

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

app.delete("/work/delete", (req, res) => {
    const { workID, branch } = req.query;

    if (!workID) return res.status(400).send("workID не вказано");

    const targetPath = branch 
        ? path.join(process.cwd(), 'uploads', String(workID), String(branch))
        : path.join(process.cwd(), 'uploads', String(workID));

    try {
        if (fs.existsSync(targetPath)) {
            fs.rmSync(targetPath, { recursive: true, force: true });
            console.log(`Видалено: ${targetPath}`);
            res.status(200).send("Видалення успішне");
        } else {
            res.status(404).send("Шлях не знайдено");
        }
    } catch (err) {
        console.error("Помилка видалення:", err);
        res.status(500).send("Помилка сервера при видаленні");
    }
});


app.get("/work", (req, res) => {
    const { workID, branch } = req.query;
    const branchName = branch || '1';
    const dirPath = `./uploads/${workID}/${branchName}`;

    if (!fs.existsSync(dirPath)) return res.json([]);

    const files = fs.readdirSync(dirPath);
    
    const sortedFiles = files.map(file => ({
        name: file,
        time: fs.statSync(path.join(dirPath, file)).mtime.getTime()
    }))
    .sort((a, b) => a.time - b.time) 
    .map(file => file.name);

    res.json(sortedFiles);

});

app.get("/work/image-stream", async(req, res, next) => {
    const { workID, branch, fileName } = req.query;
    const branchName = branch || '1';
    const filePath = path.join(process.cwd(), 'uploads', String(workID), branchName, String(fileName));

    try {
        const stat = await fsp.stat(filePath);

        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'image/jpeg'); 

        const stream = fs.createReadStream(filePath);

        await pipeline(stream, res);

    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).send("Not found");
        }

        if (res.headersSent) {
            console.error("Помилка під час стримінгу файлу:", error);
            return;
        }
        next(error);
    }
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

const usersDB = [];

app.post('/register', async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const duplicate = usersDB.find(person => person.username === user);
    if (duplicate) return res.sendStatus(409); 

    try {
        const newUser = { "username": user, "password": pwd }; 
        usersDB.push(newUser);

        console.log(usersDB);
        res.status(201).json({ success: `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/auth', async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

    const foundUser = usersDB.find(person => person.username === user);
    if (!foundUser) return res.sendStatus(401); // Unauthorized

    const match = (pwd === foundUser.password); 
    
    if (match) {
        
        const roles = [2001]; // Приклад ролі (User)
        const accessToken = "your-jwt-token"; // Тут має бути згенерований JWT

        res.json({ 
            data: { 
                roles, 
                accessToken 
            } 
        });
    } else {
        res.sendStatus(401);
    }
});