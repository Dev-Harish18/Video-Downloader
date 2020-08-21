const express = require('express')
const router = express.Router()
const instaController = require('./controllers/instaController')
const youtubeController = require('./controllers/youtubeController')


router.get('/', home)
router.post('/download/instagram', instaController.download, insta)
router.post('/download/youtube', youtubeController.sendInfo, youtube)
router.get('/download', youtubeController.getVideo)


function home(req, res) {
    //console.log('Home')
    data = res.locals.data ? res.locals.data : {}
    //console.log(data)
    res.render('index', {
        data
    })
}

function youtube(req, res) {
    //console.log('Youtube')
    data = res.locals.data ? res.locals.data : {}
    //console.log(data)
    res.render('youtube', {
        data
    })
}

function insta(req, res) {
    //console.log('Insta')
    data = res.locals.data ? res.locals.data : {}
    //console.log(data)
    res.render('insta', {
        data
    })
}

module.exports = router