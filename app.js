
const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()
require('./helpers/init_mongodb')
const { verifyAccessToken } = require('./helpers/jwt_helper')


const app = express()

app.use( morgan('dev') )

app.use( express.json() )
app.use( express.urlencoded( { extended: true } ) )

/* app.use( bodyParser.urlencoded({ extended: false }))
app.use( bodyParser.json()) */


// Rutas
const authRoute = require('./routes/auth.route')

app.use('/auth', authRoute )


app.get('/', verifyAccessToken, async (req, res, next) => {
   
    res.send('Hola mundo')
})


// Manejo de errores
app.use( async( req, res, next ) => {
    next( createError.NotFound('Esta ruta no existe') )
})



app.use( ( err, req, res, next ) => {
    
    res.status( err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
    
})






const PORT = process.env.PORT || 3000;

app.listen( PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})