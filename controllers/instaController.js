const cheerio = require('cheerio')
const axios = require('axios')


exports.download = async function (req, res, next) {

    try {
        const html = await axios({
            method: 'get',
            url: req.body.url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'
            }
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
        next()
    } catch (e) {
        console.log('axiosError:', e.message)
        res.status(200).json({
            error: "error"
        })
    }



}