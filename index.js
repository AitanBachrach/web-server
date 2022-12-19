const express = require('express')
const dotenv = require('dotenv')
dotenv.config();

const app = express
const PORT = process.env || 5001;

app.get('/endpoint-1', (req, res, next) =>{
    res.status(200).json({
        success:true,
        data: {
            message: 'hello from endpoint 1'
        } 
    })
})

app.get('/endpoint-2', (req, res, next) =>{
    res.status(200).json({
        success:true,
        data: {
            message: 'hello from endpoint 2'
        } 
    })
})


app.listen(PORT, () => console.log('Server is running on this port ${PORT}'))