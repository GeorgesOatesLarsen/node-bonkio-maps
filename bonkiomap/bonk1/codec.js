const pako = require('pako');
const ByteArray = require('bytearray-node')
const IExternalizable = require('bytearray-node/enums/IExternalizable');

/**
 * Takes a native bonk1 object and encodes it into a map string
 * @param {Object} map
 * @returns {string} encoded
 */
function encode(map) {
	return packString(encodeBinary(map));
}

/**
 * Takes a native bonk1 object and encodes it into a map binary
 * @param {Object} map
 * @returns {Buffer} encoded
 */
function encodeBinary(map) {
	let ba = new ByteArray();
	ba.writeObject(fromAnonymous(map));
	return ba.buffer;
}

/**
 * Takes a raw bonk1 world string and decodes it into a native representation of the map.
 * @param {string} String Source
 * @returns {Object} an object representing the map structure.
 */
function decode(src) {
	return decodeBinary(unpackString(src));
}

/** Takes a Buffer of a raw bonk1 world binary and converts it into a native representation of the map.
 * @param {Buffer} The Buffer containing the world binary
 * @returns {Object} The native representation.
 */
function decodeBinary(buf) {
	let ba = new ByteArray(buf);
	return toAnonymous(ba.readObject());
}

/**
 * Takes a raw bonk1 world string and converts it to the corresponding AMF3 binary.
 * @param {string} src
 * @returns {Buffer} the unpacked binary
 */
function unpackString(src) {
	let buf = Buffer.from(src, 'base64');
	let arr = pako.inflate(new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT));
	return Buffer.from(arr);
}

/**
 * Takes an AMF3 binary and converts it to the corresponding bonk1 world string.
 * @param {Buffer} buf
 * @returns {string} wold
 */
function packString(buf) {
	let arr = pako.deflate(new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT))
	return Buffer.from(arr).toString('base64');
}


//These functions are left private and undocumented becaue they involve an internal structure I don't want exposed.
//The fact of the matter is that the AMF3 encoding used by bonk espects slightly stronger object typing than
//the target format I hope to output and keep standard.

