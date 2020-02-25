//Make sure to update credentials.js.
//Keep your username and password safe; I have marked credentials.js under the .gitignore,
//but never commit if your password is present!!!
let bnkmap = require('bonkiomap');
let fs = require('fs');
let readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let sess;

function main() {
    rl.question('Path to map to upload:', function(path){
        if (fs.existsSync(path)) {
            let mapObject = JSON.parse(fs.readFileSync(path, 'utf-8'));
            console.log("Ready to upload " + mapObject.name + " by " + mapObject.author);
            rl.question('Please enter your username: ', function(username) {
                rl.question('Please enter your password: ', function(password) {
                    let mapString = bnkmap.bonk1.encode(mapObject);
                    console.log(mapString);
                    let sess = new bnkmap.api.session({username:username, password:password});
                    sess.acquireChecksum(function(){
                        sess.submitWorldString(username, mapObject.title, mapString, function(res) {
                            console.log("Upload finished. Results:");
                            console.log(res);
                            process.exit(0);
                        }, function(err) {
                           console.log(err);
                           process.exit(0);
                        });
                    }, function (err) {
                        console.log(err);
                        process.exit(0);
                    });
                })
            })
        }
        else {
            console.log("No such file exists.");
            process.exit(0);
        }
    });
}

/*

 */

main();

