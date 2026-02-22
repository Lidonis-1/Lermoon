import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("server is runninng");
});

app.listen(5000, ()=>{
    console.log("server is started on port 5000")
})