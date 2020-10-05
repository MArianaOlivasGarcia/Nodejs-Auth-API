const createError = require('http-errors')
const User = require('../models/user.model')
const { authSchema } = require('../helpers/validation_schema')
const { singAccessToken, singRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper')



module.exports = {

    register: async( req, res, next ) => {
    
        try{
    
            const { email, password } = req.body
    
            //if( !email || !password ) throw createError.BadRequest()
            const result = await authSchema.validateAsync( req.body )
    
            const existe = await User.findOne({ email: result.email })
            if( existe ) throw createError.Conflict(`El email ${email} ya esta registrado`)
    
            const user = new User( result )
            const userdb = await user.save()
    
            const accesToken = await singAccessToken( userdb.id )
            const refreshToken = await singRefreshToken(  userdb.id )
    
    
            res.send( {accesToken, refreshToken} )
    
        } catch ( error ) {
    
            if( error.isJoi === true ) error.status = 422
    
            next(error)
        }
        
    
    },





    login: async( req, res, next ) => {

        try {
            const result = await authSchema.validateAsync( req.body )
            const user = await User.findOne( { email: result.email } )
    
            if ( !user ) throw createError.NotFound('Usuario no registrado')
    
            const isMatch = await user.isValidPassword( result.password )
            if ( !isMatch ) throw createError.Unauthorized('correo y/o contraseña invalidos')
    
            const accesToken = await singAccessToken( user.id )
            const refreshToken = await singRefreshToken(  user.id )
    
            
            res.send( { accesToken, refreshToken } )
        
        } catch ( error ) {
    
            if( error.isJoi === true ) return next( createError.BadRequest('correo y/o contraseña invalidos') )
    
            next(error)
        }
    
    },



    refreshToken: async( req, res, next ) => {
    
        try {
            const { refreshToken } = req.body
    
            if ( !refreshToken ) throw createError.BadRequest()
    
            const userId = await verifyRefreshToken( refreshToken )
    
            const accessToken = await singAccessToken( userId )
            const refToken = await singRefreshToken( userId )
    
            res.send( {accessToken, refreshToken: refToken})
    
        } catch ( error ){
            next( error )
        }
    
    
    }



}