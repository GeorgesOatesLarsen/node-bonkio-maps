let bnkmap = require('bonkiomap');
let map = bnkmap.samplemaps[10];
let decoded = bnkmap.bonk1.decode(map);
let encoded = bnkmap.bonk1.encode(decoded);
console.log(decoded);
console.log(encoded);