//Therefore, I am opting to implement the structure internally to the bonk1 codec and convert to a standardized form
//that will hopefully be compatible with the bonk2 codec.
function fromAnonymous(mapAnon) {
	let mapStructural = new Map();
	if ('version' in mapAnon) {
		mapStructural.version = mapAnon.version;
	}
	if ('name' in mapAnon) {
		mapStructural.mapname = mapAnon.name;
	}
	if ('author' in mapAnon) {
		mapStructural.author = mapAnon.author;
	}
	if ('physics' in mapAnon) {
		let mphys = mapAnon.physics;
		if ('gravity' in mphys) {
			mapStructural.gravity = mapAnon.physics.gravity;
		}
		if ('ppm' in mphys) {
			mapStructural.ppm = mapAnon.physics.ppm;
		}
		if ('discFriction' in mphys) {
			mapStructural.discFriction = mapAnon.physics.discFriction;
		}
		if ('discRestitution' in mphys) {
			mapStructural.discRestitution = mapAnon.physics.discRestitution;
		}
		if ('discDensity' in mphys) {
			mapStructural.discDensity = mapAnon.physics.discDensty;
		}
		if ('discLinearDamping' in mphys) {
			mapStructural.discLinearDamping = mapAnon.physics.discLinearDamping;
		}
		if ('discRadius' in mphys) {
			mapStructural.discRadius = mapAnon.physics.discRadius;
		}
		if ('discAllForce' in mphys) {
			mapStructural.discAllForce = mapAnon.physics.discAllForce;
		}
		if ('respawn' in mphys) {
			mapStructural.respawn = mapAnon.physics.respawn;
		}
		if ('collision' in mphys) {
			mapStructural.noCollide = !mapAnon.physics.collision;
		}
	}
	if ('platforms' in mapAnon) {
		mapStructural.platformNames = [];
		mapStructural.platformArray = [];
		for (let i = 0; i < mapAnon.platforms.length; i++){
			let platformAnon = mapAnon.platforms[i];
			if ('name' in platformAnon) {
				mapStructural.platformNames.push(platformAnon.name);
			} else {
				mapStructural.platformNames.push("");
			}
			let platformStructural = new Platform();
			mapStructural.platformArray.push(platformStructural);
			if ('version' in platformAnon) {
				platformStructural.version = platformAnon.version;
			}
			if ('position' in platformAnon) {
				platformStructural.x = platformAnon.position.x;
				platformStructural.y = platformAnon.position.y;
			}
			if ('rotation' in platformAnon) {
				platformStructural.angle = platformAnon.rotation;
			}
			if ('shapes' in platformAnon) {
				platformStructural.shapeArray = [];
				for (let j = 0; j < platformAnon.shapes.length; j++) {
					let shapeAnon = platformAnon.shapes[j];
					let shapeStructural = new PlatformShape();
					platformStructural.shapeArray.push(shapeStructural);
					if ('localPosition' in shapeAnon) {
						shapeStructural.localX = shapeAnon.localPosition.x;
						shapeStructural.localY = shapeAnon.localPosition.y;
					}
					if ('localRotation' in shapeAnon) {
						shapeStructural.localAngle = shapeAnon.localRotation;
					}
					if ('width' in shapeAnon) {
						shapeStructural.width = shapeAnon.width;
					}
					if ('height' in shapeAnon) {
						shapeStructural.height = shapeAnon.height;
					}
					if ('type' in shapeAnon) {
						shapeStructural.shapeID = shapeAnon.type;
					}
					if ('death' in shapeAnon) {
						shapeStructural.death = shapeAnon.death;
					}
					if ('noPhysics' in shapeAnon) {
						shapeStructural.noPhysics = shapeAnon.noPhysics;
					}
					if ('color' in shapeAnon) {
						shapeStructural.color = shapeAnon.color;
					}
				}
			}
			if ('material' in platformAnon && 'friction' in platformAnon.material) {
				platformStructural.friction = platformAnon.material.friction;
			}
			if ('material' in platformAnon && 'density' in platformAnon.material) {
				platformStructural.density = platformAnon.material.density;
			}
			if ('physics' in platformAnon) {
				let pphys = platformAnon.physics;
				if ('dynamic' in pphys) {
					platformStructural.isDynamic = platformAnon.physics.dynamic;
				}
				if ('velocity' in pphys) {
					platformStructural.xv = platformAnon.physics.velocity.x;
					platformStructural.yv = platformAnon.physics.velocity.y;
				}
				if ('angularVelocity' in pphys) {
					platformStructural.angularVelocity = platformAnon.physics.angularVelocity;
				}
				if ('linearDamping' in pphys) {
					platformStructural.linearDamping = platformAnon.physics.linearDamping;
				}
				if ('angularDamping' in pphys) {
					platformStructural.angularDamping = platformAnon.physics.angularDamping;
				}
				if ('spring' in pphys) {
					platformStructural.springy = platformAnon.physics.spring.enabled;
					platformStructural.springyUpper = platformAnon.physics.spring.length;
					platformStructural.springyLower = -platformStructural.springyUpper;
					platformStructural.springyAnchorX = platformAnon.physics.spring.anchor.x;
					platformStructural.springyAnchorY = platformAnon.physics.spring.anchor.y;
					platformStructural.springyForce = platformAnon.physics.spring.force;
				}
				if ('path' in pphys) {
					platformStructural.path = platformAnon.physics.path.enabled;
					platformStructural.pathUpper = platformAnon.physics.path.length;
					platformStructural.pathLower = -platformStructural.pathUpper;
					platformStructural.pathAngle = platformAnon.physics.path.angle;
					platformStructural.pathMaxSpeed = platformAnon.physics.path.maxSpeed;
					platformStructural.pathForce = platformAnon.physics.path.force;
					platformStructural.pathAnchorX = platformAnon.physics.path.anchor.x;
					platformStructural.pathAnchorY = platformAnon.physics.path.anchor.y;
				}
				if ('restitution' in pphys) {

					platformStructural.restitution = platformAnon.physics.restitution;
				}
			}
		}
	}
	if ('spawns' in mapAnon) {
		mapStructural.spawnNames = [];
		mapStructural.spawnArray = [];
		for (let i = 0; i < mapAnon.spawns.length; i++){
			let spawnAnon = mapAnon.spawns[i];
			if ('name' in spawnAnon) {
				mapStructural.spawnNames.push(spawnAnon.name);
			} else {
				mapStructural.spawnNames.push("");
			}
			let spawnStructural = new MapSpawn();
			mapStructural.spawnArray.push(spawnStructural);
			if ('position' in spawnAnon) {
				spawnStructural.x = spawnAnon.position.x;
				spawnStructural.y = spawnAnon.position.y;
			}
			if ('playerInitialVelocity' in spawnAnon) {
				spawnStructural.xv = spawnAnon.playerInitialVelocity.x;
				spawnStructural.yv = spawnAnon.playerInitialVelocity.y;
			}
			if ('ffa' in spawnAnon) {
				spawnStructural.ffa = spawnAnon.ffa;
			}
			if ('blue' in spawnAnon) {
				spawnStructural.blue = spawnAnon.blue;
			}
			if ('red' in spawnAnon) {
				spawnStructural.red = spawnAnon.red;
			}
			if ('priority' in spawnAnon) {
				spawnStructural.priority = spawnAnon.priority;
			}
		}
	}
	if ('captureZones' in mapAnon) {
		mapStructural.capZoneNames = [];
		mapStructural.capZoneArray = [];
		for (let i = 0; i < mapAnon.captureZones.length; i++){
			let captureZoneAnon = mapAnon.captureZones[i];
			if ('name' in captureZoneAnon) {
				mapStructural.capZoneNames.push(captureZoneAnon.name);
			} else {
				mapStructural.spawnNames.push("");
			}
			let captureZoneStructural = new CaptureZone();
			mapStructural.capZoneArray.push(captureZoneStructural);
			if ('position' in captureZoneAnon) {
				captureZoneStructural.x = captureZoneAnon.position.x;
				captureZoneStructural.y = captureZoneAnon.position.y;
			}
			if ('radius' in captureZoneAnon) {
				captureZoneStructural.radius = captureZoneAnon.radius;
			}
			if ('captureLimit' in captureZoneAnon) {
				captureZoneStructural.captureLimit = captureZoneAnon.captureLimit;
			}
			if ('captureLimit' in captureZoneAnon) {
				captureZoneStructural.captureLimit = captureZoneAnon.captureLimit;
			}
		}
	}
	return mapStructural;
}

