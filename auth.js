const expressJwt = require('express-jwt')

export const JWTMiddleware = expressJwt({
  secret: process.env.SERVER_SECRET,
  getToken: (req) => {
    const auth = req.headers.authorization
    return auth && auth.match(/Bearer .+$/)
      ? auth.split(' ')[1]
      : req.query.token
  }
})
