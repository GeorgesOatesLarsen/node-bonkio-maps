//Make sure to update credentials.js.
//Keep your username and password safe; I have marked credentials.js under the .gitignore,
//but never commit if your password is present!!!

let bnkmap = require('bonkiomap');
let cred = require('../credentials.js');
let sess;

function main() {
    sess = new bnkmap.api.session(cred);
    sess.acquireChecksum(submitWorld);
}

function submitWorld() {
    let map = bnkmap.samplemaps[10];
    let decoded = bnkmap.bonk1.decode(map);
    let encoded = bnkmap.bonk1.encode(decoded);
    sess.submitWorldString(cred.username, "Ultra Clone Map 9000", encoded, function(results) {
        console.log("Upload finished. Results Data:");
        console.log(results);
    });
}

main();

