const express = require('express');
const app = express()
const port = process.env.port || 3000
const userRouter = require('./Users/routes/userRoutes')
const busRouter = require('./Bus-Data/busRouter')
const routeRouter = require('./Trip-data/routeRouter') 
const bookingRouter = require('./Booking-data/bookingRouter')
const locationRouter = require('./Location-data/locationRoutes')
const dotenv = require('dotenv');
require('./Users/db/mongoose')

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(userRouter)
app.use("/admin",busRouter)
app.use("/admin",routeRouter)
app.use(bookingRouter)
app.use("/admin",locationRouter)

app.listen(port, ()=> console.log(`Listening on port ${port}...`))