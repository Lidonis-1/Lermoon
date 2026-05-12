import express from 'express'
import cors from "cors";
import fs from "fs"
import multer from "multer"
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { workID, branch } = req.query; // Отримуємо гілку з URL

        if (!workID || workID === 'undefined') {
            return cb(new Error("ID роботи не передано!"), null);
        }

        const branchName = branch || 'main'; // Якщо гілку не вказано, кладемо в main
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
    const { workID, branch } = req.query;
    const branchName = branch || 'main';
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

app.get("/work/image-stream", (req, res) => {
    const { workID, branch, fileName } = req.query;
    const branchName = branch || 'main';
    const filePath = path.join(process.cwd(), 'uploads', String(workID), branchName, String(fileName));

    if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'image/jpeg'); 
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    } else {
        res.status(404).send("Not found");
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
    if (duplicate) return res.sendStatus(409); // Conflict

    try {
        // Тут має бути хешування: const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = { "username": user, "password": pwd }; // Зберігайте хеш, а не чистий пароль!
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

    // Перевірка пароля (наприклад, bcrypt.compare)
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