function toAnonymous(mapStructural) {
	return {
		version: mapStructural.version,
		name: mapStructural.mapname,
		author: mapStructural.author,
		physics: {
			gravity:mapStructural.gravity,
			ppm:mapStructural.ppm,
			discFriction:mapStructural.discFriction,
			discRestitution:mapStructural.discRestitution,
			discDensity:mapStructural.discDensity,
			discLinearDamping:mapStructural.discLinearDamping,
			discRadius:mapStructural.discRadius,
			discAllForce:mapStructural.discAllForce,
			respawn:mapStructural.respawn,
			collision:!mapStructural.noCollide,
		},
		platforms: mapStructural.platformArray.map(function(platformStructural, i){
			return {
				version: platformStructural.version,
				name: mapStructural.platformNames[i],
				position : {
					x: platformStructural.x,
					y: platformStructural.y,
				},
				rotation : platformStructural.angle,
				shapes:platformStructural.shapeArray.map(function(shapeStructural){
					return {
						localPosition: {
							x: shapeStructural.localX,
							y: shapeStructural.localY,
						},
						localRotation: shapeStructural.localAngle,
						width: shapeStructural.width,
						height: shapeStructural.height,
						type: shapeStructural.shapeID,
						death: shapeStructural.death,
						noPhysics: shapeStructural.noPhysics,
						color: shapeStructural.color,
					};
				}),
				material:{
					friction:platformStructural.friction,
					density:platformStructural.density,
				},
				physics:{
					dynamic:platformStructural.isDynamic,
					velocity: {
						x:platformStructural.xv,
						y:platformStructural.yv
					},
					angularVelocity:platformStructural.angularVelocity,
					linearDamping:platformStructural.linearDamping,
					angularDamping:platformStructural.angularDamping,
					hinge: {
						enabled:platformStructural.rotates,
						stiffness:platformStructural.stiffness,
						pivot: {
							x:platformStructural.pivotX,
							y:platformStructural.pivotY,
						}
					},
					spring: {
						enabled:platformStructural.springy,
						length:platformStructural.springyUpper,
						anchor: {
							x:platformStructural.springyAnchorX,
							y:platformStructural.springyAnchorY,
						},
						force:platformStructural.springyForce,
					},
					path: {
						enabled:platformStructural.path,
						length:platformStructural.pathUpper,
						anchor: {
							x:platformStructural.pathAnchorX,
							y:platformStructural.pathAnchorY,
						},
						angle:platformStructural.pathAngle,
						maxSpeed:platformStructural.pathMaxSpeed,
						force:platformStructural.pathForce,
					},
					restitution:platformStructural.restitution,
				},
			};
		}),
		spawns: mapStructural.spawnArray.map(function(spawnStructural, i) {
			return {
				name: mapStructural.spawnNames[i],
				position: {
					x: spawnStructural.x,
					y: spawnStructural.y,
				},
				playerInitialVelocity: {
					x: spawnStructural.xv,
					y: spawnStructural.yv,
				},
				ffa:spawnStructural.ffa,
				blue:spawnStructural.blue,
				red:spawnStructural.red,
				priority:spawnStructural.priority,
			};
		}),
		captureZones: mapStructural.capZoneArray.map(function(captureZoneStructural, i) {
			return {
				name: mapStructural.capZoneNames[i],
				position: {
					x: captureZoneStructural.x,
					y: captureZoneStructural.y,
				},
				radius: captureZoneStructural.radius,
				captureLimit: captureZoneStructural.captureLimit,
			};
		}),
	};
}

