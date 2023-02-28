
const express = require('express');
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("."));

//Cho phép FE truy cập API từ BE
const cors = require('cors');
app.use(cors());

app.listen(8080);

//route
const rootRoute = require('./routes/rootRoute');
app.use("/api", rootRoute)

console.log(__dirname); // => trả về đường dẫn file của bạn đang đứng
console.log(process.cwd()); // => trả về đường dẫn gốc của project

