
const path = require('path');
const express = require ('express');
const bodyParser = require('body-parser');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());
//serve static files
app.use(express.static(publicPath));

app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`);
})