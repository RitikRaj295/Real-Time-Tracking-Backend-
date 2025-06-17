import express from "express";
import http from "http";
import { Server } from "socket.io";

const app=express();
const server=http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.set("view engine","ejs");
app.use(express.static("./Public"))

io.on("connection",(socket)=>{
    console.log("new user connected")
    socket.on("send-location",(data)=>{
        io.emit("recieve-location",{id: socket.id,...data})
    });

    socket.on("disconnect",()=>{
        io.emit("user-disconnect",socket.id)
    });
});



app.get("/",(req,res)=>{
    res.render("index");
})

server.listen(PORT,()=>{console.log("Server is listening on port no: 3000")});

