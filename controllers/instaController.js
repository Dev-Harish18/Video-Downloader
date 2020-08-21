const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const path = require('path')


exports.download = async function (req, res, next) {

    try {
        const html = await axios({
            method: 'get',
            url: req.body.url
        })
        const $ = cheerio.load(html.data)

        const videoLink = $("meta[property='og:video']").attr("content")
        const poster = $("meta[property='og:image']").attr("content")
        const type = $("meta[property='og:type']").attr("content")
        const site = $("meta[property='og:site_name']").attr("content")
        const description = $("meta[property='og:description']").attr("content")


        res.locals.data = {
            videoLink,
            type,
            site,
            poster,
            description
        }
        const log = fs.createWriteStream(path.join(__dirname, 'index.txt'))
        log.write(html.data)
        res.sendFile(path.join(__dirname, 'index.txt'))
        next()
    } catch (e) {
        console.log('axiosError:', e.message)
        res.status(200).json({
            error: "error"
        })
    }



}