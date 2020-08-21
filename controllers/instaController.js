const cheerio = require('cheerio')
const axios = require('axios')


exports.download = async function (req, res, next) {

    try {
        delete process.env['http_proxy'];
        delete process.env['HTTP_PROXY'];
        delete process.env['https_proxy'];
        delete process.env['HTTPS_PROXY'];

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
        next()
    } catch (e) {
        console.log('axiosError:', e.message)
        res.status(200).json({
            error: "error"
        })
    }



}