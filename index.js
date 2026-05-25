const express = require("express");



// importing routes
const usersRouter = require("./routes/users")
const booksRouter = require("./routes/books")

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

server.use("/users",usersRouter);
server.use("/books",booksRouter);





server.listen(port,()=>{
    console.log(`server is running on port http://localhost:${port}`)
})