//node plz support es6 already this is stupid.
module.exports = {
	encode:encode,
	decode:decode,
	decodeBinary:decodeBinary,
	encodeBinary:encodeBinary,
	unpackString:unpackString,
	packString:packString,
};

class Map extends IExternalizable {
	constructor() {
		super();
		this.version = 0;
		this.mapname = "";
		this.author = "";
		this.platformArray = [];
		this.spawnArray = [];
		this.platformNames = [];
		this.spawnNames = [];
		this.capZoneArray = [];
		this.capZoneNames = [];
		this.gravity = 20;
		this.ppm = 12;
		this.discFriction = 0;
		this.discRestitution = 0.8;
		this.discDensity = 1.0;
		this.discLinearDamping = 0.0;
		this.discRadius = 1.0;
		this.discAllForce = 12;
		this.respawn = false;
		this.noCollide = false;
	}
	writeExternal(ba) {
		ba.writeShort(5);
		ba.writeUTF(this.mapname);
		ba.writeUTF(this.author);
		ba.writeDouble(this.gravity);
		ba.writeDouble(this.ppm);
		ba.writeDouble(this.discFriction);
		ba.writeDouble(this.discRestitution);
		ba.writeDouble(this.discDensity);
		ba.writeDouble(this.discLinearDamping);
		ba.writeDouble(this.discRadius);
		ba.writeDouble(this.discAllForce);
		ba.writeShort(this.platformArray.length);
		for (let i = 0; i < this.platformArray.length; i++) {
			ba.writeObject(this.platformArray[i]);
			ba.writeUTF(this.platformNames[i]);
		}
		ba.writeShort(this.spawnArray.length);
		for (let i = 0; i < this.spawnArray.length; i++) {
			ba.writeObject(this.spawnArray[i]);
			ba.writeUTF(this.spawnNames[i]);
		}
		ba.writeObject(this.capZoneArray);
		ba.writeObject(this.capZoneNames);
		ba.writeBoolean(this.noCollide);
		ba.writeBoolean(this.respawn);
	}
	readExternal(ba) {
		this.version = ba.readShort();
		this.mapname = ba.readUTF();
		this.author = ba.readUTF();
		this.gravity = ba.readDouble();
		this.ppm = ba.readDouble();
		this.discFriction = ba.readDouble();
		this.discRestitution = ba.readDouble();
		this.discDensity = ba.readDouble();
		this.discLinearDamping = ba.readDouble();
		this.discRadius = ba.readDouble();
		this.discAllForce = ba.readDouble();
		let nPlatforms = ba.readShort();
		this.platformArray = [];
		this.platformNames = [];

		for (let i = 0; i < nPlatforms; i++) {
			this.platformArray.push(ba.readObject());
			this.platformNames.push(ba.readUTF());
		}

		let nSpawns = ba.readShort();
		this.spawnArray = [];
		this.spawnNames = [];
		for (var i = 0; i < nSpawns; i++) {
			this.spawnArray.push(ba.readObject());
			this.spawnNames.push(ba.readUTF());
		}
		if (this.version >= 2) {
			this.capZoneArray = ba.readObject();
		} else {
			this.capZoneArray = [];
		}
		if (this.version >= 3) {
			this.capZoneNames = ba.readObject();
		} else {
			this.capZoneArray = [];
		}
		if (this.version == 4) {
			let mapType = ba.readBoolean();
			this.noCollide = mapType;
			this.respawn = mapType;
		} else if (this.version > 4) {
			this.noCollide = ba.readBoolean();
			this.respawn = ba.readBoolean();
		}
	}
}

