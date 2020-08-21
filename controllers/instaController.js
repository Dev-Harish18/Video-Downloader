const cheerio = require('cheerio')
const axios = require('axios')


exports.download = async function (req, res, next) {

    try {
        const html = await axios({
            method: 'get',
            url: req.body.url
        })
        const $ = cheerio.load(html.data)

        // const videoLink = $("meta[property='og:video']").attr("content")
        // const poster = $("meta[property='og:image']").attr("content")
        // const type = $("meta[property='og:type']").attr("content")
        // const site = $("meta[property='og:site_name']").attr("content")
        // const description = $("meta[property='og:description']").attr("content")

        var meta = $('meta')
        var keys = Object.keys(meta)

        var ogType;
        var ogTitle;

        keys.forEach(function (key) {
            if (meta[key].attribs &&
                meta[key].attribs.property &&
                meta[key].attribs.property === 'og:type') {
                ogType = meta[key].attribs.content;
            }
        });

        keys.forEach(function (key) {
            if (meta[key].attribs &&
                meta[key].attribs.property &&
                meta[key].attribs.property === 'og:title') {
                ogTitle = meta[key].attribs.content;
            }
        });

        // res.locals.data = {
        //     videoLink,
        //     type,
        //     site,
        //     poster,
        //     description
        // }
        res.status(200).json({
            ogTitle,
            ogType,
            html: html.data
        })
        //next()
    } catch (e) {
        console.log('axiosError:', e.message)
        res.status(200).json({
            error: "error"
        })
    }



}