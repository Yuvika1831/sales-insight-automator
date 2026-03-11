const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");
const xlsx = require("xlsx");
require("dotenv").config();

const {generateSummary} = require("./gemini");
const {sendEmail} = require("./mailer");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/docs",swaggerUi.serve,swaggerUi.setup(swaggerDoc));

const upload = multer({dest:"uploads/"});

app.post("/analyze",upload.single("file"),async(req,res)=>{

try{

const email = req.body.email;
const filePath = req.file.path;
const fileName = req.file.originalname;

let data = [];

if(fileName.endsWith(".csv")){

fs.createReadStream(filePath)
.pipe(csv())
.on("data",(row)=>data.push(row))
.on("end",async()=>{

const summary = await generateSummary(JSON.stringify(data));

await sendEmail(email,summary);

res.json({
message:"Summary generated and email sent",
summary:summary
});

});

}

else if(fileName.endsWith(".xlsx")){

const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = xlsx.utils.sheet_to_json(sheet);

const summary = await generateSummary(JSON.stringify(jsonData));

await sendEmail(email,summary);

res.json({
message:"Summary generated and email sent",
summary:summary
});

}

else{

res.status(400).json({error:"Invalid file type"});

}

}catch(err){

console.error(err);
res.status(500).json({error:"Server error"});

}

});

app.get("/",(req,res)=>{
res.send("Sales Insight Automator API Running");
});

app.listen(8000,()=>{
console.log("Server running on port 8000");
});