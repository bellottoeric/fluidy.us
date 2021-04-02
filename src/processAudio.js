const gTTS = require('gtts');
const googleTTS = require('google-tts-api')
var https = require('https')
var fs = require('fs')
var audioconcat = require('audioconcat')
const { htmlToText } = require('html-to-text')
const popeyelib = require('popeyelib')
const makeId = popeyelib.makeId
const wait = popeyelib.wait

const setupLangGoogle = {
    "French": "fr-Fr",
    "German": "	de-DE",
    "Italian": "it-IT",
    "Spanish": "es-ES",
    "Portuese": "pt-PT",
    "English": "en-US"
}

const setupLangGtts = {
    "French": "fr",
    "German": "de",
    "Italian": "it",
    "Spanish": "es",
    "Portuese": "pt",
    "English": "en"
}


async function processAudio(content, sound, lang) {
    return (new Promise(async (resolve, reject) => {
        try {
            var gtts = new gTTS(htmlToText(content, {
                wordwrap: 130,
                hideLinkHrefIfSameAsText: true,
                ignoreHref: true,
                ignoreImage: true,
            }), setupLangGtts[lang]);
            gtts.save(sound.replace('/v1/getSound/', "./DBAUDIO/"), function (err, result) {
                if (err) {
                    console.log("Error", err)
                    resolve()
                } else {
                    resolve()
                }
            });
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}


/*
Google tts

var urlAudio = await getUrlAudio(htmlToText(content, {
                wordwrap: 130,
                hideLinkHrefIfSameAsText: true,
                ignoreHref: true,
                ignoreImage: true,
            }), lang)
            var tempListAudio = []
            for (var i of urlAudio) {
                var path = "./tempAudio/" + makeId(25) + ".mp3"
                tempListAudio.push(path)
                await downloadAudio(i.url, path)
            }
            await concatAudio(tempListAudio, sound.replace('/v1/getSound/', "./DBAUDIO/"))
            for (var i of tempListAudio) {
                fs.unlinkSync(i)
            }


async function getUrlAudio(content, lang) {
    return (new Promise(async (resolve, reject) => {
        try {
            const results = googleTTS.getAllAudioUrls(content, {
                lang: setupLangGoogle[lang],
                slow: false,
                host: 'https://translate.google.com',
                splitPunct: '.?:!',
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
            console.log(url)
            var file = fs.createWriteStream(path)
            var request = https.get(url, function (response) {
                response.pipe(file)
            })
            request.on('error', function (e) {
                console.log("*---->", e)
            })
            request.on('finish', async function () {
                resolve()
            })
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}

async function concatAudio(pathFiles, output) {
    return (new Promise(async (resolve, reject) => {
        try {
            console.log(pathFiles, output)
            audioconcat(pathFiles)
                .concat(output)
                .on('error', function (err, stdout, stderr) {
                    console.log('ffmpeg stderr:', stderr)
                    resolve()
                })
                .on('end', function (output) {
                    console.log("PAS DERREUR")
                    resolve()
                })
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}
*/

exports.processAudio = processAudio