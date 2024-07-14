const bcrypt = require('bcryptjs')
const config = require('../config')
const jwt = require('jsonwebtoken')
const logger = require('../logger')

const login = async (req, h) => {
    return 'TEST' + config.secret
}

const jwtGenerate = async (req, h) => {
    const { mobile, password } = req.payload
    const user = { mobile: '9887672617', password: 'abcdefgh' }
    logger.info(' User ' + mobile + ' ' + password + user.password)
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return h.response('Invalid credentials').code(401)
    }

    const token = jwt.sign({ mobile: user.mobile }, config.JWT_SECRET, {
        expiresIn: '1h',
    })

    return h.response({ token })
}

const user_register = async (req, h) => {
    const { mobile, password } = req.payload
    if (!mobile || !password) {
        return h.response('Username and password are required').code(400)
    }
    const connection = await req.server.mysqlPool.getConnection()
    const [rows] = await connection.query(
        'SELECT * FROM users WHERE username = ?',
        [mobile]
    )
    if (rows.length > 0) {
        return h.response('User already exists').code(400)
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await connection.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [mobile, hashedPassword]
    )

    return h.response({ id: result.insertId, mobile }).code(201)
}

module.exports = {
    login,
    jwtGenerate,
    user_register,
}