class Platform extends IExternalizable {
	constructor() {
		super();
		this.version = 0;
		this.x = 0;
		this.y = 0;
		this.shapeArray = [];
		this.restitution = 0.8;
		this.friction = 0;
		this.density = 1;
		this.angle = 0;
		this.angularVelocity = 0;
		this.isDynamic = false;
		this.xv = 0;
		this.yv = 0;
		this.linearDamping = 0;
		this.angularDamping = 0;
		this.rotates = false;
		this.rotatePivotX = 0;
		this.rotatePivotY = 0;
		this.stiffness = 0;
		this.springy = false;
		this.springyUpper = 100;
		this.springyLower = -100;
		this.springyAnchorX = 0;
		this.springyAnchorY = 0;

		this.springyForce = 1000000;
		this.path = false;
		this.pathAngle = Math.PI / 2;
		this.pathUpper = 100;
		this.pathLower = -100;
		this.pathAnchorX = 0;

		this.pathAnchorY = 0;
		this.pathMaxSpeed = 50;
		this.pathForce = 1000000;
	}
	writeExternal(ba) {
		ba.writeShort(7);
		ba.writeDouble(this.x);
		ba.writeDouble(this.y);
		ba.writeShort(this.shapeArray.length);
		for (let i = 0; i < this.shapeArray.length; i++) {
			ba.writeDouble(this.shapeArray[i].localX);
			ba.writeDouble(this.shapeArray[i].localY);
			ba.writeDouble(this.shapeArray[i].width);
			ba.writeDouble(this.shapeArray[i].height);
			ba.writeDouble(this.shapeArray[i].localAngle);
			ba.writeShort(this.shapeArray[i].shapeID);
			this.writeInt32(ba, this.shapeArray[i].color);
			ba.writeBoolean(this.shapeArray[i].death);
			ba.writeBoolean(this.shapeArray[i].noPhysics);
		}
		ba.writeDouble(this.restitution);
		ba.writeDouble(this.density);
		ba.writeDouble(this.friction);
		ba.writeDouble(this.angle);
		ba.writeDouble(this.angularVelocity);
		ba.writeBoolean(this.isDynamic);
		if (this.isDynamic) {
			ba.writeDouble(this.xv);
			ba.writeDouble(this.yv);
			ba.writeDouble(this.linearDamping);
			ba.writeDouble(this.angularDamping);
			ba.writeBoolean(this.rotates);
			if (this.rotates){
				ba.writeDouble(this.rotatePivotX);
				ba.writeDouble(this.rotatePivotY);
				ba.writeDouble(this.stiffness);
			}
			ba.writeBoolean(this.springy);
			if (this.springy) {
				ba.writeDouble(this.springyUpper);
				ba.writeDouble(this.springyForce);
				ba.writeDouble(this.springyAnchorX);
				ba.writeDouble(this.springyAnchorY);
			}
			ba.writeBoolean(this.path);
			if (this.path) {
				ba.writeDouble(this.pathAngle);
				ba.writeDouble(this.pathUpper);
				ba.writeDouble(this.pathMaxSpeed);
				ba.writeDouble(this.pathForce);
				ba.writeDouble(this.pathAnchorX);
				ba.writeDouble(this.pathAnchorY);
			}
		}
	}
	readExternal(ba) {
		this.version = ba.readShort();
		if (this.version <= 3) {
			this.x = ba.readDouble();
			this.y = ba.readDouble();
			this.shapeArray = [new PlatformShape()];
			this.shapeArray[0].localX = 0;
			this.shapeArray[0].localY = 0;
			this.shapeArray[0].localAngle = 0;
			this.shapeArray[0].width = ba.readDouble();
			this.shapeArray[0].height = ba.readDouble();
			this.restitution = ba.readDouble();
			this.density = ba.readDouble();
			this.friction = ba.readDouble();
			this.angle = ba.readDouble();
			this.angularVelocity = ba.readDouble();
			this.shapeArray[0].shapeID = ba.readShort();
			this.isDynamic = ba.readBoolean();
			if (this.isDynamic) {
				this.xv = ba.readDouble();
				this.yv = ba.readDouble();
				this.linearDamping = ba.readDouble();
				this.angularDamping = ba.readDouble();
				this.rotates = ba.readBoolean();
				if (this.rotates) {
					this.rotatePivotX = ba.readDouble();
					this.rotatePivotY = ba.readDouble();
					this.stiffness = ba.readDouble();
				}
			}
			if (this.version >= 2) {
				this.shapeArray[0].color = this.readInt32(ba);
			} else {
				if (this.isDynamic) {
					this.shapeArray[0].color = 0x8bc34a;
				} else {
					this.shapeArray[0].color = 0x58b173;
				}
			}
			if (this.version >= 3) {
				ba.readShort();
				this.shapeArray[0].death = ba.readBoolean();
			} else {
				this.shapeArray[0].death = false;
			}
		}
		if (this.version >= 4) {
			this.x = ba.readDouble();
			this.y = ba.readDouble();
			let nshapes = ba.readShort();
			this.shapeArray = [];
			for (var i = 0; i < nshapes; i++) {
				this.shapeArray[i] = new PlatformShape();
				this.shapeArray[i].localX = ba.readDouble();
				this.shapeArray[i].localY = ba.readDouble();
				this.shapeArray[i].width = ba.readDouble();
				this.shapeArray[i].height = ba.readDouble();
				this.shapeArray[i].localAngle = ba.readDouble();
				this.shapeArray[i].shapeID = ba.readShort();
				this.shapeArray[i].color = this.readInt32(ba);
				this.shapeArray[i].death = ba.readBoolean();
				if (this.version >= 7) {
					this.shapeArray[i].noPhysics = ba.readBoolean();
				}
				if (this.version == 4 && this.shapeArray[i].shapeID == 5) {
					this.shapeArray[i].height = Math.round(0.866 * this.shapeArray[i].width);//lol, wtf???
				}
			}
			this.restitution = ba.readDouble();
			this.density = ba.readDouble();
			this.friction = ba.readDouble();
			this.angle = ba.readDouble();
			this.angularVelocity = ba.readDouble();
			this.isDynamic = ba.readBoolean();
			if (this.isDynamic) {
				this.xv = ba.readDouble();
				this.yv = ba.readDouble();
				this.linearDamping = ba.readDouble();
				this.angularDamping = ba.readDouble();
				this.rotates = ba.readBoolean();
				if (this.rotates) {
					this.rotatePivotX = ba.readDouble();
					this.rotatePivotY = ba.readDouble();
					this.stiffness = ba.readDouble();
				}
				if (this.version >= 6) {
					this.springy = ba.readBoolean();
					if (this.springy) {
						this.springyUpper = ba.readDouble();
						this.springyLower = -this.springyUpper;
						this.springyForce = ba.readDouble();
						this.springyAnchorX = ba.readDouble();
						this.springyAnchorY = ba.readDouble();
					}
					this.path = ba.readBoolean();
					if (this.path) {
						this.pathAngle = ba.readDouble();
						this.pathUpper = ba.readDouble();
						this.pathLower = -this.pathUpper;
						this.pathMaxSpeed = ba.readDouble();
						this.pathForce = ba.readDouble();
						this.pathAnchorX = ba.readDouble();
						this.pathAnchorY = ba.readDouble();
					}
				}
			}
		}
	}
	readInt32(ba) {
		let arr = new ArrayBuffer(4); // an Int32 takes 4 bytes
		let view = new DataView(arr);
		for (let i = 0; i < 4; i++) {
			view.setUint8(i, ba.readByte())
		}
		return view.getUint32(0, false);
	}
	writeInt32(ba, val) {
		let arr = new ArrayBuffer(4); // an Int32 takes 4 bytes
		let view = new DataView(arr);
		view.setUint32(0, val, false);
		for (let i = 0; i < 4; i++) {
			ba.writeUnsignedByte(view.getUint8(i));
		}
	}
}

