/*
Herein lies the original de-obfuscated code as found in Bonk2.
I used this heavily as an early test program to diagnose problems
with my own decoder.

I'm including it as a piece of educational material for those
who are interested.
 */


BinaryData = class amftypes {
	static aliases = {};
	static textEnc = new TextEncoder();
	static textDec = new TextDecoder();
	
	static T_UNDEFINED = 0x00;
	static T_NULL = 0x01;
	static T_FALSE = 0x02;
	static T_TRUE = 0x03;
	static T_INT = 0x04;
	static T_DOUBLE = 0x05;
	static T_STRING = 0x06;
	static T_ARRAY = 0x09;
	static T_OBJ = 0x0A;
    static registerClassAlias(K4h, G4h) {
        amftypes["aliases"][K4h] = G4h;
        return K4h;
    }

    constructor() {
        this["index"] = 0;
        this["buffer"] = new ArrayBuffer(1024 * 100);
        this["view"] = new DataView(this["buffer"]);
        this.implicitClassAliasArray = [];
        this.implicitStringArray = [];
        this["bodgeCaptureZoneDataIdentifierArray"] = [];
        
    }
    readByte() {
        var f4h;
        f4h = this["view"]["getUint8"](this["index"]);
        this["index"] += 1;
        return f4h;
    }
    writeByte(l4h) {
        this["view"]["setUint8"](this["index"], l4h);
        this["index"] += 1;
    }
    readInt() {
        var s4h;
        s4h = this["view"]["getInt32"](this["index"]);
        this["index"] += 4;
        return s4h;
    }
    writeInt(P4h) {
        this["view"]["setInt32"](this["index"], P4h);
        this["index"] += 4;
    }
    readShort() {
        var S4h;
        S4h = this["view"]["getInt16"](this["index"]);
        this["index"] += 2;
        return S4h;
    }
    writeShort(T4h) {
        this["view"]["setInt16"](this["index"], T4h);
        this["index"] += 2;
    }
    readUShort() {
        var h4h;
        h4h = this["view"]["getUint16"](this["index"]);
        this["index"] += 2;
        return h4h;
    }
    writeUShort(W4h) {
        this["view"]["setUint16"](this["index"], W4h);
        this["index"] += 2;
    }
    readUint() {
        var N4h;
        N4h = this["view"]["getUint32"](this["index"]);
        this["index"] += 4;
        return N4h;
    }
    writeUint(I4h) {
        this["view"]["setUint32"](this["index"], I4h);
        this["index"] += 4;
    }
    rewind() {
        this["index"] = 0;
    }
    /*
    readInt29() {
        var R4h, C4h, F4h, v4h, B4h, q4h;
        R4h = 1;
        C4h = this.readByte();
        F4h = 0;
        v4h = 0;
        B4h = 0;
        if (C4h & 0b10000000) {
            F4h = this.readByte();
            R4h = 2;
            if (F4h & 0b10000000) {
                v4h = this.readByte();
                R4h = 3;
                if (v4h & 0b10000000) {
                    B4h = this.readByte();
                    R4h = 4;
                }
            }
        }
        q4h = 0;
        if (R4h == 1) {
            q4h += (C4h & 0b00000001) << 0;
            q4h += (C4h & 0b00000010) << 0;
            q4h += (C4h & 0b00000100) << 0;
            q4h += (C4h & 0b00001000) << 0;
            q4h += (C4h & 0b00010000) << 0;
            q4h += (C4h & 0b00100000) << 0;
            q4h += (C4h & 0b01000000) << 0;
        }
        if (R4h == 2) {
            q4h += (C4h & 0b00000001) << 7;
            q4h += (C4h & 0b00000010) << 7;
            q4h += (C4h & 0b00000100) << 7;
            q4h += (C4h & 0b00001000) << 7;
            q4h += (C4h & 0b00010000) << 7;
            q4h += (C4h & 0b00100000) << 7;
            q4h += (C4h & 0b01000000) << 7;
            q4h += (F4h & 0b00000001) << 0;
            q4h += (F4h & 0b00000010) << 0;
            q4h += (F4h & 0b00000100) << 0;
            q4h += (F4h & 0b00001000) << 0;
            q4h += (F4h & 0b00010000) << 0;
            q4h += (F4h & 0b00100000) << 0;
            q4h += (F4h & 0b01000000) << 0;
        }
        if (R4h == 3) {
            q4h += (C4h & 0b00000001) << 14;
            q4h += (C4h & 0b00000010) << 14;
            q4h += (C4h & 0b00000100) << 14;
            q4h += (C4h & 0b00001000) << 14;
            q4h += (C4h & 0b00010000) << 14;
            q4h += (C4h & 0b00100000) << 14;
            q4h += (C4h & 0b01000000) << 14;
            q4h += (F4h & 0b00000001) << 7;
            q4h += (F4h & 0b00000010) << 7;
            q4h += (F4h & 0b00000100) << 7;
            q4h += (F4h & 0b00001000) << 7;
            q4h += (F4h & 0b00010000) << 7;
            q4h += (F4h & 0b00100000) << 7;
            q4h += (F4h & 0b01000000) << 7;
            q4h += (v4h & 0b00000001) << 0;
            q4h += (v4h & 0b00000010) << 0;
            q4h += (v4h & 0b00000100) << 0;
            q4h += (v4h & 0b00001000) << 0;
            q4h += (v4h & 0b00010000) << 0;
            q4h += (v4h & 0b00100000) << 0;
            q4h += (v4h & 0b01000000) << 0;
        }
        if (R4h == 4) {
            q4h += (C4h & 0b00000001) << 22;
            q4h += (C4h & 0b00000010) << 22;
            q4h += (C4h & 0b00000100) << 22;
            q4h += (C4h & 0b00001000) << 22;
            q4h += (C4h & 0b00010000) << 22;
            q4h += (C4h & 0b00100000) << 22;
            q4h -= (C4h & 0b01000000) << 22;
            q4h += (F4h & 0b00000001) << 15;
            q4h += (F4h & 0b00000010) << 15;
            q4h += (F4h & 0b00000100) << 15;
            q4h += (F4h & 0b00001000) << 15;
            q4h += (F4h & 0b00010000) << 15;
            q4h += (F4h & 0b00100000) << 15;
            q4h += (F4h & 0b01000000) << 15;
            q4h += (v4h & 0b00000001) << 8;
            q4h += (v4h & 0b00000010) << 8;
            q4h += (v4h & 0b00000100) << 8;
            q4h += (v4h & 0b00001000) << 8;
            q4h += (v4h & 0b00010000) << 8;
            q4h += (v4h & 0b00100000) << 8;
            q4h += (v4h & 0b01000000) << 8;
            q4h += (B4h & 0b00000001) << 0;
            q4h += (B4h & 0b00000010) << 0;
            q4h += (B4h & 0b00000100) << 0;
            q4h += (B4h & 0b00001000) << 0;
            q4h += (B4h & 0b00010000) << 0;
            q4h += (B4h & 0b00100000) << 0;
            q4h += (B4h & 0b01000000) << 0;
            q4h += (B4h & 0b10000000) << 0;
        }
        return q4h;
    }
    */


    readInt29(){
        let total = this.readByte();
        if (total < 128) {
            return total;
        }
        let secondByte = this.readByte();
        if (secondByte < 128) {
            total = (total & 0x7f) << 7;
        }
        else {
            total = (total | secondByte & 0x7f) << 7;
            let thirdByte = this.readByte();
            if (thirdByte < 128) {
                total = total | thirdByte;
            }
            else {
                total = (total | thirdByte & 0x7f) << 8;
                let fourthByte = this.readByte();
                total = total | fourthByte;
            }
        }
        return -(total & (1 << 28)) | total;
    }


    readBoolean() {
        var g4h;
        g4h = this.readByte();
        return g4h == 1;
    }
    writeBoolean(Z4h) {
        if (Z4h) {
            this["writeByte"](1);
        } else {
            this["writeByte"](0);
        }
    }
    readDouble() {
        var X4h;
        X4h = this["view"]["getFloat64"](this["index"]);
        this["index"] += 8;
        return X4h;
    }
    writeDouble(u4h) {
        this["view"]["setFloat64"](this["index"], u4h);
        this["index"] += 8;
    }
    readFloat() {
        var d4h;
        d4h = this["view"]["getFloat32"](this["index"]);
        this["index"] += 4;
        return d4h;
    }
    writeFloat(k4h) {
        this["view"]["setFloat32"](this["index"], k4h);
        this["index"] += 4;
    }
    readUTF() {
        let len = this.readUShort();
        let Q4h = new Uint8Array(len);
        for (var m4h = 0; m4h < len; m4h++) {
            Q4h[m4h] = this.readByte();
        }
        return amftypes["textDec"]["decode"](Q4h);
    }
    readShortString() {
        let len = this.readByte();
        let arr = new Uint8Array(len);
        for (var m4h = 0; m4h < len; m4h++) {
            arr[m4h] = this.readByte();
        }
        return amftypes["textDec"]["decode"](arr);
    }

    /*
    readUTF() {
        var Y4h, L4h, w4h, i4h, Q4h;
        Y4h = this;
        L4h = this.readByte();
        w4h = this.readByte();
        i4h = L4h * 256 + w4h;
        Q4h = new Uint8Array(i4h);
        for (var m4h = 0; m4h < i4h; m4h++) {
            Q4h[m4h] = Y4h.readByte();
        }
        return amftypes["textDec"]["decode"](Q4h);
    }
    */

    readObject() {
        var o4h, J4h, alias;
        ;
        alias = this.readByte();
        if (alias == amftypes["T_NULL"]) {
            return null;
        }
        if (alias == amftypes["T_UNDEFINED"]) {
            return undefined;
        }
        if (alias == amftypes["T_OBJ"]) {
            var objType, obDataLen, obLen, z4h, y4h, j8h, n8h, V8h, t8h;
            objType = this.readByte();
            if (objType == 0x07) {
                obDataLen = this.readByte();
                obLen = (obDataLen - 1) / 2;
                z4h = new Uint8Array(obLen);
                for (var i = 0; i < obLen; i++) {
                    z4h[i] = this.readByte();
                }
                y4h = amftypes["textDec"]["decode"](z4h);
                if (!amftypes["aliases"][y4h]) {
                    throw new Error("trying to decode object with alias we don't recognise");
                }
                this.implicitClassAliasArray.push(y4h);
                j8h = new (amftypes[("aliases")][y4h])();
                j8h["readExternal"](this);
                return j8h;
            } else {
                n8h = (objType - 1) / 4;
                V8h = this.implicitClassAliasArray[n8h];
                if (!amftypes["aliases"][V8h]) {
                    throw new Error("trying to decode object with alias we don't recognise");
                }
                t8h = new (amftypes[("aliases")][V8h])();
                t8h["readExternal"](this);
                return t8h;
            }
        } else if (alias == amftypes["T_ARRAY"]) {
            let l8h, K8h, encodedArray, Z8h, p8h, E8h, U8h, B8h, W8h, I8h, s8h, g8h, R8h, T8h, h8h, N8h, v8h, q8h, D8h, F8h, a8h, x8h, S8h, P8h;
            l8h = 0;
            K8h = 0;
            encodedArray = [];
            do {
                K8h = (this.readByte() - 1) / 2;
                l8h += K8h;
            } while (K8h == 64);
            this.readByte();
            for (let i = 0; i < l8h; i++) {
                p8h = this.readByte();
                if (p8h === amftypes["T_UNDEFINED"]) {
                    encodedArray.push(undefined);
                }
                if (p8h === amftypes["T_NULL"]) {
                    encodedArray.push(null);
                }
                if (p8h === amftypes["T_TRUE"]) {
                    encodedArray.push(true);
                }
                if (p8h === amftypes["T_FALSE"]) {
                    encodedArray.push(false);
                }
                if (p8h === amftypes["T_OBJ"]) {
                    E8h = this.readByte();
                    U8h = "";
                    if (E8h == 7) {
                        B8h = this.readByte();
                        W8h = (B8h - 1) / 2;
                        I8h = new Uint8Array(W8h);
                        for (var r8h = 0; r8h < W8h; r8h++) {
                            I8h[r8h] = this.readByte();
                        }
                        U8h = amftypes["textDec"]["decode"](I8h);
                        this.implicitClassAliasArray.push(U8h);
                        if (!amftypes["aliases"][U8h]) {
                            throw new Error("trying to decode object with alias we don't recognise");
                        }
                        s8h = new (amftypes[("aliases")][U8h])();
                        s8h["readExternal"](this);
                        encodedArray.push(s8h);
                    } else if (E8h > 128) {
                        g8h = this.readByte();
                        R8h = this.readByte();
                        T8h = (R8h - 1) / 2;
                        h8h = new Uint8Array(T8h);
                        for (var G8h = 0; G8h < T8h; G8h++) {
                            h8h[G8h] = this.readByte();
                        }
                        U8h = amftypes["textDec"]["decode"](h8h);
                        console.log(U8h);
                        this.implicitClassAliasArray.push(U8h);
                        if (!amftypes["aliases"][U8h]) {
                            throw new Error("trying to decode object with alias we don't recognise");
                        }
                        N8h = new (amftypes[("aliases")][U8h])();
                        N8h["readAnonymous"](this);
                        encodedArray.push(N8h);
                    } else {
                        v8h = (E8h - 1) / 4;
                        U8h = this.implicitClassAliasArray[v8h];
                        if (!amftypes["aliases"][U8h]) {
                            throw new Error("trying to decode object with alias we don't recognise");
                        }
                        q8h = new (amftypes[("aliases")][U8h])();
                        q8h["readExternal"](this);
                        encodedArray.push(q8h);
                    }
                }
                if (p8h === amftypes["T_ARRAY"]) {}
                if (p8h === amftypes["T_STRING"]) {
                    D8h = this.readByte();
                    if (D8h % 2 == 0) {
                        F8h = D8h / 2;
                        encodedArray.push(this.implicitStringArray[F8h]);
                    } else {
                        a8h = 0;
                        x8h = (D8h - 1) / 2;
                        a8h += x8h;
                        while (x8h == 64) {
                            var h7l = (17 - 7) * 5 / 50;
                            var G7l = 34 / 17;
                            x8h = (this.readByte() - h7l) / G7l;
                            a8h += x8h;
                        }
                        S8h = new Uint8Array(a8h);
                        for (var f8h = 0; f8h < a8h; f8h++) {
                            S8h[f8h] = this.readByte();
                        }
                        P8h = amftypes["textDec"]["decode"](S8h);
                        encodedArray.push(P8h);
                        this.implicitStringArray.push(P8h);
                    }
                }
            }
            return encodedArray;
        } else {
            throw new Error("Trying to readObject on something that's not an object or array");
        }
    }
    toBase64() {
        var u8h, d8h, k8h;
        u8h = "";
        d8h = new Uint8Array(this["buffer"]);
        k8h = this["index"];
        for (var X8h = 0; X8h < k8h; X8h++) {
            u8h += String["fromCharCode"](d8h[X8h]);
        }
        return require('btoa')(u8h);
    }
    fromBase64(A8h, O8h) {
        var L8h, Q8h, Y8h, m8h, w8h;
        L8h = require('pako');
        Q8h = require('atob')(A8h);
        Y8h = Q8h["length"];
        m8h = new Uint8Array(Y8h);
        for (var i8h = 0; i8h < Y8h; i8h++) {
            m8h[i8h] = Q8h["charCodeAt"](i8h);
        }
        if (O8h === true) {
            w8h = L8h["inflate"](m8h);
            m8h = w8h;
        }
        let buffer = m8h["buffer"]["slice"](m8h["byteOffset"], m8h["byteLength"] + m8h["byteOffset"]);
        this["view"] = new DataView(buffer);
        this["index"] = 0;
    }
}
;
MapGish = class l6h {
    constructor() {
        this["version"] = 0;
        this["mapname"] = "";
        this["author"] = "";
        this["platformArray"] = [];
        this["spawnArray"] = [];
        this["platformNames"] = [];
        this["spawnNames"] = [];
        this["capZoneArray"] = [];
        this["capZoneNames"] = [];
        this["gravity"] = 20;
        this["ppm"] = 12;
        this["discFriction"] = 0;
        this["discRestitution"] = 0.8;
        this["discDensity"] = 1.0;
        this["discLinearDamping"] = 0.0;
        this["discRadius"] = 1.0;
        this["discAllForce"] = 12;
        this["respawn"] = false;
        this["noCollide"] = false;
    }
    writeExternal(s6h) {}
    readExternal(P6h) {
        var S6h, N6h, I6h, W6h, u85, x85, S85, G55, f55, I55;
        S6h = this;
        this["version"] = P6h["readShort"]();
        this["mapname"] = P6h["readUTF"]();
        if (this["mapname"]["length"] > 25) {
            this["mapname"] = this["mapname"]["slice"](0, 25);
        }
        this["author"] = P6h["readUTF"]();
        if (this["author"]["length"] > 25) {
            this["author"] = this["author"]["slice"](0, 35);
        }
        this["gravity"] = P6h["readDouble"]();
        this["ppm"] = P6h["readDouble"]();
        this["ppm"] = Math["max"](5, this["ppm"]);
        this["ppm"] = Math["min"](30, this["ppm"]);
        this["discFriction"] = P6h["readDouble"]();
        this["discRestitution"] = P6h["readDouble"]();
        this["discDensity"] = P6h["readDouble"]();
        this["discLinearDamping"] = P6h["readDouble"]();
        this["discRadius"] = P6h["readDouble"]();
        this["discAllForce"] = P6h["readDouble"]();
        N6h = P6h["readShort"]();
        this["platformArray"] = [];
        this["platformNames"] = [];
        for (var T6h = 0; T6h < N6h; T6h++) {
            console.log("PLATFORM LOC: " + P6h.index);
            S6h["platformArray"].push(P6h["readObject"]());
            console.log("PLATFORM NAME LOC: " + P6h.index);
            S6h["platformNames"].push(P6h["readUTF"]());
        }
        I6h = P6h["readShort"]();
        this["spawnArray"] = [];
        this["spawnNames"] = [];
        for (var h6h = 0; h6h < I6h; h6h++) {
            S6h["spawnArray"].push(P6h["readObject"]());
            S6h["spawnNames"].push(P6h["readUTF"]());
        }
        if (this["version"] >= 2) {
            this["capZoneArray"] = P6h["readObject"]();
        } else {
            u85 = 688308889;
            x85 = -1545311436;
            S85 = 2;
            this["capZoneArray"] = [];
        }
        if (this["version"] >= 3) {
            this["capZoneNames"] = P6h["readObject"]();
        } else {
            this["capZoneNames"] = [];
        }
        if (this["version"] == 4) {
            W6h = P6h["readBoolean"]();
            this["noCollide"] = W6h;
            this["respawn"] = W6h;
        } else if (this["version"] > 4) {
            this["noCollide"] = P6h["readBoolean"]();
            G55 = 1933443021;
            f55 = -777692526;
            I55 = 2;
            this["respawn"] = P6h["readBoolean"]();
        }
    }
}

