

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const UserSchema = new Schema({

    email : {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

})


UserSchema.pre('save', async function( next ) {

    try {
        console.log('Llamada antes de guardar usuario');
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash( this.password, salt )
        
        this.password = hashedPassword

        next()

    } catch (error) {
        next(error)
    }

})




UserSchema.post('save', async ( next )  => {

    try {
        console.log('Llamada despues de guardar usuario');
    } catch (error) {
        next(error)
    }

})




UserSchema.methods.isValidPassword = async function( password ){

    try {
        return await bcrypt.compare( password, this.password )
    } catch ( error ) {
        throw error
    }

}





const User = mongoose.model('user', UserSchema)


module.exports = User