class PlatformShape {
	constructor() {
		this.localX = 0;
		this.localY = 0;
		this.width = 0;
		this.height = 0;
		this.localAngle = 0;
		this.shapeID = 0;
		this.color = 0xff0000;
		this.death = false;
		this.noPhysics = false;
	}
}
class MapSpawn {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.xv = 0;
		this.yv = 0;
		this.ffa = false;
		this.blue = false;
		this.red = false;
		this.priority = 0;
	}
	writeExternal(ba) {
		ba.writeDouble(this.x);
		ba.writeDouble(this.y);
		ba.writeDouble(this.xv);
		ba.writeDouble(this.yv);
		ba.writeBoolean(this.ffa);
		ba.writeBoolean(this.blue);
		ba.writeBoolean(this.red);
		ba.writeShort(this.priority);
	}
	readExternal(ba) {
		this.x = ba.readDouble();
		this.y = ba.readDouble();
		this.xv = ba.readDouble();
		this.yv = ba.readDouble();
		this.ffa = ba.readBoolean();
		this.blue = ba.readBoolean();
		this.red = ba.readBoolean();
		this.priority = ba.readShort();
	}
}

class CaptureZone{
	constructor() {
		this.version = 0;
		this.radius = 0;
		this.x = 0;
		this.y = 0;
		this.captureLimit = 0;
		this.ownerID = 0;
		this.framesToDetonate = 0;
	}
}

