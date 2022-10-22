import express from 'express'
import db from './config/db.js'
import api from './routes/api.js'
import bp from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import cookieParser from 'cookie-parser'


dotenv.config()
const port = process.env.PORT || 4000
const app = express()
app.use(cookieParser())
app.use(express.static( "public" ) );
app.use(express.urlencoded({ extended:true}));
app.use(cors({ origin:"*", credentials:true }))
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json())
app.use('/',api)
app.listen(port,()=>{
    console.log('App is running on port '+`${port}`)
})