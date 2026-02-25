const express = require('express')
const app = express()
const path = require('path')
// const angeloneRoutes = require('./router/angelone.route')
const fivePaisaRoutes = require('./router/5Paisa.routes')

app.use(express.json())


// app.use('/angel', angeloneRoutes)
app.use('/' ,fivePaisaRoutes )




module.exports = app