MapGish["classAlias"] = BinaryData["registerClassAlias"]("gmp", MapGish);
let PlatformState = class q6h {
    constructor() {
        var E75, y75, v75;
        this["version"] = 0;
        this["x"] = 0;
        this["y"] = 0;
        this["shapeArray"] = [];
        this["restitution"] = 0.8;
        this["friction"] = 0;
        this["density"] = 1;
        this["angle"] = 0;
        this["angularVelocity"] = 0;
        this["isDynamic"] = false;
        this["xv"] = 0;
        this["yv"] = 0;
        this["linearDamping"] = 0;
        this["angularDamping"] = 0;
        this["rotates"] = false;
        this["rotatePivotX"] = 0;
        this["rotatePivotY"] = 0;
        this["stiffness"] = 0;
        this["springy"] = false;
        this["springyUpper"] = 100;
        this["springyLower"] = -100;
        this["springyAnchorX"] = 0;
        
		this["springyAnchorY"] = 0;
		this["springyForce"] = 1000000;
		this["path"] = false;
		var C7l = 3 * (10 - 13 + 15) - 34;
		this["pathAngle"] = Math["PI"] / C7l;
		this["pathUpper"] = 100;
		this["pathLower"] = -100;
		this["pathAnchorX"] = 0;
        
        this["pathAnchorY"] = 0;
        this["pathMaxSpeed"] = 50;
        this["pathForce"] = 1000000;
    }
    writeExternal(C6h) {}
    readExternal(F6h) {
        console.log("\t _PLATFORM LOC: " + F6h.index);
        var v6h, g6h, R6h, z25, J25, B25;
        v6h = this;
        this["version"] = F6h["readShort"]();
        if (this["version"] <= 3) {
            this["x"] = F6h["readDouble"]();
            this["y"] = F6h["readDouble"]();
            this["shapeArray"] = [new PlatformStateShape()];
            this["shapeArray"][0]["localX"] = 0;
            this["shapeArray"][0]["localY"] = 0;
            this["shapeArray"][0]["localAngle"] = 0;
            this["shapeArray"][0]["width"] = F6h["readDouble"]();
            this["shapeArray"][0]["height"] = F6h["readDouble"]();
            this["restitution"] = F6h["readDouble"]();
            this["density"] = F6h["readDouble"]();
            this["friction"] = F6h["readDouble"]();
            this["angle"] = F6h["readDouble"]();
            this["angularVelocity"] = F6h["readDouble"]();
            this["shapeArray"][0]["shapeID"] = F6h["readShort"]();
            this["isDynamic"] = F6h["readBoolean"]();
            if (this["isDynamic"]) {
                this["xv"] = F6h["readDouble"]();
                this["yv"] = F6h["readDouble"]();
                this["linearDamping"] = F6h["readDouble"]();
                this["angularDamping"] = F6h["readDouble"]();
                this["rotates"] = F6h["readBoolean"]();
                if (this["rotates"]) {
                    this["rotatePivotX"] = F6h["readDouble"]();
                    this["rotatePivotY"] = F6h["readDouble"]();
                    this["stiffness"] = F6h["readDouble"]();
                }
            }
            if (this["version"] >= 2) {
                this["shapeArray"][0]["color"] = F6h["readUint"]();
            } else {
                if (this["isDynamic"]) {
                    this["shapeArray"][0]["color"] = 0x8bc34a;
                } else {
                    this["shapeArray"][0]["color"] = 0x58b173;
                }
            }
            if (this["version"] >= 3) {
                g6h = F6h["readShort"]();
                this["shapeArray"][0]["death"] = F6h["readBoolean"]();
                ;
            } else {
                this["shapeArray"][0]["death"] = false;
            }
        }
        if (this["version"] >= 4) {
            this["x"] = F6h["readDouble"]();
            this["y"] = F6h["readDouble"]();
            R6h = F6h["readShort"]();
            this["shapeArray"] = [];
            for (var B6h = 0; B6h < R6h; B6h++) {
                v6h["shapeArray"][B6h] = new PlatformStateShape();
                v6h["shapeArray"][B6h]["localX"] = F6h["readDouble"]();
                v6h["shapeArray"][B6h]["localY"] = F6h["readDouble"]();
                v6h["shapeArray"][B6h]["width"] = F6h["readDouble"]();
                v6h["shapeArray"][B6h]["height"] = F6h["readDouble"]();
                v6h["shapeArray"][B6h]["localAngle"] = F6h["readDouble"]();
                v6h["shapeArray"][B6h]["shapeID"] = F6h["readShort"]();
                v6h["shapeArray"][B6h]["color"] = F6h["readUint"]();
                //console.log(v6h["shapeArray"][B6h]["color"]);
                v6h["shapeArray"][B6h]["death"] = F6h["readBoolean"]();
                if (v6h["version"] >= 7) {
                    v6h["shapeArray"][B6h]["noPhysics"] = F6h["readBoolean"]();
                }
                if (v6h["version"] == 4 && v6h["shapeArray"][B6h]["shapeID"] == 5) {
                    v6h["shapeArray"][B6h]["height"] = Math["round"](0.866 * v6h["shapeArray"][B6h]["width"]);
                }
            }
            this["restitution"] = F6h["readDouble"]();
            this["density"] = F6h["readDouble"]();
            this["friction"] = F6h["readDouble"]();
            this["angle"] = F6h["readDouble"]();
            this["angularVelocity"] = F6h["readDouble"]();
            this["isDynamic"] = F6h["readBoolean"]();
            if (this["isDynamic"]) {
                this["xv"] = F6h["readDouble"]();
                this["yv"] = F6h["readDouble"]();
                this["linearDamping"] = F6h["readDouble"]();
                this["angularDamping"] = F6h["readDouble"]();
                this["rotates"] = F6h["readBoolean"]();
                if (this["rotates"]) {
                    this["rotatePivotX"] = F6h["readDouble"]();
                    this["rotatePivotY"] = F6h["readDouble"]();
                    this["stiffness"] = F6h["readDouble"]();
                }
                if (this["version"] >= 6) {
                    this["springy"] = F6h["readBoolean"]();
                    if (this["springy"]) {
                        this["springyUpper"] = F6h["readDouble"]();
                        this["springyLower"] = -this["springyUpper"];
                        this["springyForce"] = F6h["readDouble"]();
                        this["springyAnchorX"] = F6h["readDouble"]();
                        this["springyAnchorY"] = F6h["readDouble"]();
                    }
                    this["path"] = F6h["readBoolean"]();
                    if (this["path"]) {
                        this["pathAngle"] = F6h["readDouble"]();
                        this["pathUpper"] = F6h["readDouble"]();
                        this["pathLower"] = -this["pathUpper"];
                        this["pathMaxSpeed"] = F6h["readDouble"]();
                        this["pathForce"] = F6h["readDouble"]();
                        z25 = 998459784;
                        J25 = 300435808;
                        B25 = 2;

                        this["pathAnchorX"] = F6h["readDouble"]();
                        this["pathAnchorY"] = F6h["readDouble"]();
                    }
                }
            }
        }
    }
}
;
PlatformState["classAlias"] = BinaryData["registerClassAlias"]("ps", PlatformState);
let PlatformStateShape = class Z6h {
    constructor() {
        this["localX"] = 0;
        this["localY"] = 0;
        this["width"] = 0;
        this["height"] = 0;
        this["localAngle"] = 0;
        this["shapeID"] = 0;
        this["color"] = 0xff0000;
        this["death"] = false;
        this["noPhysics"] = false;
    }
}
;
let MapSpawn = class X6h {
    constructor() {
        this["x"] = 0;
        this["y"] = 0;
        this["xv"] = 0;
        this["yv"] = 0;
        this["ffa"] = false;
        this["blue"] = false;
        this["red"] = false;
        this["priority"] = 0;
    }
    writeExternal(u6h) {}
    readExternal(d6h) {
        this["x"] = d6h["readDouble"]();
        this["y"] = d6h["readDouble"]();
        this["xv"] = d6h["readDouble"]();
        this["yv"] = d6h["readDouble"]();
        this["ffa"] = d6h["readBoolean"]();
        this["blue"] = d6h["readBoolean"]();
        this["red"] = d6h["readBoolean"]();
        this["priority"] = d6h["readShort"]();
    }
}
;
MapSpawn["classAlias"] = BinaryData["registerClassAlias"]("mspn", MapSpawn);
let CaptureZoneState = class k6h {
    constructor() {
        this["version"] = 0;
        this["radius"] = 0;
        this["x"] = 0;
        this["y"] = 0;
        this["captureLimit"] = 0;
        this["ownerID"] = 0;
        this["framesToDetonate"] = 0;
    }
    writeExternal(m6h) {}
    readExternal(i6h) {
        var Y6h, L6h;
        for (var Q6h = 0; Q6h < 8; Q6h++) {
            L6h = i6h.readByte();
            console.log(i6h["bodgeCaptureZoneDataIdentifierArray"][Q6h]);
            if (L6h == BinaryData["T_INT"]) {
                this[i6h["bodgeCaptureZoneDataIdentifierArray"][Q6h]] = i6h["readInt29"]();
            } else if (L6h == BinaryData["T_DOUBLE"]) {
                this[i6h["bodgeCaptureZoneDataIdentifierArray"][Q6h]] = i6h["readDouble"]();
            }
        }
    }
    readAnonymous(w6h) {
        var H6h, o6h, J6h, y6h;
        w6h["bodgeCaptureZoneDataIdentifierArray"] = [];
        for (var O6h = 0; O6h < 8; O6h++) {
            H6h = w6h.readByte();
            o6h = (H6h - 1) / 2;
            J6h = new Uint8Array(o6h);
            for (var A6h = 0; A6h < o6h; A6h++) {
                J6h[A6h] = w6h.readByte();
            }
            y6h = BinaryData["textDec"]["decode"](J6h);
            w6h["bodgeCaptureZoneDataIdentifierArray"].push(y6h);
        }
        this["readExternal"](w6h);
    }
}
;
CaptureZoneState["classAlias"] = BinaryData["registerClassAlias"]("czs", CaptureZoneState);


