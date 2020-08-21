const ytdl = require('ytdl-core')
const ffmpeg = require('ffmpeg-static')
const {
    spawn
} = require('child_process');
const {
    availableFormats
} = require('fluent-ffmpeg');


const tracker = {
    start: Date.now(),
    audio: {
        downloaded: 0,
        total: Infinity
    },
    video: {
        downloaded: 0,
        total: Infinity
    },
    merged: {
        frame: 0,
        speed: '0x',
        fps: 0
    },
};

exports.sendInfo = async function (req, res, next) {
    //console.log(req.body)
    const link = req.body.link
    if (ytdl.validateURL(req.body.link)) {
        //  console.log('Valid URL')
        const videoId = ytdl.getURLVideoID(req.body.link)
        // console.log({
        //     videoId
        // })
        if (ytdl.validateID(videoId)) {
            //console.log('Valid Video Id')

            try {
                const info = await ytdl.getBasicInfo(req.body.link)
                const requiredFormats = [137, 136, 135, 134, 140]
                let availableFormats = info.formats.filter(obj => {
                    return requiredFormats.includes(obj.itag)
                })

                let formats = availableFormats.map(obj => {
                    return {
                        itag: obj.itag,
                        mimeType: obj.mimeType,
                        size: (obj.contentLength) ? (obj.contentLength * 1 / 1000000).toFixed(1) : undefined,
                        quality: obj.qualityLabel
                    }
                })
                // console.log({
                //     formats
                // })
                let videoDetails = {
                    title: info.videoDetails.title,
                    description: info.videoDetails.shortDescription,
                    Length: info.videoDetails.lengthSeconds,
                    isPrivate: info.videoDetails.isPrivate,
                    isLive: info.videoDetails.isLiveContent,
                    isAgeRestricted: info.videoDetails.age_restricted
                }
                const Size = formats.filter(obj => obj.itag == 140)
                // console.log(videoDetails.Length)
                let min = Math.floor(videoDetails.Length * 1 / 60)
                let hour = Math.floor(min / 60)
                min %= 60
                let sec = videoDetails.Length % 60;

                videoDetails.Length = `${hour}:${min}:${sec}`

                console.log({
                    videoDetails,
                    size: Size,
                    Size: Size[0].size
                })

                if (videoDetails.isPrivate)
                    return res.status(200).send({
                        error: 'Private Videos can\'t be downloaded'
                    })
                else if (videoDetails.isLive)
                    return res.status(200).send({
                        error: 'Live Videos can\'t be downloaded'
                    })
                else if (videoDetails.isAgeRestricted)
                    return res.status(200).send({
                        error: 'Age Restricted Videos can\'t be downloaded'
                    })
                res.locals.link = req.body.link
                res.locals.data = {
                    videoDetails,
                    formats,
                    Size: Size[0].size
                }
                next()
            } catch (e) {
                // console.log('ytdlError:', e)
                return res.status(200).json({
                    error: 'Something went Wrong'
                })
            }




        } else {
            return res.status(200).json({
                error: 'Invalid Video Id'
            })
        }
    } else {
        return res.status(200).json({
            error: 'Invalid youtube url'
        })
    }
}

exports.getVideo = function (req, res) {
    console.log({
        query: req.query
    })
    const ref = req.query.link
    const itag = req.query.itag
    const filename = (itag == 140) ? 'Audio.mp3' : 'Video.mp4'
    res.setHeader('Content-Disposition', `attachment;filename=${filename}`)
    const type = filename.split('.')[0]
    const subtype = (filename.split('.')[1] == 'mp4') ? 'mp4' : 'mpeg';
    res.setHeader('Content-Type', `${type}/${subtype}`)

    if (itag == 140) {
        ytdl(ref, {
            quality: itag
        }).pipe(res)
    } else {
        const audio = ytdl(ref, {
                quality: 140
            })
            .on('progress', (_, downloaded, total) => {
                tracker.audio = {
                    downloaded,
                    total
                };
            });
        const video = ytdl(ref, {
                quality: itag
            })
            .on('progress', (_, downloaded, total) => {
                tracker.video = {
                    downloaded,
                    total
                };
            });

        const ffmpegProcess = spawn(ffmpeg, [
            // Remove ffmpeg's console spamming
            '-loglevel', '0', '-hide_banner',
            // Redirect/enable progress messages
            '-progress', 'pipe:3',
            //inputs
            '-i', 'pipe:4',
            '-i', 'pipe:5',
            // Choose some fancy codes
            '-c:v', 'h264',
            '-c:a', 'aac',
            // Define output container
            '-f', 'matroska', 'pipe:6',
        ], {
            windowsHide: true,
            stdio: [
                /* Standard: stdin, stdout, stderr */
                'inherit', 'inherit', 'inherit',
                /* Custom: pipe:3, pipe:4, pipe:5, pipe:6 */
                'pipe', 'pipe', 'pipe', 'pipe',
            ],
        });
        ffmpegProcess.on('close', () => {
            process.stdout.write('\n\n\n\n');
            console.log('done');
        });


        audio.pipe(ffmpegProcess.stdio[4]);
        video.pipe(ffmpegProcess.stdio[5]);
        ffmpegProcess.stdio[6].pipe(res);
    }

}