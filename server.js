const moment = require('moment')
const fs = require('fs')
const path = require('path')
const logs = '/mnt/c/Users/MattR/.chia/mainnet/plotter'

function readFiles(dir, processFile) {

    fs.readdir(dir, (error, fileNames) => {
        if (error) throw error;

        fileNames.forEach(filename => {
            // get current file name
            const name = path.parse(filename).name;
            // get current file extension
            const ext = path.parse(filename).ext;
            // get current file path
            const filepath = path.resolve(dir, filename);

            // get information about the file
            fs.stat(filepath, function (error, stat) {
                if (error) throw error;

                // check if the current path is a file or a folder
                const isFile = stat.isFile();

                // exclude folders
                if (isFile) {
                    // callback, do something with the file
                    processFile(filepath, name, ext, stat);
                }
            });
        });
    });
    // read directory

}

function readFile(filepath) {
    return new Promise(resolve => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            resolve(data)
        })
    })

}

function findStartDate(logFile) {
    var isoRegex = new RegExp(/(\d{4}-\d{2}-\d{2})[A-Z]+(\d{2}:\d{2}:\d{2}).([0-9+-:]+)/)
    return logFile.match(isoRegex)[0]
}

function getTimeDiff(startTime) {
    var now = moment()
    var then = moment(startTime);

    return moment.utc(moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")

}



function getCurrentTimes() {


    readFiles(logs, async (filepath, name, ext, stat) => {

        var logFile = await readFile(filepath);
        var startTime = findStartDate(logFile)
        var tenHoursAgo = 60 * 60 * 1000 * 10
        var isRecent = (moment() - moment(startTime)) < tenHoursAgo
        if (!isRecent) {
            return;
        }

        var timeDiff = getTimeDiff(startTime)

        console.log(timeDiff)





    })

}


getCurrentTimes()













// const orderReccentFiles = (dir) => {
//     return fs.readdirSync(dir)
//         .filter(file => fs.lstatSync(path.join(dir, file)).isFile())
//         .map(file => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
//         .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
// };

// console.log(orderReccentFiles(logs))
