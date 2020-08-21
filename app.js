const express = require('express')
const bodyParser = require('body-parser')

const router = require('./router')
const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.static('public'))

app.set('view engine', 'ejs')
app.set('views', './views')

app.use('/', router)

app.use(function (err, req, res, next) {
    console.log(err.message)
    res.status(200).json({
        error: 'Something went wrong'
    })
})

app.listen(3000, () => {
    console.log("App started Listening at port 3000")
})

module.exports = app