const { Router, urlencoded, json } = require('express');
const router = Router();
const session = require('express-session')
const token = require('../utils/token')
const cors = require('../filter/cors');
const { formatData } = require("../utils/tools")

const vcodeRouter = require("../router/vcode")
const userRouter = require("../router/user")
const BinxianRouter = require("./Binxian")
const regRouter = require('./reg')
const loginRouter = require('./login')

//  CORS跨域
router.use(cors)

//  数据格式化中间件
router.use(urlencoded({ extended: false }), json())

//  使用session会话
//  通过req.session获取存储会话中的数据
router.use(session({
    secret: 'yiguo',
    resave: false,
    saveUninitialized: true,
    cookie: {
        //  设置cookie有效期
        maxAge: 1000 * 60 * 60 * 2
    }
}))

//  校验token
router.get('/jwtverify', (req, res) => {
    const { authorization } = req.query
    if (token.verify(authorization)) {
        res.send(formatData())
    } else {
        res.send(formatData({ code: 0 }))
    }
})

//  验证码 /api/vcode
router.use('/vcode', vcodeRouter)

//  用户 /api/user
router.use('/user', userRouter)

//  用户注册 /api/reg  验证用户名 /api/reg/check
router.use('/reg', regRouter)

//  用户登录
router.use('/login', loginRouter)

//  冰鲜 /api/Binxian
router.use('/Binxian', BinxianRouter)

module.exports = router;