ByteArray.registerClassAlias('gmp', Map);
ByteArray.registerClassAlias('ps', Platform);
ByteArray.registerClassAlias('mspn', MapSpawn);
ByteArray.registerClassAlias('czs', CaptureZone);

//Unfortunately, our library of choice contains two bugs we must manually patch.
//I've filed issues with Zaseth about these. In the mean time, the following patches will have to suffice:

const ObjectEncoding = require('bytearray-node/enums/ObjectEncoding')
const AMF0 = require('bytearray-node/src/AMF/AMF0')
const AMF3 = require('bytearray-node/src/AMF/AMF3')


//Basically, the bug is as follows: IExternalizeable classes cannot call readObject because this resets the AMF tables.
//The solution is to make each ByteArray carry its own global AMF3 instance.
ByteArray.prototype.readObject = function() {
	if (this.objectEncoding === ObjectEncoding.AMF0) {
		return new AMF0(this).read()
	} else if (this.objectEncoding === ObjectEncoding.AMF3) {
		if (!this.AMF3inst) {
			this.AMF3inst = new AMF3(this);
		}
		return this.AMF3inst.read();
	} else {
		throw new Error(`Unknown object encoding: '${this.objectEncoding}'.`)
	}
}

//Similarly, we have to modify writeObject:
ByteArray.prototype.writeObject = function(value) {
	if (this.objectEncoding === ObjectEncoding.AMF0) {
		new AMF0(this).write(value)
	} else if (this.objectEncoding === ObjectEncoding.AMF3) {
		if (!this.AMF3inst) {
			this.AMF3inst = new AMF3(this);
		}
		this.AMF3inst.write(value)
	} else {
		throw new Error(`Unknown object encoding: '${this.objectEncoding}'.`)
	}
}

