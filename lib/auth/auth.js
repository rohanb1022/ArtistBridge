import  jwt from 'jsonwebtoken'

export function generateToken(payload){ // payload is basically combination of userId and role
    return jwt.sign(payload , process.env.JWT_SECRET_KEY , { expiresIn : process.env.JWT_EXPIRES_IN  })
}

export function verifyToken(token) { // verify will return the payload if token is valid
     return jwt.verify(token  , process.env.JWT_SECRET_KEY)
}