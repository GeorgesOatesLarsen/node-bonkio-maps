/*
 * So if anyone wants to make a full version of the bonk API
 * as a node package based on this I'd be down to support that.
 */
let http = require('http');
let querystring = require('querystring');
let md5 = require('md5');

const APIURL = 'multiplayer.gg';
const services = {
    account:'/physics/scripts/account5.php',
    maps:'/physics/scripts/maps9.php',
    checksum:'/physics/scripts/getchecksumcode.php'
};

class BonkAPISession {
    constructor(credentials) {
        this.credentials = credentials;
    }
    acquireChecksum(callback, errCallback = this.printError) {
        let self = this;
        this.simpleHTTPPOST(APIURL, services.checksum, {
            ignorethis:this.makeRandom(),
        }, function(res) {
            self.checksum = querystring.decode(res)['id'];
            callback();
        }, errCallback);
    }
    searchMaps(query, byName, byAuthor, callback, errCallback = this.printError) {
        let self = this;
        this.simpleHTTPPOST(APIURL, services.maps, {
            startingfrom:0,
            timedivisor:1,
            searchstring:query,
            searchsort:'ctr',
            task:2,
            noresults:60,
            getrule:"search",
            ignorethis:this.makeRandom(),
            searchmapname:byName?"true":"",
            searchauthor:byAuthor?"true":"",
            basePasswordString:"77564898",
        }, function(res) {
            callback(self.parseMapSet(res, 60));
        }, errCallback);
    }
    findMapsWithAuthorAndName(mapName, authorName, callback, errCallback = this.printError) {
        let self = this;
        this.searchMaps(mapName, true, false, function(res){
           let res1 = res;
           self.searchMaps(authorName, false, true, function (res) {
                let filtered = res1.concat(res).filter((m) => (m.mapname == mapName) && (m.authorname == authorName));
                let mapStrings = [];
                let finalFiltered = [];
                for (let i = 0; i < filtered.length; i++) {
                    if (mapStrings.indexOf(filtered[i].leveldata) == -1)
                    {
                        mapStrings.push(filtered[i].leveldata);
                        finalFiltered.push(filtered[i]);
                    }
                }
                callback(finalFiltered);
           }, errCallback)
        }, errCallback);
    }
    parseMapSet(rawString, maxN) {
        let resraw = querystring.decode(rawString);
        let resfull = [];
        for (let i = 0; i < maxN + 1; i++){
            if (('mapid'+i in resraw) && ('public'+i in resraw)) {
                resfull.push({
                    mapid:resraw['mapid' + i],
                    mapname:resraw['mapname' + i],
                    creationdate:resraw['creationdate' + i],
                    modifieddate:resraw['modifieddate' + i],
                    thumbsup:parseInt(resraw['thumbsup' + i]),
                    thumbsdown:parseInt(resraw['thumbsdown' + i]),
                    score:parseInt(resraw['score' + i]),
                    authorname:resraw['authorname' + i],
                    leveldata:resraw['leveldata' + i],
                    ispublic:(resraw['public' + i] === '1')
                });
            }
            else {
                break;
            }
        }
        return resfull;
    }
    submitWorldString(author, title, data, callback, errorCallback = this.printError) {
        this.simpleHTTPPOST(APIURL, services.maps, {
            ignorethis:this.makeRandom(),
            basePasswordString:"77564898",
            task:1,
            authorname:author,
            password:this.hashPassword(),
            mapname:title,
            mapdata:data,
            checksumcode:this.checksum,
            checksumhash:this.stupidHash(),
            publicmap:1,
        }, function(res) {
            callback(querystring.decode(res));
        }, errorCallback);
    }
    stupidHash() {
        return md5(this.checksum + "checksumsalt343434" + 'MTU3Njg4MjI5OA==MzE1Mzc2NDU5Ng==MTEwMzgxNzYwODY=MjA0OTk0Njk4NzQ=')
    }
    hashPassword() {
        return md5(this.credentials.password);
    }
    makeRandom() {
        return Math.floor(Math.random() * 100000) + 1;
    }
    printError(err) {
        throw err;
    }
    simpleHTTPPOST(host, path, query, callback, errorCallback) {
        let postData = querystring.stringify(query);
        var options = {
            host: host,
            method: 'POST',
            path: path,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        let req = http.request(options, function (res) {
            let result = '';
            res.on('data', function (chunk) {
                result += chunk;
            });
            res.on('end', function () {
                callback(result);
            });
            res.on('error', function (err) {
                errorCallback(err);
            });
        });

        req.on('error', function (err) {
            errorCallback(err);
        });

        req.write(postData);
        req.end();
    }
}

module.exports = {
    session:BonkAPISession,
}