const { murmurHash128 } = require('murmurhash-native')
//Found another bug! This time, objects who use reference traits are never instantiated. Cute.
AMF3.prototype.readObject  = function() {
	if (this.isReference('objectReferences')) {
		return this.reference
	}

	let instance = {}
	let traits;

	this.objectReferences.push(instance);

	if (!this.isReference('traitReferences')) {
		traits = {
			isExternallySerialized: this.popFlag(),
			isDynamicObject: this.popFlag(),
			sealedMemberCount: this.flags,
			className: this.readString(),
			sealedMemberNames: []
		}
		this.traitReferences.push(traits);
		for (let i = 0; i < traits.sealedMemberCount; i++) {
			traits.sealedMemberNames[i] = this.readString()
		}
	}
	else {
		traits = this.reference;
	}

	if (traits.isExternallySerialized && traits.className !== '') {
		instance = new (this.byteArr.aliasMapping[traits.className])()

		if (instance.readExternal.length !== 1) {
			throw new Error(`Expecting only 1 argument for readExternal in registered class: '${traits.className}'`)
		}

		instance.readExternal(this.byteArr)
	}
	else {
		if (traits.isDynamicObject) {
			for (let key = this.readString(); key !== ''; instance[key] = this.read(), key = this.readString()) { }
		}
		else {
			for (let i = 0; i < traits.sealedMemberCount; i++) {
				instance[traits.sealedMemberNames[i]] = this.read()
			}
		}

		if (!traits.isExternallySerialized && !traits.isDynamicObject && traits.className !== '') {
			const classObject = new (this.byteArr.aliasMapping[traits.className])()
			const values = Object.values(instance)


			for (let i = 0; i < traits.sealedMemberCount; i++) {
				classObject[traits.sealedMemberNames[i]] = values[i]
			}

			return classObject
		}
	}



	return instance
};

//This bug must also be fixed for write obect:
AMF3.prototype.writeObject = function(value, isAnonymousObject = false) {
	const idx = this.getReference(value, 'objectReferences')

	if (idx !== false) {
		this.writeUInt29(idx << 1)
	}
	else {
		const traits = this.writeTraits(value, isAnonymousObject)

		if (traits.isExternallySerialized && !isAnonymousObject) {
			if (value.writeExternal.length !== 1) {
				throw new Error(`Expecting only 1 argument for writeExternal in registered class: '${traits.className}'`)
			}
			value.writeExternal(this.byteArr)
		}
		else {
			if (traits.isDynamicObject) {
				for (const key in value) {
					this.writeString(key, false)
					this.write(value[key])
				}
			}
			else {
				for (let i = 0; i < traits.sealedMemberCount; i++) {
					this.write(value[traits.sealedMemberNames[i]])
				}
			}
		}
	}
}

const { isImplementedBy } = require('bytearray-node/enums/IExternalizable')
AMF3.prototype.writeTraits = function (value, isAnonymousObject) {
	const className = value.constructor === Object || isAnonymousObject ? '' : this.byteArr.classMapping.get(value.constructor)
	const isExternallySerialized = isImplementedBy(value)
	const isDynamicObject = className === '' && !isAnonymousObject
	const sealedMemberNames = isDynamicObject || isExternallySerialized ? [] : Object.keys(value)
	const sealedMemberCount = sealedMemberNames.length

	const traits = { isExternallySerialized, isDynamicObject, sealedMemberCount, className, sealedMemberNames }
	const idx = this.getReference(murmurHash128(JSON.stringify(traits)), 'traitReferences')

	if (idx !== false) {
		this.writeUInt29((idx << 2) | 1)
	} else {
		this.writeUInt29(3 | (isExternallySerialized ? 4 : 0) | (isDynamicObject ? 8 : 0) | (sealedMemberCount << 4))
		this.writeString(className, false)

		for (let i = 0; i < traits.sealedMemberCount; i++) {
			this.writeString(traits.sealedMemberNames[i], false);
		}
	}
	return traits;
}

