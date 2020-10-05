

const mongoose = require('mongoose')

mongoose.connect( process.env.MONGODB_URI , { 
    dbName: process.env.DB_NAME ,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then( () => console.log('Base de datos Online') )
  .catch( err => console.log( err.message ) )



mongoose.connection.on('connected', () => {
    console.log('Mongoose conectado a la base de datos')
})


mongoose.connection.on('error', (err) => {
    console.log(err.message)
})


mongoose.connection.on('disconnected', () => {
    console.log('Mongoose desconectado de la base de datos')
})


process.on('SIGINT', async() => {
    await mongoose.connection.close()
    process.exit(0)
})