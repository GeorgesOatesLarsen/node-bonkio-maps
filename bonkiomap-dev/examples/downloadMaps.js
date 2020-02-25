//Make sure to update credentials.js.
//Keep your username and password safe; I have marked credentials.js under the .gitignore,
//but never commit if your password is present!!!
let sanitize = require("sanitize-filename");
let bnkmap = require('bonkiomap');
let cred = require('../credentials.js');
let fs = require('fs');
let readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let sess;

function main() {
    sess = new bnkmap.api.session(cred);
    sess.acquireChecksum(performSearch);
}

function performSearch() {
    rl.question('Name of map: ', function(mapName){
        rl.question('Name of author: ', function(authorName){
            sess.findMapsWithAuthorAndName(mapName, authorName, function(results){
                console.log(results);
                console.log(results.length + ' results found.');
                if (results.length > 0) {
                    rl.question('Save all? (Y/N): ', function (doSave) {
                        if (doSave.toLowerCase() === "y" || doSave.toLowerCase() == "yes") {
                            for (let i = 0; i < results.length; i++) {
                                saveMap(results[i], i);
                            }
                        }
                        process.exit(0);
                    });
                }
                else {
                    process.exit(0);
                }
            });
        });
    });
}

function saveMap(map, index) {
    let title = sanitize(map.mapname + " by " + map.authorname + "(" + index + ")");
    console.log('Saving ' + title + "...");
    let decoded = bnkmap.bonk1.decode(map.leveldata);
    fs.writeFileSync(title + '.json', JSON.stringify(decoded));
}

main();