bd = new BinaryData();
bd.fromBase64('eJztm19oHEUcx2d7/5prtD5EaIvgFX04hSbmYiFtoDunh5K2NDENJlVMc0322sW722P30uRixSsEikXwub75IvTBgj4oPt30xScLBaGPUn0RQaT+QdDSxLud32x2d264PbO5pt39BTJ7e9+b/c3398ns7mwumUicL1VQDPVPX1BS+XM1w0g9N4z6V2aHz2aL+fLZ4dkV/DIyAw8gR8i/FcyQ78HrtdUfX78x8B57jdMgPJBMxCoGSiB3cHvwx6O0fd71hoQymQySiOrSq/P00HDIxlcz+47/nLuCdpkfsvTkHOlKjz3qcYd8ZIFe1L9IL8rfrZd/udaKT+TvR8yQ7yJBRF/TykoytlkCXIMNaw+BPXg3tHxRkMNknTj1uwX6M6C/fNtb/0t0FOQS8aTHkAepYG96jerI+/Oe9K69CI8L9bNfGM0ieSwK13EbifznR4ezV9/+2/03mR1cqztyYtWMt+qcyrQqzcaJL6Xoe2Gld3ClG6zSx5zHZJXmqkkrPWJWGnzHy4RuJLmRsImIH8nQ0BCfoNWjV6dmiEg/NjbWpn+Wj5ukXYL+XXr57s2p0UOG4ll/r0v9PwfvT+cO7fOqx6i7/nH098++Hb0tC/Ud/PQ+8c+dvqAoxWLKh0gvaJXaC86mhR9RME2WTUIhfiF+EMr24mejEMPJBF+s00OHFAaUwsYduEq2otgTCu1TYghjJ31AYJQ5GI1ewmhj0hrJKqYb3TDZnpmQyUeSST7GfWPSnP3Y/dn/uSAMSWunf2xIm/R79jOv/dhwQuBE+sACN7NNp1uTu3lMs4QWRblxCBbTURyl02m3elNnrfje//WHdz59+jrzCb/YnZ50qW+w/R19XZws5qsFTS/54awoTJOZhbAoHiSTT/hosnlmZtPaHBwgQF72DFjClnDfqNONAJn8bi9Mts/AsERPcpBAgLzWe+i1fW0DTslkitCNAFle673ldtjZ8zVog+R8/aE5b0efPVCEWSdIBbjysAtgr0OhTkf3Jm2DVIfj/tXBnFNOQYIM6X7yFOx5BlpmZftbYS5BDKdiPAhthD7ZRjGkqiqSiOu/CPArruNI1eS/a59fZXph/2AxRk9eW7pzJNtRD/nLD6Ymfpr48I+OesjHuhXupH8JWnZr6x4v02dd443DCrGo/yPO1goRyqCzUFv/+mbhwfpRC+Vh0A24xinQE9ATj3oRyrgPfLQiZ6Gc2RrEhN2HQ2qonzNlDNoQ4hBiD3rvEJ/wA2L7uc3N8h7Om5DNXrIp1O80NvmY8pHNENEQ0S0javloxRn/EQ1JDUndMqkNjtT5bSPVvsSzCGmz69TwduzRApyLnQp4m0y3CrhjiWwCeuWXZgadbWOzoI4ZgrACioFfX99oox8R6umXitj6NSuk+FsBZv/eHzXv2TTwMJKSib6SUSlbz4jn2n9IkqTmyGOnK/nlcl9ESl6OJBZWjb0XFd1QtfITen5RXTIiK5Ha/oV8pbqkKyfVklrdqy2XFX08d7Cg50uKMa3llKpWzleVZ0E1qWvndcUwYh9sbGy0Mo7Jf33XilvR5o5469eXMfkbOjRLFG3+NJOI73+V9pJ6SysrEvoPly1l7g==', true);
obj = bd.readObject();
console.log(obj);









