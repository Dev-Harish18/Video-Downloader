const cheerio = require('cheerio')
const axios = require('axios')


exports.download = async function (req, res, next) {
    // console.log(req.body)
    try {
        const html = await axios.get(req.body.url)
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
        next()
    } catch (e) {
        console.log('axiosError:', e.message)
    }
    //const videoLink = $('meta[property=og:video]').attr('content')


}