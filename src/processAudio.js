const googleTTS = require('google-tts-api')
var https = require('https');
var fs = require('fs');
var audioconcat = require('audioconcat')
const { htmlToText } = require('html-to-text');
var popeyelib = require('popeyelib')
var makeId = popeyelib.makeId

var setupLang = {
    "French": "fr-Fr",
    "German": "	de-DE",
    "Italian": "it-IT",
    "Spanish": "es-ES",
    "Portuese": "pt-PT",
    "English": "en-US"
}

async function processAudio(elem, lang) {
    return (new Promise(async (resolve, reject) => {
        try {
            var urlAudio = await getUrlAudio(htmlToText(elem.content, {
                wordwrap: 130,
                hideLinkHrefIfSameAsText: true,
                ignoreHref: true,
                ignoreImage: true,
            }), lang)
            var tempListAudio = []

            //console.log("Wait for download " + urlAudio.length + " mp3 files...")
            for (var i of urlAudio) {
                var path = "./tempAudio/" + makeId(25) + ".mp3"
                tempListAudio.push(path)
                await downloadAudio(i.url, path)
            }
            for (var i of tempListAudio) {
                if (!fs.existsSync(i)) {
                    console.log("exist pas", i)
                }
            }
            await concatAudio(tempListAudio, elem.sound.replace('/v1/getSound/', "./DBAUDIO/"))
            for (var i of tempListAudio) {
                fs.unlinkSync(i)
            }
            resolve()
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}

async function getUrlAudio(content, lang) {
    return (new Promise(async (resolve, reject) => {
        try {
            //console.log("--->", setupLang[lang])
            const results = googleTTS.getAllAudioUrls(content, {
                lang: setupLang[lang],
                slow: false,
                host: 'https://translate.google.com',
                splitPunct: '.?:!;',
            })
            resolve(results)
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}

async function downloadAudio(url, path) {
    return (new Promise(async (resolve, reject) => {
        try {
            var file = fs.createWriteStream(path);
            var request = https.get(url, function (response) {
                response.pipe(file).on('error', function (err) {
                    console.log("ERRRRRRORRRRRRRRRRR", err)
                });
            });
            request.on('error', function (err) {
                console.log("ERRRRRRORRRRRRRRRRR", err)
            });
            request.on('finish', function () {
                resolve()
            });
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}

async function concatAudio(pathFiles, output) {
    return (new Promise(async (resolve, reject) => {
        try {
            audioconcat(pathFiles)
                .concat(output)
                .on('error', function (err, stdout, stderr) {
                    console.error('Error:', "err")
                    //console.error('ffmpeg stderr:', stderr)
                    resolve()
                })
                .on('end', function (output) {
                    resolve()
                })
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}

exports.processAudio = processAudio