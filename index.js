const express = require("express");

const server = express();

server.use(express.json());

const port = 4041;

server.get("/",(req,res)=>{
    res.status(200).json(
        {
            message :"Home page"
        }
    )
})

server.listen(port,()=>{
    console.log(`server is running on port http://localhost:${port}`)
})