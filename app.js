const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const router = require('./router')
const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.static('public'))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('view engine', 'ejs')
app.set('views', './views')

app.use('/', router)

app.use(function (err, req, res, next) {
    console.log(err.message)
    res.status(200).json({
        error: 'Something went wrong'
    })
})
process.on('SIGTERM', () => {
    console.log('Process Terminated')
    app.close()
})
app.listen(port, () => {
    console.log("App started Listening at port" + process.env.PORT)
})

module.exports = app