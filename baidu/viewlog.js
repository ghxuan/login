var PassMachine = "undefined" == typeof window.PassMachine ? {} : window.PassMachine;
(function () {
    var e = null, t = null, n = void 0;
    !function (t, i) {
        "object" == typeof n ? module.exports = n = i() : "function" == typeof e && e.amd ? e([], i) : t.CryptoJS = i()
    }(this, function () {
        var e = e || function (e, t) {
            var n = Object.create || function () {
                function e() {
                }

                return function (t) {
                    var n;
                    return e.prototype = t, n = new e, e.prototype = null, n
                }
            }(), i = {}, o = i.lib = {}, s = o.Base = function () {
                return {
                    extend: function (e) {
                        var t = n(this);
                        return e && t.mixIn(e), t.hasOwnProperty("init") && this.init !== t.init || (t.init = function () {
                            t.$super.init.apply(this, arguments)
                        }), t.init.prototype = t, t.$super = this, t
                    }, create: function () {
                        var e = this.extend();
                        return e.init.apply(e, arguments), e
                    }, init: function () {
                    }, mixIn: function (e) {
                        for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
                        e.hasOwnProperty("toString") && (this.toString = e.toString)
                    }, clone: function () {
                        return this.init.prototype.extend(this)
                    }
                }
            }(), r = o.WordArray = s.extend({
                init: function (e, n) {
                    e = this.words = e || [], this.sigBytes = n != t ? n : 4 * e.length
                }, toString: function (e) {
                    return (e || a).stringify(this)
                }, concat: function (e) {
                    var t = this.words, n = e.words, i = this.sigBytes, o = e.sigBytes;
                    if (this.clamp(), i % 4) for (var s = 0; o > s; s++) {
                        var r = n[s >>> 2] >>> 24 - s % 4 * 8 & 255;
                        t[i + s >>> 2] |= r << 24 - (i + s) % 4 * 8
                    } else for (var s = 0; o > s; s += 4) t[i + s >>> 2] = n[s >>> 2];
                    return this.sigBytes += o, this
                }, clamp: function () {
                    var t = this.words, n = this.sigBytes;
                    t[n >>> 2] &= 4294967295 << 32 - n % 4 * 8, t.length = e.ceil(n / 4)
                }, clone: function () {
                    var e = s.clone.call(this);
                    return e.words = this.words.slice(0), e
                }, random: function (t) {
                    for (var n, i = [], o = function (t) {
                        var t = t, n = 987654321, i = 4294967295;
                        return function () {
                            n = 36969 * (65535 & n) + (n >> 16) & i, t = 18e3 * (65535 & t) + (t >> 16) & i;
                            var o = (n << 16) + t & i;
                            return o /= 4294967296, o += .5, o * (e.random() > .5 ? 1 : -1)
                        }
                    }, s = 0; t > s; s += 4) {
                        var c = o(4294967296 * (n || e.random()));
                        n = 987654071 * c(), i.push(4294967296 * c() | 0)
                    }
                    return new r.init(i, t)
                }
            }), c = i.enc = {}, a = c.Hex = {
                stringify: function (e) {
                    for (var t = e.words, n = e.sigBytes, i = [], o = 0; n > o; o++) {
                        var s = t[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                        i.push((s >>> 4).toString(16)), i.push((15 & s).toString(16))
                    }
                    return i.join("")
                }, parse: function (e) {
                    for (var t = e.length, n = [], i = 0; t > i; i += 2) n[i >>> 3] |= parseInt(e.substr(i, 2), 16) << 24 - i % 8 * 4;
                    return new r.init(n, t / 2)
                }
            }, d = c.Latin1 = {
                stringify: function (e) {
                    for (var t = e.words, n = e.sigBytes, i = [], o = 0; n > o; o++) {
                        var s = t[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                        i.push(String.fromCharCode(s))
                    }
                    return i.join("")
                }, parse: function (e) {
                    for (var t = e.length, n = [], i = 0; t > i; i++) n[i >>> 2] |= (255 & e.charCodeAt(i)) << 24 - i % 4 * 8;
                    return new r.init(n, t)
                }
            }, l = c.Utf8 = {
                stringify: function (e) {
                    try {
                        return decodeURIComponent(escape(d.stringify(e)))
                    } catch (e) {
                        throw new Error("Malformed UTF-8 data")
                    }
                }, parse: function (e) {
                    return d.parse(unescape(encodeURIComponent(e)))
                }
            }, u = o.BufferedBlockAlgorithm = s.extend({
                reset: function () {
                    this._data = new r.init, this._nDataBytes = 0
                }, _append: function (e) {
                    "string" == typeof e && (e = l.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes
                }, _process: function (t) {
                    var n = this._data, i = n.words, o = n.sigBytes, s = this.blockSize, c = 4 * s, a = o / c;
                    a = t ? e.ceil(a) : e.max((0 | a) - this._minBufferSize, 0);
                    var d = a * s, l = e.min(4 * d, o);
                    if (d) {
                        for (var u = 0; d > u; u += s) this._doProcessBlock(i, u);
                        var f = i.splice(0, d);
                        n.sigBytes -= l
                    }
                    return new r.init(f, l)
                }, clone: function () {
                    var e = s.clone.call(this);
                    return e._data = this._data.clone(), e
                }, _minBufferSize: 0
            }), f = (o.Hasher = u.extend({
                cfg: s.extend(), init: function (e) {
                    this.cfg = this.cfg.extend(e), this.reset()
                }, reset: function () {
                    u.reset.call(this), this._doReset()
                }, update: function (e) {
                    return this._append(e), this._process(), this
                }, finalize: function (e) {
                    e && this._append(e);
                    var t = this._doFinalize();
                    return t
                }, blockSize: 16, _createHelper: function (e) {
                    return function (t, n) {
                        return new e.init(n).finalize(t)
                    }
                }, _createHmacHelper: function (e) {
                    return function (t, n) {
                        return new f.HMAC.init(e, n).finalize(t)
                    }
                }
            }), i.algo = {});
            return i
        }(Math);
        return e
    }), !function (i, o) {
        "object" == typeof n ? module.exports = n = o(t("./core.min"), t("./sha1.min"), t("./hmac.min")) : "function" == typeof e && e.amd ? e(["./core.min", "./sha1.min", "./hmac.min"], o) : o(i.CryptoJS)
    }(this, function (e) {
        return function () {
            var t = e, n = t.lib, i = n.Base, o = n.WordArray, s = t.algo, r = s.MD5, c = s.EvpKDF = i.extend({
                cfg: i.extend({keySize: 4, hasher: r, iterations: 1}), init: function (e) {
                    this.cfg = this.cfg.extend(e)
                }, compute: function (e, t) {
                    for (var n = this.cfg, i = n.hasher.create(), s = o.create(), r = s.words, c = n.keySize, a = n.iterations; r.length < c;) {
                        d && i.update(d);
                        var d = i.update(e).finalize(t);
                        i.reset();
                        for (var l = 1; a > l; l++) d = i.finalize(d), i.reset();
                        s.concat(d)
                    }
                    return s.sigBytes = 4 * c, s
                }
            });
            t.EvpKDF = function (e, t, n) {
                return c.create(n).compute(e, t)
            }
        }(), e.EvpKDF
    }), !function (i, o) {
        "object" == typeof n ? module.exports = n = o(t("./core.min")) : "function" == typeof e && e.amd ? e(["./core.min"], o) : o(i.CryptoJS)
    }(this, function (e) {
        return function () {
            function t(e, t, n) {
                for (var i = [], s = 0, r = 0; t > r; r++) if (r % 4) {
                    var c = n[e.charCodeAt(r - 1)] << r % 4 * 2, a = n[e.charCodeAt(r)] >>> 6 - r % 4 * 2;
                    i[s >>> 2] |= (c | a) << 24 - s % 4 * 8, s++
                }
                return o.create(i, s)
            }

            var n = e, i = n.lib, o = i.WordArray, s = n.enc;
            s.Base64 = {
                stringify: function (e) {
                    var t = e.words, n = e.sigBytes, i = this._map;
                    e.clamp();
                    for (var o = [], s = 0; n > s; s += 3) for (var r = t[s >>> 2] >>> 24 - s % 4 * 8 & 255, c = t[s + 1 >>> 2] >>> 24 - (s + 1) % 4 * 8 & 255, a = t[s + 2 >>> 2] >>> 24 - (s + 2) % 4 * 8 & 255, d = r << 16 | c << 8 | a, l = 0; 4 > l && n > s + .75 * l; l++) o.push(i.charAt(d >>> 6 * (3 - l) & 63));
                    var u = i.charAt(64);
                    if (u) for (; o.length % 4;) o.push(u);
                    return o.join("")
                }, parse: function (e) {
                    var n = e.length, i = this._map, o = this._reverseMap;
                    if (!o) {
                        o = this._reverseMap = [];
                        for (var s = 0; s < i.length; s++) o[i.charCodeAt(s)] = s
                    }
                    var r = i.charAt(64);
                    if (r) {
                        var c = e.indexOf(r);
                        -1 !== c && (n = c)
                    }
                    return t(e, n, o)
                }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
            }
        }(), e.enc.Base64
    }), !function (i, o) {
        "object" == typeof n ? module.exports = n = o(t("./core.min"), t("./evpkdf.min")) : "function" == typeof e && e.amd ? e(["./core.min", "./evpkdf.min"], o) : o(i.CryptoJS)
    }(this, function (e) {
        e.lib.Cipher || function (t) {
            var n = e, i = n.lib, o = i.Base, s = i.WordArray, r = i.BufferedBlockAlgorithm, c = n.enc,
                a = (c.Utf8, c.Base64), d = n.algo, l = d.EvpKDF, u = i.Cipher = r.extend({
                    cfg: o.extend(), createEncryptor: function (e, t) {
                        return this.create(this._ENC_XFORM_MODE, e, t)
                    }, createDecryptor: function (e, t) {
                        return this.create(this._DEC_XFORM_MODE, e, t)
                    }, init: function (e, t, n) {
                        this.cfg = this.cfg.extend(n), this._xformMode = e, this._key = t, this.reset()
                    }, reset: function () {
                        r.reset.call(this), this._doReset()
                    }, process: function (e) {
                        return this._append(e), this._process()
                    }, finalize: function (e) {
                        e && this._append(e);
                        var t = this._doFinalize();
                        return t
                    }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function () {
                        function e(e) {
                            return "string" == typeof e ? w : k
                        }

                        return function (t) {
                            return {
                                encrypt: function (n, i, o) {
                                    return e(i).encrypt(t, n, i, o)
                                }, decrypt: function (n, i, o) {
                                    return e(i).decrypt(t, n, i, o)
                                }
                            }
                        }
                    }()
                }), f = (i.StreamCipher = u.extend({
                    _doFinalize: function () {
                        var e = this._process(!0);
                        return e
                    }, blockSize: 1
                }), n.mode = {}), h = i.BlockCipherMode = o.extend({
                    createEncryptor: function (e, t) {
                        return this.Encryptor.create(e, t)
                    }, createDecryptor: function (e, t) {
                        return this.Decryptor.create(e, t)
                    }, init: function (e, t) {
                        this._cipher = e, this._iv = t
                    }
                }), p = f.CBC = function () {
                    function e(e, n, i) {
                        var o = this._iv;
                        if (o) {
                            var s = o;
                            this._iv = t
                        } else var s = this._prevBlock;
                        for (var r = 0; i > r; r++) e[n + r] ^= s[r]
                    }

                    var n = h.extend();
                    return n.Encryptor = n.extend({
                        processBlock: function (t, n) {
                            var i = this._cipher, o = i.blockSize;
                            e.call(this, t, n, o), i.encryptBlock(t, n), this._prevBlock = t.slice(n, n + o)
                        }
                    }), n.Decryptor = n.extend({
                        processBlock: function (t, n) {
                            var i = this._cipher, o = i.blockSize, s = t.slice(n, n + o);
                            i.decryptBlock(t, n), e.call(this, t, n, o), this._prevBlock = s
                        }
                    }), n
                }(), v = n.pad = {}, m = v.Pkcs7 = {
                    pad: function (e, t) {
                        for (var n = 4 * t, i = n - e.sigBytes % n, o = i << 24 | i << 16 | i << 8 | i, r = [], c = 0; i > c; c += 4) r.push(o);
                        var a = s.create(r, i);
                        e.concat(a)
                    }, unpad: function (e) {
                        var t = 255 & e.words[e.sigBytes - 1 >>> 2];
                        e.sigBytes -= t
                    }
                }, y = (i.BlockCipher = u.extend({
                    cfg: u.cfg.extend({mode: p, padding: m}), reset: function () {
                        u.reset.call(this);
                        var e = this.cfg, t = e.iv, n = e.mode;
                        if (this._xformMode == this._ENC_XFORM_MODE) var i = n.createEncryptor; else {
                            var i = n.createDecryptor;
                            this._minBufferSize = 1
                        }
                        this._mode && this._mode.__creator == i ? this._mode.init(this, t && t.words) : (this._mode = i.call(n, this, t && t.words), this._mode.__creator = i)
                    }, _doProcessBlock: function (e, t) {
                        this._mode.processBlock(e, t)
                    }, _doFinalize: function () {
                        var e = this.cfg.padding;
                        if (this._xformMode == this._ENC_XFORM_MODE) {
                            e.pad(this._data, this.blockSize);
                            var t = this._process(!0)
                        } else {
                            var t = this._process(!0);
                            e.unpad(t)
                        }
                        return t
                    }, blockSize: 4
                }), i.CipherParams = o.extend({
                    init: function (e) {
                        this.mixIn(e)
                    }, toString: function (e) {
                        return (e || this.formatter).stringify(this)
                    }
                })), g = n.format = {}, b = g.OpenSSL = {
                    stringify: function (e) {
                        var t = e.ciphertext, n = e.salt;
                        if (n) var i = s.create([1398893684, 1701076831]).concat(n).concat(t); else var i = t;
                        return i.toString(a)
                    }, parse: function (e) {
                        var t = a.parse(e), n = t.words;
                        if (1398893684 == n[0] && 1701076831 == n[1]) {
                            var i = s.create(n.slice(2, 4));
                            n.splice(0, 4), t.sigBytes -= 16
                        }
                        return y.create({ciphertext: t, salt: i})
                    }
                }, k = i.SerializableCipher = o.extend({
                    cfg: o.extend({format: b}), encrypt: function (e, t, n, i) {
                        i = this.cfg.extend(i);
                        var o = e.createEncryptor(n, i), s = o.finalize(t), r = o.cfg;
                        return y.create({
                            ciphertext: s,
                            key: n,
                            iv: r.iv,
                            algorithm: e,
                            mode: r.mode,
                            padding: r.padding,
                            blockSize: e.blockSize,
                            formatter: i.format
                        })
                    }, decrypt: function (e, t, n, i) {
                        i = this.cfg.extend(i), t = this._parse(t, i.format);
                        var o = e.createDecryptor(n, i).finalize(t.ciphertext);
                        return o
                    }, _parse: function (e, t) {
                        return "string" == typeof e ? t.parse(e, this) : e
                    }
                }), C = n.kdf = {}, E = C.OpenSSL = {
                    execute: function (e, t, n, i) {
                        i || (i = s.random(8));
                        var o = l.create({keySize: t + n}).compute(e, i), r = s.create(o.words.slice(t), 4 * n);
                        return o.sigBytes = 4 * t, y.create({key: o, iv: r, salt: i})
                    }
                }, w = i.PasswordBasedCipher = k.extend({
                    cfg: k.cfg.extend({kdf: E}), encrypt: function (e, t, n, i) {
                        i = this.cfg.extend(i);
                        var o = i.kdf.execute(n, e.keySize, e.ivSize);
                        i.iv = o.iv;
                        var s = k.encrypt.call(this, e, t, o.key, i);
                        return s.mixIn(o), s
                    }, decrypt: function (e, t, n, i) {
                        i = this.cfg.extend(i), t = this._parse(t, i.format);
                        var o = i.kdf.execute(n, e.keySize, e.ivSize, t.salt);
                        i.iv = o.iv;
                        var s = k.decrypt.call(this, e, t, o.key, i);
                        return s
                    }
                })
        }()
    }), !function (i, o) {
        "object" == typeof n ? module.exports = n = o(t("./core.min")) : "function" == typeof e && e.amd ? e(["./core.min"], o) : o(i.CryptoJS)
    }(this, function (e) {
        !function () {
            var t = e, n = t.lib, i = n.Base, o = t.enc, s = o.Utf8, r = t.algo;
            r.HMAC = i.extend({
                init: function (e, t) {
                    e = this._hasher = new e.init, "string" == typeof t && (t = s.parse(t));
                    var n = e.blockSize, i = 4 * n;
                    t.sigBytes > i && (t = e.finalize(t)), t.clamp();
                    for (var o = this._oKey = t.clone(), r = this._iKey = t.clone(), c = o.words, a = r.words, d = 0; n > d; d++) c[d] ^= 1549556828, a[d] ^= 909522486;
                    o.sigBytes = r.sigBytes = i, this.reset()
                }, reset: function () {
                    var e = this._hasher;
                    e.reset(), e.update(this._iKey)
                }, update: function (e) {
                    return this._hasher.update(e), this
                }, finalize: function (e) {
                    var t = this._hasher, n = t.finalize(e);
                    t.reset();
                    var i = t.finalize(this._oKey.clone().concat(n));
                    return i
                }
            })
        }()
    }), !function (i, o) {
        "object" == typeof n ? module.exports = n = o(t("./core.min"), t("./cipher-core.min")) : "function" == typeof e && e.amd ? e(["./core.min", "./cipher-core.min"], o) : o(i.CryptoJS)
    }(this, function (e) {
        return e.mode.ECB = function () {
            var t = e.lib.BlockCipherMode.extend();
            return t.Encryptor = t.extend({
                processBlock: function (e, t) {
                    this._cipher.encryptBlock(e, t)
                }
            }), t.Decryptor = t.extend({
                processBlock: function (e, t) {
                    this._cipher.decryptBlock(e, t)
                }
            }), t
        }(), e.mode.ECB
    }), !function (i, o) {
        "object" == typeof n ? module.exports = n = o(t("./core.min"), t("./cipher-core.min")) : "function" == typeof e && e.amd ? e(["./core.min", "./cipher-core.min"], o) : o(i.CryptoJS)
    }(this, function (e) {
        return e.pad.Pkcs7
    }), !function (i, o) {
        "object" == typeof n ? module.exports = n = o(t("./core.min"), t("./enc-base64.min"), t("./md5.min"), t("./evpkdf.min"), t("./cipher-core.min")) : "function" == typeof e && e.amd ? e(["./core.min", "./enc-base64.min", "./md5.min", "./evpkdf.min", "./cipher-core.min"], o) : o(i.CryptoJS)
    }(this, function (e) {
        return function () {
            var t = e, n = t.lib, i = n.BlockCipher, o = t.algo, s = [], r = [], c = [], a = [], d = [], l = [], u = [],
                f = [], h = [], p = [];
            !function () {
                for (var e = [], t = 0; 256 > t; t++) e[t] = 128 > t ? t << 1 : t << 1 ^ 283;
                for (var n = 0, i = 0, t = 0; 256 > t; t++) {
                    var o = i ^ i << 1 ^ i << 2 ^ i << 3 ^ i << 4;
                    o = o >>> 8 ^ 255 & o ^ 99, s[n] = o, r[o] = n;
                    var v = e[n], m = e[v], y = e[m], g = 257 * e[o] ^ 16843008 * o;
                    c[n] = g << 24 | g >>> 8, a[n] = g << 16 | g >>> 16, d[n] = g << 8 | g >>> 24, l[n] = g;
                    var g = 16843009 * y ^ 65537 * m ^ 257 * v ^ 16843008 * n;
                    u[o] = g << 24 | g >>> 8, f[o] = g << 16 | g >>> 16, h[o] = g << 8 | g >>> 24, p[o] = g, n ? (n = v ^ e[e[e[y ^ v]]], i ^= e[e[i]]) : n = i = 1
                }
            }();
            var v = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], m = o.AES = i.extend({
                _doReset: function () {
                    if (!this._nRounds || this._keyPriorReset !== this._key) {
                        for (var e = this._keyPriorReset = this._key, t = e.words, n = e.sigBytes / 4, i = this._nRounds = n + 6, o = 4 * (i + 1), r = this._keySchedule = [], c = 0; o > c; c++) if (n > c) r[c] = t[c]; else {
                            var a = r[c - 1];
                            c % n ? n > 6 && c % n == 4 && (a = s[a >>> 24] << 24 | s[a >>> 16 & 255] << 16 | s[a >>> 8 & 255] << 8 | s[255 & a]) : (a = a << 8 | a >>> 24, a = s[a >>> 24] << 24 | s[a >>> 16 & 255] << 16 | s[a >>> 8 & 255] << 8 | s[255 & a], a ^= v[c / n | 0] << 24), r[c] = r[c - n] ^ a
                        }
                        for (var d = this._invKeySchedule = [], l = 0; o > l; l++) {
                            var c = o - l;
                            if (l % 4) var a = r[c]; else var a = r[c - 4];
                            d[l] = 4 > l || 4 >= c ? a : u[s[a >>> 24]] ^ f[s[a >>> 16 & 255]] ^ h[s[a >>> 8 & 255]] ^ p[s[255 & a]]
                        }
                    }
                }, encryptBlock: function (e, t) {
                    this._doCryptBlock(e, t, this._keySchedule, c, a, d, l, s)
                }, decryptBlock: function (e, t) {
                    var n = e[t + 1];
                    e[t + 1] = e[t + 3], e[t + 3] = n, this._doCryptBlock(e, t, this._invKeySchedule, u, f, h, p, r);
                    var n = e[t + 1];
                    e[t + 1] = e[t + 3], e[t + 3] = n
                }, _doCryptBlock: function (e, t, n, i, o, s, r, c) {
                    for (var a = this._nRounds, d = e[t] ^ n[0], l = e[t + 1] ^ n[1], u = e[t + 2] ^ n[2], f = e[t + 3] ^ n[3], h = 4, p = 1; a > p; p++) {
                        var v = i[d >>> 24] ^ o[l >>> 16 & 255] ^ s[u >>> 8 & 255] ^ r[255 & f] ^ n[h++],
                            m = i[l >>> 24] ^ o[u >>> 16 & 255] ^ s[f >>> 8 & 255] ^ r[255 & d] ^ n[h++],
                            y = i[u >>> 24] ^ o[f >>> 16 & 255] ^ s[d >>> 8 & 255] ^ r[255 & l] ^ n[h++],
                            g = i[f >>> 24] ^ o[d >>> 16 & 255] ^ s[l >>> 8 & 255] ^ r[255 & u] ^ n[h++];
                        d = v, l = m, u = y, f = g
                    }
                    var v = (c[d >>> 24] << 24 | c[l >>> 16 & 255] << 16 | c[u >>> 8 & 255] << 8 | c[255 & f]) ^ n[h++],
                        m = (c[l >>> 24] << 24 | c[u >>> 16 & 255] << 16 | c[f >>> 8 & 255] << 8 | c[255 & d]) ^ n[h++],
                        y = (c[u >>> 24] << 24 | c[f >>> 16 & 255] << 16 | c[d >>> 8 & 255] << 8 | c[255 & l]) ^ n[h++],
                        g = (c[f >>> 24] << 24 | c[d >>> 16 & 255] << 16 | c[l >>> 8 & 255] << 8 | c[255 & u]) ^ n[h++];
                    e[t] = v, e[t + 1] = m, e[t + 2] = y, e[t + 3] = g
                }, keySize: 8
            });
            t.AES = i._createHelper(m)
        }(), e.AES
    }), !function (i, o) {
        "object" == typeof n ? module.exports = n = o(t("./core.min")) : "function" == typeof e && e.amd ? e(["./core.min"], o) : o(i.CryptoJS)
    }(this, function (e) {
        return e.enc.Utf8
    })
}).call(PassMachine);
var PassMachine = "undefined" == typeof window.PassMachine ? {} : window.PassMachine;
PassMachine.loadCss = PassMachine.loadCss || function (e, t) {
    var n = document, i = n.createElement("link");
    i.rel = "stylesheet", i.type = "text/css", i.href = e, i.disabled = !1, n.getElementsByTagName("head")[0].appendChild(i), i.readyState ? i.onreadystatechange = function () {
        ("loaded" === i.readyState || "complete" === i.readyState) && (i.onreadystatechange = null, t && t())
    } : i.onload = function () {
        t && t()
    }
}, PassMachine.loadJs = PassMachine.loadJs || function (e, t) {
    var n = document, i = n.createElement("SCRIPT");
    i.type = "text/javascript", i.charset = "UTF-8", i.src = e, n.getElementsByTagName("head")[0].appendChild(i), i.readyState ? i.onreadystatechange = function () {
        ("loaded" === i.readyState || "complete" === i.readyState) && (i.onreadystatechange = null, t && t())
    } : i.onload = function () {
        t && t()
    }
};
var con = {mkd: "https://wappass.baidu.com/static/machine/css/api/mkd.css"};
PassMachine.loadCss(con.mkd, function () {
});
var PassMachine = "undefined" == typeof window.PassMachine ? {} : window.PassMachine;
!function (e, t) {
    function n() {
        var e = new Date, t = e.getTime();
        return t
    }

    function i(e) {
        function t(e) {
            e.type = (e.type || "GET").toUpperCase(), e.data = i(e.data);
            var t = null;
            t = window.XMLHttpRequest ? new XMLHttpRequest : new window.ActiveXObjcet("Microsoft.XMLHTTP"), t.onreadystatechange = function () {
                if (4 === t.readyState) {
                    var n = t.status;
                    if (n >= 200 && 300 > n) {
                        var i = "", o = t.getResponseHeader("Content-type");
                        i = -1 !== o.indexOf("xml") && t.responseXML ? t.responseXML : "application/json" === o ? JSON.parse(t.responseText) : t.responseText, e.success && e.success(i)
                    } else e.error && e.error(n)
                }
            }, "GET" === e.type ? (t.open(e.type, e.url + "?" + e.data, !0), t.send(null)) : (t.open(e.type, e.url, !0), t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"), t.send(e.data))
        }

        function n(e) {
            var t = e.jsonp + o(), n = document.getElementsByTagName("head")[0];
            e.data.callback = t;
            var s = i(e.data), r = document.createElement("script");
            r.onload = function () {
                setTimeout(function () {
                    window[t] && (e.error && e.error(), e.mkdGetRequestError = !0)
                }, 200)
            }, n.appendChild(r), window[t] = function (i) {
                n.removeChild(r), clearTimeout(r.timer), window[t] = null, e.success && e.success(i)
            }, r.onerror = function (t) {
                e.error && e.error(t), e.mkdGetRequestError = !0
            }, r.src = e.url + "?" + s, e.time && (r.timer = setTimeout(function () {
                window[t] = null, n.removeChild(r), e.mkdGetRequestError || e.error && e.error({message: "超时"})
            }, e.time))
        }

        function i(e) {
            var t = [];
            for (var n in e) e.hasOwnProperty(n) && t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
            return t.push("v=" + o()), t.push("t=" + (new Date).getTime()), t.join("&")
        }

        function o() {
            return Math.floor(1e4 * Math.random() + 500)
        }

        e = e || {}, e.data = e.data || {}, e.jsonp ? n(e) : t(e)
    }

    function o(e, t) {
        var n;
        return function () {
            return n ? void 0 : (n = setTimeout(function () {
                n = null
            }, t), e.apply(this))
        }
    }

    function s() {
        try {
            var n = e.mozInnerScreenY || e.screenTop, i = e.mozInnerScreenX || e.screenLeft;
            "undefined" == typeof n && (n = 0), "undefined" == typeof i && (i = 0);
            var o = t.documentElement.clientWidth || t.body.clientWidth,
                s = t.documentElement.clientHeight || t.body.clientHeight, r = e.screen.width, c = e.screen.height,
                a = e.screen.availWidth, d = e.screen.availHeight, l = e.outerWidth, u = e.outerHeight,
                f = t.documentElement.scrollWidth || t.body.scrollWidth,
                h = t.documentElement.scrollWidth || t.body.scrollHeight;
            return {
                screenTop: n,
                screenLeft: i,
                clientWidth: o,
                clientHeight: s,
                screenWidth: r,
                screenHeight: c,
                availWidth: a,
                availHeight: d,
                outerWidth: l,
                outerHeight: u,
                scrollWidth: f,
                scrollHeight: h
            }
        } catch (p) {
        }
    }

    function r(e, t, n) {
        e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent ? e.attachEvent("on" + t, n) : e["on" + t] = n
    }

    function c(e, t) {
        return !!e.className.match(new RegExp("(\\s|^)" + t + "(\\s|$)"))
    }

    function a(e, t) {
        return c(e, t) || (e.className, e.className += " " + t), this
    }

    function d(e, t) {
        return c(e, t) && (e.className = e.className.indexOf(" " + t + " ") >= 0 ? e.className.replace(new RegExp("(\\s|^)" + t + "(\\s|$)"), " ") : e.className.replace(new RegExp("(\\s|^)" + t + "(\\s|$)"), "")), this
    }

    function l(e, t, n) {
        e.removeEventListener ? e.removeEventListener(t, n, !1) : e.datachEvent ? e.detachEvent("on" + t, n) : e["on" + t] = null
    }

    function u(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1
    }

    try {
        var f = window.navigator.userAgent.toLowerCase(), h = "";
        if ((f.match(/msie\s\d+/) && f.match(/msie\s\d+/)[0] || f.match(/trident\s?\d+/) && f.match(/trident\s?\d+/)[0]) && (h = f.match(/msie\s\d+/)[0].match(/\d+/)[0] || f.match(/trident\s?\d+/)[0]), h && 9 > h) return !1;
        var p, v, m = {
            testUrl: "https://bjyz-passport-antispam01.bjyz.baidu.com:8888/viewlog",
            onlineUrl: "https://passport.baidu.com/viewlog"
        };
        PassMachine.mkd = function (e) {
            this.init(e)
        }, PassMachine.mkd.prototype = {
            init: function (t) {
                this.initConfig(t), this.mobilecheck(), this.initMock(), e.PassMachine.haveMkd || (this.initApi(), e.PassMachine.haveMkd = this)
            }, initConfig: function (e) {
                this.conf = e, this.lang = {
                    securityVerify: e.slideConfig && e.slideConfig.headTitle || "安全验证",
                    introducer: e.slideConfig && e.slideConfig.conTitle || "滑至最右 完成验证",
                    bottomTitle: e.slideConfig && e.slideConfig.bottomTitle || "为了你的帐号安全，本次操作需要进行安全验证",
                    verifySuccess: e.slideConfig && e.slideConfig.finishTitle || "验证成功",
                    verifyError: e.slideConfig && e.slideConfig.errorTitle || "验证失败",
                    spinHeadTitle: e.spinConfig && e.spinConfig.headTitle || "环境异常，请进行验证",
                    spinTntroducer: e.spinConfig && e.spinConfig.conTitle || "拖动滑块，使图片角度为正"
                }, this.protocol = "https:", this.store = {
                    storeVer: "1.0.1",
                    count: 0,
                    countnum: 10,
                    nameL: "6bffae1c",
                    nameR: "appsapi0",
                    sendUrl: e.sendUrl || m.onlineUrl
                }, this.conf && this.conf.testurl && (this.store.sendUrl = m.testUrl), this.store.getStyleUrl = this.store.sendUrl + "/getstyle", this.store.ak = e.ak || "", this.store.type = e.type || "default", this.store.id = e.id || "mkd", this.num = Math.floor(1e3 * Math.random())
            }, mobilecheck: function () {
                try {
                    var e = navigator.platform || "Win";
                    /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent) ? this.wapsetconfig() : "ontouchend" in document && -1 === e.indexOf("Win") && -1 === e.indexOf("Mac") ? this.wapsetconfig() : this.pcsetconfig()
                } catch (t) {
                    this.wapsetconfig()
                }
            }, wapsetconfig: function () {
                this.devicetype = "wap", this.eventclick = "touchstart", this.eventmove = "touchmove", this.eventend = "touchend", this.eventend2 = "touchcancel", this.store.countnum = 10
            }, pcsetconfig: function () {
                this.devicetype = "pc", this.eventclick = "mousedown", this.eventmove = "mousemove", this.eventend = "mouseup", this.store.countnum = 20
            }, initMock: function () {
                this.rzData = {
                    cl: [],
                    mv: [],
                    sc: [],
                    kb: [],
                    cr: s(),
                    simu: window.navigator.webdriver ? 1 : 0,
                    ac_c: 0
                }, this.dsData = {}
            }, initApi: function () {
                var e = this, t = {};
                t.ak = e.store.ak, i({
                    url: e.store.sendUrl,
                    jsonp: "jsonpCallbackA1",
                    data: t,
                    time: 1e4,
                    success: function (t) {
                        1 === t.code ? (console.log(t.msg), p = 1, v = t.msg) : (e.dsData = t.data || {}, e.store.nameL = t.data.as || "6bffae1c", e.initGatherEvent(), e.conf.initApiSuccessFn && e.conf.initApiSuccessFn(e.dsData))
                    },
                    error: function () {
                        e.errorData(), e.initGatherEvent(), e.conf.initApiSuccessFn && e.conf.initApiSuccessFn(e.dsData)
                    }
                })
            }, initGatherEvent: function () {
                var i = this, s = function (t) {
                    t = t || e.event;
                    var o = {}, s = "wap" === i.devicetype ? t.changedTouches[0] : t;
                    o.x = parseInt(s.clientX, 10), o.y = parseInt(s.clientY, 10), o.t = n(), i.rzData.cl.push(o), i.reportedOpportunity()
                }, c = o(function (t) {
                    t = t || e.event || arguments.callee.caller.arguments[0];
                    var o = {}, s = "wap" === i.devicetype ? t.changedTouches[0] : t;
                    o.fx = parseInt(s.clientX, 10), o.fy = parseInt(s.clientY, 10), o.t = n(), i.rzData.mv.push(o), i.reportedOpportunity()
                }, 150), a = function () {
                    var e = {};
                    e.key = "a", e.t = n(), i.rzData.kb.push(e), i.reportedOpportunity()
                }, d = o(function (n) {
                    n = n || e.event;
                    var o = {};
                    o.tx = t.documentElement.scrollLeft || t.body.scrollLeft, o.ty = t.documentElement.scrollTop || t.body.scrollTop, i.rzData.sc.push(o), i.reportedOpportunity()
                }, 300);
                r(t, i.eventclick, s), r(t, i.eventmove, c), r(t, "keyup", a), r(e, "scroll", d), i.removeGatherEvent = function () {
                    l(t, i.eventclick, s), l(t, i.eventmove, c), l(t, "keyup", a), l(e, "scroll", d)
                }
            }, getStyleInfo: function (e, t) {
                var n = this, o = {};
                o.ak = n.store.ak, o.type = n.store.type || "default", i({
                    url: n.store.getStyleUrl,
                    jsonp: "jsonpCallbackA2",
                    data: o,
                    time: 1e4,
                    success: function (t) {
                        return 1 === t.code ? void console.log(t.msg) : (n.conf.backstr = t.data.backstr, "spin" === t.data.type ? (n.conf.type = "spin", n.conf.ext = t.data.ext) : n.conf.type = "slide", void e(t))
                    },
                    error: function () {
                        console.log("error"), n.conf.type = "slide", t()
                    }
                })
            }, postData: function (e, t) {
                if (1 === p) return console.log(v), this.removeGatherEvent && this.removeGatherEvent(), this.removeVcodeEvent && this.removeVcodeEvent(), !1;
                var n = this, o = JSON.stringify(n.rzData), s = n.encrypt(o), r = {};
                r.ak = n.store.ak, r.as = n.store.nameL || "", r.fs = s, t && (r.cv = t), n.store.count = 0, n.initMock(), i({
                    url: n.store.sendUrl,
                    jsonp: "jsonpCallbackb",
                    data: r,
                    time: 1e4,
                    success: function (t) {
                        if (0 === t.code && t.data) {
                            n.dsData = t.data || {}, n.store.nameL = t.data.as || "6bffae1c";
                            var i = t.data;
                            delete i.as, e && e(i)
                        } else 1 === t.code ? (console.log(t.msg), n.removeGatherEvent && n.removeGatherEvent(), n.removeVcodeEvent && n.removeVcodeEvent(), p = 1) : (n.errorData(), e && e(n.dsData))
                    },
                    error: function () {
                        n.errorData(), e && e(n.dsData)
                    }
                })
            }, initVcode: function (e) {
                var t = this;
                t.getStyleInfo(function () {
                    "spin" === t.conf.type ? t.initSpinDom(e) : t.initSildeDom(e)
                })
            }, initSildeDom: function (e) {
                var t = this;
                if (1 === p) return console.log(v), !1;
                e = {}, e.id = e && e.id || this.store.id;
                var n = "", i = "", o = "";
                n = '<div class="vcode-slide-img"></div>', i = "vcode-slide-expression-x", o = "vcode-slide-loading-x", this.odiv = document.createElement("div");
                var s = this.odiv;
                s.className = "mod-vcodes", s.id = "mod-vcodes" + this.num, s.innerHTML = '<div class="mod-vcode-content clearfix" id="pass-content' + this.num + '"><p class="mod-page-tipInfo-gray" id="pass-slide-tipInfo' + this.num + '">' + this.lang.securityVerify + '</p><div class="vcode-slide-faceboder" id="vcode-slide-faceboder' + this.num + '">' + n + '<div class="' + i + '" id="vcode-slide-expression' + this.num + '"></div></div><div class="vcode-slide-control"  id="pass-slide-control' + this.num + '"><div class="vcode-slide-bottom" id="vcode-slide-bottom' + this.num + '"><p id="vcode-slide-bottom-p' + this.num + '">' + this.lang.introducer + '</p></div><div class="vcode-slide-cover" id="vcode-slide-cover' + this.num + '"><p id="vcode-slide-cover-p' + this.num + '"></p></div><div class="vcode-slide-button" id="vcode-slide-button' + this.num + '"><p class="" id="vcode-slide-button-p' + this.num + '"></p></div><div class="' + o + '" id="vcode-slide-loading' + this.num + '"></div></div><p class="vcode-slide-footer" id="pass-slide-footer' + this.num + '">' + this.lang.bottomTitle + "</p></div>", t.appendDomProcess(s, e), setTimeout(function () {
                    t.initVcodeEvent()
                }, 100)
            }, initSpinDom: function (e) {
                var t = this;
                if (1 === p) return console.log(v), !1;
                e = {}, e.id = e && e.id || this.store.id;
                var n = "";
                n = '<div class="vcode-spin-faceboder" id="vcode-spin-faceboder' + this.num + '"><div class="vcode-spin-img" id="vcode-spin-img' + this.num + '"></div><div class="vcode-spin-mask hide" id="vcode-spin-mask' + this.num + '"></div><div class="vcode-spin-icon hide" id="vcode-spin-icon' + this.num + '"></div></div>';
                var i = "";
                i = '<div class="vcode-spin-control"  id="pass-spin-control' + this.num + '"><div class="vcode-spin-bottom" id="vcode-spin-bottom' + this.num + '"><p id="vcode-spin-bottom-p' + this.num + '">' + this.lang.spinTntroducer + '</p></div><div class="vcode-spin-button" id="vcode-spin-button' + this.num + '"><p class="" id="vcode-spin-button-p' + this.num + '"></p></div></div>';
                var o = decodeURIComponent(this.conf.ext && this.conf.ext.img) || "",
                    s = this.conf.ext && this.conf.ext.info || "";
                this.odiv = document.createElement("div");
                var r = this.odiv;
                r.className = "mod-vcodes", r.id = "mod-vcodes" + this.num, r.innerHTML = '<div class="mod-vcode-content clearfix" id="pass-content' + this.num + '"><p class="mod-page-tipInfo-gray" id="pass-slide-tipInfo' + this.num + '">' + this.lang.spinHeadTitle + "</p>" + n + i + '<p class="vcode-slide-footer" id="pass-spin-footer' + this.num + '">' + s + "</p></div>", t.appendDomProcess(r, e);
                var c = document.getElementById("vcode-spin-img" + this.num);
                c.style.backgroundImage = "url(" + o + ")", setTimeout(function () {
                    t.initVcodeEvent()
                }, 100)
            }, appendDomProcess: function (e, t) {
                var n = this;
                if (this.conf && this.conf.maskModule === !0) this.createDialogMask(), this.createDialogBody(), d(this.maskDiv, "hide"), d(this.bodyDiv, "hide"), this.bodyDiv.appendChild(e), this.closeDiv = document.createElement("div"), this.closeDiv.className = "vcode-close", this.closeDiv.id = "vcode-close" + this.num, this.bodyDiv.appendChild(this.closeDiv), r(this.closeDiv, this.eventclick, function (e) {
                    u(e), n.conf.closeFn && n.conf.closeFn(), n.removeMask()
                }); else if (t && t.id) {
                    if (document.getElementById(t.id).lastChild && "mod-vcodes" === document.getElementById(t.id).lastChild.className) {
                        var i = document.getElementById(t.id);
                        i.removeChild(i.lastChild), i.lastChild = null, this.removeVcodeEvent && this.removeVcodeEvent(), this.finish = !1, this.start = !1
                    }
                    document.getElementById(t.id).appendChild(e)
                } else document.appendChild(e)
            }, initVcodeEvent: function () {
                "spin" === this.conf.type ? this.initSpinVcodeEvent() : this.initSildeVcodeEvent()
            }, initSildeVcodeEvent: function () {
                var t = this, n = document.getElementById("mod-vcodes" + this.num),
                    i = document.getElementById("pass-content" + this.num),
                    o = document.getElementById("pass-slide-control" + this.num),
                    s = document.getElementById("pass-slide-tipInfo" + this.num),
                    c = document.getElementById("pass-slide-footer" + this.num),
                    f = document.getElementById("vcode-slide-faceboder" + this.num),
                    p = document.getElementById("vcode-slide-expression" + this.num),
                    v = document.getElementById("vcode-slide-button" + this.num),
                    m = document.getElementById("vcode-slide-bottom" + this.num),
                    y = document.getElementById("vcode-slide-cover" + this.num),
                    g = document.getElementById("vcode-slide-loading" + this.num), b = v.offsetWidth,
                    k = document.getElementById("vcode-slide-bottom-p" + this.num),
                    C = document.getElementById("vcode-slide-cover-p" + this.num),
                    E = document.getElementById("vcode-slide-button-p" + this.num);
                this.conf && this.conf.slideSimple === !0 && (i.style.padding = 0, f.style.display = "none", s.style.display = "none", c.style.display = "none", o.style.width = "100%", this.conf.controlWidth && (o.style.width = this.conf.controlWidth));
                var w = m.offsetWidth - b;
                t.conf.slideConfig && "square" === t.conf.slideConfig.borderRadius && (a(v, "borderRadius"), a(m, "borderRadius"), a(y, "borderRadius"));
                var x = function () {
                    var e = 0;
                    e = h && 9 >= +h ? 500 : 700, g.style.display = "block", t.setData && (t.setData("ac_c", 1), t.setData("backstr", t.conf.backstr), t.postData(function (n) {
                        var i = n;
                        g.style.display = "none", 1 === i.op ? (t.successUiCallback(), setTimeout(function () {
                            t.conf.verifySuccessFn && t.conf.verifySuccessFn(i)
                        }, e)) : t.errorUiCallback()
                    }, "submit"))
                }, B = function () {
                    d(k, "hide"), a(y, "vcode-transition"), y.style.width = b + "px", a(v, "vcode-transition"), a(p, "vcode-transition"), a(k, "vcode-transition"), d(E, "opacity0");
                    var e = 0;
                    h && 9 >= +h ? (v.style["margin-left"] = "", p.style["margin-left"] = "", k.style["margin-left"] = "", e = 0) : (v.style.transform = "translateX(0)", v.style.msTransform = "translateX(0)", v.style.webkitTransform = "translateX(0)", v.style.MozTransform = "translateX(0)", v.style.OTransform = "translateX(0)", p.style.transform = "translateX(0)", p.style.msTransform = "translateX(0)", p.style.webkitTransform = "translateX(0)", p.style.MozTransform = "translateX(0)", p.style.OTransform = "translateX(0)", k.style.transform = "translateX(0)", k.style.msTransform = "translateX(0)", k.style.webkitTransform = "translateX(0)", k.style.MozTransform = "translateX(0)", k.style.OTransform = "translateX(0)", e = 300), setTimeout(function () {
                        d(v, "vcode-transition"), d(v, "vcode-slide-button-focus"), t.conf.slideConfig && t.conf.slideConfig.color && (v.style = "", v.setAttribute("style", "")), d(v, "vcode-slide-button-error"), d(y, "vcode-slide-cover-error"), d(y, "vcode-transition"), d(f, "vcode-slidefaceboder-horizontal"), d(p, "vcode-transition"), d(k, "vcode-transition")
                    }, e)
                };
                t.successUiCallback = function () {
                    a(f, "vcode-slide-faceborder-animate"), a(C, "vcode-transition"), d(C, "coverp-hide"), a(C, "coverp-show"), C.innerHTML = t.lang.verifySuccess, a(E, "opacity0")
                }, t.errorUiCallback = function (e) {
                    t.conf.slideConfig && t.conf.slideConfig.color && (y.style.background = "", v.style.background = "", v.style.border = "");
                    var n = e || {};
                    a(v, "vcode-slide-button-error"), a(y, "vcode-slide-cover-error"), d(f, "vcode-slide-faceborder-animate"), a(f, "vcode-slidefaceboder-horizontal"), a(C, "vcode-transition"), d(C, "coverp-hide"), a(C, "coverp-show"), C.innerHTML = n.msg || t.lang.verifyError, setTimeout(function () {
                        d(C, "coverp-show"), a(C, "coverp-hide"), C.innerHTML = "", B(), t.finish = !1, t.start = !1
                    }, 1e3)
                };
                var S = function (n) {
                    if (t.finish) return !1;
                    t.start = !0, n = n || e.event, u(n);
                    var i = "wap" === t.devicetype ? n.touches[0] || n.changedTouches[0] : n;
                    a(v, "vcode-slide-button-focus"), t.conf.slideConfig && t.conf.slideConfig.color && (y.style.background = t.conf.slideConfig.color || "#4b96ea", v.style.background = t.conf.slideConfig.color || "#4b96ea", v.style.border = t.conf.slideConfig.color || "#4b96ea"), t.currentX = i.clientX
                }, _ = function (n) {
                    if (t.finish || !t.start) return !1;
                    n = n || e.event, u(n);
                    var i = "wap" === t.devicetype ? n.changedTouches[0] : n, o = i.clientX - t.currentX;
                    o >= w - 5 ? (o = w, t.finish = !0, x()) : 0 >= o && (o = 0);
                    var s = parseFloat(o / w).toFixed(2);
                    y.style.width = o + b + "px", h && 9 >= +h ? (v.style["margin-left"] = o + "px", p.style["margin-left"] = -563 * s + "px", k.style["margin-left"] = -75 + .1 * o + "px") : (v.style.transform = "translateX(" + o + "px)", v.style.msTransform = "translateX(" + o + "px)", v.style.webkitTransform = "translateX(" + o + "px)", v.style.MozTransform = "translateX(" + o + "px)", v.style.OTransform = "translateX(" + o + "px)", p.style.transform = "translateX(-" + 89.5 * s + "%)", p.style.msTransform = "translateX(-" + 89.5 * s + "%)", p.style.webkitTransform = "translateX(-" + 89.5 * s + "%)", p.style.MozTransform = "translateX(-" + 89.5 * s + "%)", p.style.OTransform = "translateX(-" + 89.5 * s + "%)", k.style.transform = "translateX(" + 10 * s + "%)")
                }, D = function (n) {
                    t.start = !1, n = n || e.event, u(n);
                    var i = "wap" === t.devicetype ? n.changedTouches[0] : n, o = i.clientX - this.currentX;
                    return 0 >= o ? (d(v, "vcode-slide-button-focus"), t.conf.slideConfig && t.conf.slideConfig.color && (v.style = ""), d(v, "vcode-slide-button-error")) : t.finish || B(), !1
                };
                r(v, t.eventclick, S), r(n, t.eventmove, _), r(n, t.eventend, D), t.eventend2 && r(n, t.eventend2, D), t.removeVcodeEvent = function () {
                    l(v, t.eventclick, S), l(n, t.eventmove, _), l(n, t.eventend, D)
                }
            }, initSpinVcodeEvent: function () {
                function t() {
                    n.getStyleInfo(function (e) {
                        var t = document.getElementById("vcode-spin-img" + n.num);
                        t.style.backgroundImage = "url(" + decodeURIComponent(e.data.ext && e.data.ext.img) + ")", g.innerHTML = e.data.ext && e.data.ext.info || "", d(m, "hide")
                    })
                }

                var n = this, i = document.getElementById("mod-vcodes" + this.num),
                    o = document.getElementById("pass-spin-control" + this.num),
                    s = document.getElementById("vcode-spin-img" + this.num),
                    c = document.getElementById("vcode-spin-mask" + this.num),
                    f = document.getElementById("vcode-spin-icon" + this.num),
                    h = document.getElementById("vcode-spin-button" + this.num),
                    p = document.getElementById("vcode-spin-bottom" + this.num), v = h.offsetWidth,
                    m = document.getElementById("vcode-spin-bottom-p" + this.num),
                    y = document.getElementById("vcode-spin-button-p" + this.num),
                    g = document.getElementById("pass-spin-footer" + this.num), b = p.offsetWidth - v;
                n.conf.spinConfig && "square" === n.conf.spinConfig.borderRadius && (a(h, "borderRadius"), a(p, "borderRadius"));
                var k = function () {
                    d(h, "vcode-spin-button-focus"), a(h, "vcode-spin-button-loading"), d(c, "hide"), d(f, "hide"), a(f, "vcode-spin-icon-loading"), n.setData && (n.setData("ac_c", +n.percentage), n.setData("backstr", n.conf.backstr || ""), n.postData(function (e) {
                        var t = e;
                        1 === +t.op ? (n.successUiCallback(), setTimeout(function () {
                            n.conf.verifySuccessFn && n.conf.verifySuccessFn(t)
                        }, 500)) : n.errorUiCallback()
                    }, "submit"))
                }, C = function (e) {
                    d(y, "opacity0");
                    var t = 0;
                    h.style.transform = "translateX(0)", h.style.msTransform = "translateX(0)", h.setAttribute("style", "transform:translateX(0)"), t = 300, d(h, "vcode-slide-button-focus"), d(h, "vcode-spin-button-error"), a(c, "hide"), a(f, "hide"), d(f, "vcode-spin-icon-error"), s.style.transform = "", s.style.msTransform = "", e && e()
                };
                n.successUiCallback = function () {
                    d(f, "vcode-spin-icon-loading"), a(f, "vcode-spin-icon-success")
                }, n.errorUiCallback = function () {
                    d(f, "vcode-spin-icon-loading"), a(f, "vcode-spin-icon-error"), a(o, "vcode-spin-control-horizontal"), d(h, "vcode-spin-button-loading"), a(h, "vcode-spin-button-error"), setTimeout(function () {
                        d(o, "vcode-spin-control-horizontal"), C(function () {
                            t()
                        }), n.finish = !1, n.start = !1
                    }, 1e3)
                };
                var E = function (t) {
                    if (n.finish) return !1;
                    n.start = !0, t = t || e.event, u(t);
                    var i = "wap" === n.devicetype ? t.touches[0] || t.changedTouches[0] : t;
                    a(h, "vcode-spin-button-focus"), a(m, "hide"), n.currentX = i.clientX
                }, w = function (t) {
                    if (n.finish || !n.start) return !1;
                    t = t || e.event, u(t);
                    var i = "wap" === n.devicetype ? t.changedTouches[0] : t, o = i.clientX - n.currentX;
                    a(h, "vcode-spin-button-focus"), n.conf.color && (h.style.background = n.conf.color || "#4b96ea", h.style.border = n.conf.color || "#4b96ea"), o >= b ? (o = b, n.finish = !0, k()) : 0 >= o && (o = 0, d(h, "vcode-spin-button-focus"), n.conf.color && (h.style = "")), n.percentage = parseFloat(o / b).toFixed(2), s.style.transform = "rotate(" + 360 * n.percentage + "deg)", s.style.msTransform = "rotate(" + 360 * n.percentage + "deg)", s.style.webkitTransform = "rotate(" + 360 * n.percentage + "deg)", s.style.MozTransform = "rotate(" + 360 * n.percentage + "deg)", s.style.OTransform = "rotate(" + 360 * n.percentage + "deg)", h.style.transform = "translateX(" + o + "px)", h.style.msTransform = "translateX(" + o + "px)", h.style.webkitTransform = "translateX(" + o + "px)", h.style.MozTransform = "translateX(" + o + "px)", h.style.OTransform = "translateX(" + o + "px)"
                }, x = function (t) {
                    if (!n.start) return !1;
                    n.start = !1, t = t || e.event, u(t);
                    var i = "wap" === n.devicetype ? t.changedTouches[0] : t, o = i.clientX - this.currentX;
                    return 0 >= o ? (d(h, "vcode-spin-button-focus"), d(h, "vcode-spin-button-error")) : n.finish || k(), !1
                };
                r(h, n.eventclick, E), r(i, n.eventmove, w), r(i, n.eventend, x), n.eventend2 && r(i, n.eventend2, x), n.removeVcodeEvent = function () {
                    l(h, n.eventclick, E), l(i, n.eventmove, w), l(i, n.eventend, x)
                }
            }, getDataAsync: function (e) {
                var t = this;
                this.store.count > 0 ? this.postData(function (n) {
                    n.data ? e && e(n) : e && e(t.dsData)
                }) : e && e(this.dsData)
            }, createDialogMask: function () {
                var e = this;
                e.maskDiv = document.createElement("div"), e.maskDiv.className = "vcode-mask hide", e.maskDiv.id = "vcode-mask" + this.num, document.body.appendChild(e.maskDiv)
            }, createDialogBody: function () {
                var e = this;
                e.bodyDiv = document.createElement("div"), e.bodyDiv.className = "vcode-body hide", e.bodyDiv.id = "vcode-body" + this.num, document.body.appendChild(e.bodyDiv)
            }, removeMask: function () {
                var e = this;
                document.body.removeChild(e.maskDiv), document.body.removeChild(e.bodyDiv), e.maskDiv = null, e.bodyDiv = null, e.removeVcodeEvent && e.removeVcodeEvent(), e.finish = !1, e.start = !1
            }, encrypt: function (e) {
                var t = this.store.nameL + this.store.nameR, n = PassMachine.CryptoJS.enc.Utf8.parse(t),
                    i = PassMachine.CryptoJS.enc.Utf8.parse(e), o = PassMachine.CryptoJS.AES.encrypt(i, n, {
                        mode: PassMachine.CryptoJS.mode.ECB,
                        padding: PassMachine.CryptoJS.pad.Pkcs7
                    });
                return o.toString()
            }, setData: function (e, t) {
                this.rzData[e] = t
            }, errorData: function () {
                this.dsData.ds = "iggkFNY5Z8odmaVWu0oRjsneNUhc65bBgY7IeyRqe6S++zbDz3JlV99QbnGMERCkRH57fRY77K4T0r5PTAk/Xoi21K1UoYgRM089xf8wdrl+FzMEwt13AaO5Dq4G0u5I49RTUPfwr4/MuB6b6hOcPwItorZarOJw+1yy7pp4LUUwmk1kqy5LXHQ2vXVRRIzBmEYkAd4LEMWB3TNN/Ehb/v2mIBHtw+V8prcJi637saZP2NZL2qVarc81Js3Ls1ICNon1ghv5Vly2IjvClAg1oFtLIYqQN5/lojRrg11ajOBnVkwrC/MbVsQ+paftGrOl9PHjBbRFq8+5LwAmVysU+83iZLMBC3M7NhKKlIiTJpvDAR+KrUAG1HP8GTH8L8mrVjuno9MIfX6oloTXcpZHfXZln2FwwTosFnTHZ0iaqdnCklq7W+xuSUyIYydL72/hi34W2QIyEh6PilSgac2Mgjh80ygOrj9hrR7+0rlc5c+cpeILmTUI3FNlzY0degKH81V3dYUSNO27zcZ2KG3Zxb4I5SCnxYbEigiJJQkemNNAT+GiX2Je2XR9Xivcn0pFkdxEReHb2uHStsvaCaI+AxmHXc8PBV6X6CdAtRtSLnA+NBYrRrVGBmZIQd112r6eSjJeO7R9ItEXpKnAb2jhyZ+dyBeQNYee3JeyNZpofxAsXyHLFkrKOqaceZBzhvxL9SZwADneJcVSYvLS9Fbf9RAo0FHHrAFjphDmLe3wPcIgyiAKnpvgw58Z13bY1LYKEM3QYt+U974GYlahfJpett38TeJSbfcn3f1sk1+Q00jb46ivKadXTztpkD0z++pKJtMCgc5pLJg40QLb6wbTpqa4wVULYnCouw6/9H5+COUDC0RKfLDhYzdcCCygSGlA", this.dsData.tk = "3338yojP4YX/CPjsNQpSEls3CchneKTLKfp9KvCfkBgWNCk="
            }, getDs: function () {
                return this.dsData.ds
            }, getTk: function () {
                return this.dsData.tk
            }, reportedOpportunity: function () {
                var e = this;
                ++e.store.count, e.store.count > e.store.countnum && e.postData()
            }
        }
    } catch (y) {
    }
}(window, document);