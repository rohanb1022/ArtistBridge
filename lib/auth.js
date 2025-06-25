import  jwt from 'jsonwebtoken'

export function generateToken(payload){
    return jwt.sign(payload , process.env.JWT_SECRET_KEY , { expiresIn : process.env.JWT_EXPIRES_IN  })
}

export function verifyToken(token){
     return jwt.verify(token  , process.env.JWT_SECRET_KEY)
}