/*
 * JWW Writer - MFC CArchive互換のJWWバイナリ書き出しエンジン
 * Python版jww_poc.pyを移植。仕様は正解JWWとのバイト一致で実証済み。
 *
 * 公開クラス:
 *   JwwArchive : シリアライズ用バッファ
 *   CDataSen / CDataEnko / CDataTen / CDataMoji / CDataSolid : 図形
 */

const SCHEMA = 700;            // JW_DATA_VERSION
const SHIFT_JIS_ENCODER = null; // 後でTextEncoderの代替で実装

// ─────────────────────────────────────────
// バイト列ビルダー（自動拡張、リトルエンディアン）
// ─────────────────────────────────────────
class ByteBuilder {
    constructor() {
        this.buf = new Uint8Array(4096);
        this.len = 0;
    }
    _ensure(n) {
        while (this.len + n > this.buf.length) {
            const nb = new Uint8Array(this.buf.length * 2);
            nb.set(this.buf);
            this.buf = nb;
        }
    }
    u8(v)  { this._ensure(1); this.buf[this.len++] = v & 0xFF; }
    u16(v) { this._ensure(2); const d=new DataView(this.buf.buffer); d.setUint16(this.len, v, true); this.len += 2; }
    u32(v) { this._ensure(4); const d=new DataView(this.buf.buffer); d.setUint32(this.len, v >>> 0, true); this.len += 4; }
    f64(v) { this._ensure(8); const d=new DataView(this.buf.buffer); d.setFloat64(this.len, v, true); this.len += 8; }
    raw(arr) {
        this._ensure(arr.length);
        this.buf.set(arr, this.len);
        this.len += arr.length;
    }
    bytes() { return this.buf.subarray(0, this.len); }
}

// ─────────────────────────────────────────
// Shift-JIS エンコード（JWWの文字列はcp932）
// ブラウザ標準のTextEncoderはUTF-8のみなので、JISマップを使う
// ─────────────────────────────────────────
let _sjisMap = null;          // 'あ'.codePointAt(0) → [b1,b2] or [b]
async function ensureSjisMap() {
    if (_sjisMap) {
        window.JwwWriter._sjisMap = _sjisMap;
        return _sjisMap;
    }
    // 動的構築: Unicode→Shift_JISの対応表をフェッチで取得するのが理想だが、
    // ブラウザのTextDecoderはShift_JISをデコードできるので、その逆引きを作る
    _sjisMap = new Map();
    const dec = new TextDecoder('shift_jis');
    // 1バイト範囲（半角）
    for (let b = 0; b < 0x80; b++) {
        const ch = dec.decode(new Uint8Array([b]));
        if (ch && ch.length === 1) _sjisMap.set(ch.codePointAt(0), [b]);
    }
    for (let b = 0xA1; b <= 0xDF; b++) {       // 半角カナ
        const ch = dec.decode(new Uint8Array([b]));
        if (ch && ch.length === 1) _sjisMap.set(ch.codePointAt(0), [b]);
    }
    // 2バイト範囲
    for (let b1 = 0x81; b1 <= 0xFC; b1++) {
        if (b1 >= 0xA0 && b1 <= 0xDF) continue;
        for (let b2 = 0x40; b2 <= 0xFC; b2++) {
            if (b2 === 0x7F) continue;
            const ch = dec.decode(new Uint8Array([b1, b2]));
            if (ch && ch.length === 1 && ch.charCodeAt(0) !== 0xFFFD) {
                _sjisMap.set(ch.codePointAt(0), [b1, b2]);
            }
        }
    }
    window.JwwWriter._sjisMap = _sjisMap;
    return _sjisMap;
}

function encodeSjis(str) {
    if (!_sjisMap) throw new Error("encodeSjis: ensureSjisMap()を先に呼ぶ必要があります");
    const out = [];
    for (const ch of str) {
        const cp = ch.codePointAt(0);
        const bytes = _sjisMap.get(cp);
        if (bytes) out.push(...bytes);
        else out.push(0x3F);                   // 表外文字は'?'
    }
    return new Uint8Array(out);
}

// ─────────────────────────────────────────
// JwwArchive: CArchive互換のオブジェクト/クラス管理
// ─────────────────────────────────────────
class JwwArchive {
    constructor() {
        this.b = new ByteBuilder();
        this.classMap = new Map();             // className → index
        this.mapCount = 1;                     // wClassTagインデックス（1から）
    }
    // 基本書き込み
    u8(v)  { this.b.u8(v); }
    u16(v) { this.b.u16(v); }
    u32(v) { this.b.u32(v); }
    f64(v) { this.b.f64(v); }
    raw(arr) { this.b.raw(arr); }

    // CString（BYTE-first形式）
    wCString(s) {
        const bytes = encodeSjis(s);
        const n = bytes.length;
        if (n < 0xFF) {
            this.u8(n);
        } else if (n < 0xFFFE) {
            this.u8(0xFF); this.u16(n);
        } else {
            this.u8(0xFF); this.u16(0xFFFE); this.u32(n);
        }
        this.raw(bytes);
    }

    // WriteCount（WORD-first形式）
    wCount(n) {
        if (n < 0xFFFE) this.u16(n);
        else { this.u16(0xFFFE); this.u32(n); }
    }

    // クラスタグ書き込み（新規 or 参照）
    _writeClass(name) {
        if (this.classMap.has(name)) {
            const idx = this.classMap.get(name);
            this.u16(0x8000 | idx);
            this.mapCount += 1;
        } else {
            this.u16(0xFFFF);
            this.u16(SCHEMA);
            // ASCIIクラス名（length:WORD + ASCII bytes）
            this.u16(name.length);
            for (let i = 0; i < name.length; i++) this.u8(name.charCodeAt(i));
            this.classMap.set(name, this.mapCount);
            this.mapCount += 1;
            this.mapCount += 1;                // オブジェクト本体分
        }
    }

    // オブジェクトを書き込む（クラスタグ+本体）
    wObject(obj) {
        this._writeClass(obj.CLASS_NAME);
        obj.serialize(this);
    }

    bytes() { return this.b.bytes(); }
}

// ─────────────────────────────────────────
// 図形クラス
// ─────────────────────────────────────────
class CData {
    constructor() {
        this.lGroup = 0;
        this.penStyle = 1;
        this.penColor = 1;
        this.penWidth = 0;
        this.layer = 0;
        this.glayer = 0;
        this.flg = 0;
    }
    _base(ar) {
        ar.u32(this.lGroup);
        ar.u8(this.penStyle);
        ar.u16(this.penColor);
        ar.u16(this.penWidth);
        ar.u16(this.layer);
        ar.u16(this.glayer);
        ar.u16(this.flg);
    }
}

class CDataSen extends CData {
    constructor(x1, y1, x2, y2) { super(); this.CLASS_NAME = "CDataSen";
        this.x1=x1; this.y1=y1; this.x2=x2; this.y2=y2; }
    serialize(ar) {
        this._base(ar);
        ar.f64(this.x1); ar.f64(this.y1); ar.f64(this.x2); ar.f64(this.y2);
    }
}

class CDataEnko extends CData {
    constructor(cx, cy, r, startAng, sweepAng) { super(); this.CLASS_NAME = "CDataEnko";
        this.cx=cx; this.cy=cy; this.r=r;
        this.startAng=startAng; this.sweepAng=sweepAng;
        this.ryRatio = 1.0;       // 半径Y比（楕円用、円は1.0）
        this.tilt = 0.0;          // 傾き
        this.zen_en = (Math.abs(sweepAng - 2*Math.PI) < 1e-9) ? 1 : 0;  // 全円フラグ
    }
    serialize(ar) {
        this._base(ar);
        ar.f64(this.cx); ar.f64(this.cy); ar.f64(this.r);
        ar.f64(this.startAng); ar.f64(this.sweepAng);
        ar.f64(this.ryRatio); ar.f64(this.tilt);
        ar.u32(this.zen_en);
    }
}

class CDataTen extends CData {
    constructor(x, y) { super(); this.CLASS_NAME = "CDataTen";
        this.x=x; this.y=y; }
    serialize(ar) {
        this._base(ar);
        ar.f64(this.x); ar.f64(this.y);
        ar.u32(0);
    }
}

class CDataMoji extends CData {
    constructor(x1, y1, x2, y2, text, opts={}) {
        super();
        this.CLASS_NAME = "CDataMoji";
        this.x1=x1; this.y1=y1; this.x2=x2; this.y2=y2;
        this.moji_shu = opts.moji_shu ?? 1;
        this.size_x  = opts.size_x ?? 3.0;
        this.size_y  = opts.size_y ?? 3.0;
        this.kankaku = opts.kankaku ?? 0.0;
        this.kakudo  = opts.kakudo ?? 0.0;
        this.font    = opts.font ?? "ＭＳ ゴシック";
        this.text    = text;
    }
    serialize(ar) {
        this._base(ar);
        ar.f64(this.x1); ar.f64(this.y1); ar.f64(this.x2); ar.f64(this.y2);
        ar.u32(this.moji_shu);
        ar.f64(this.size_x); ar.f64(this.size_y);
        ar.f64(this.kankaku); ar.f64(this.kakudo);
        ar.wCString(this.font);
        ar.wCString(this.text);
    }
}

class CDataSolid extends CData {
    constructor(x1,y1, x2,y2, x3,y3, x4=null, y4=null) {
        super();
        this.CLASS_NAME = "CDataSolid";
        this.x1=x1; this.y1=y1; this.x2=x2; this.y2=y2;
        this.x3=x3; this.y3=y3;
        this.x4=(x4!==null)?x4:x3; this.y4=(y4!==null)?y4:y3;
    }
    serialize(ar) {
        this._base(ar);
        ar.f64(this.x1); ar.f64(this.y1);
        ar.f64(this.x2); ar.f64(this.y2);
        ar.f64(this.x3); ar.f64(this.y3);
        ar.f64(this.x4); ar.f64(this.y4);
        // penColor==10のRGB任意色はMVPでは未対応（必要なら追加）
    }
}

// ─────────────────────────────────────────
// JWW組み立て（ヘッダ + 図形リスト + フッタ）
// ─────────────────────────────────────────
async function buildJww(headerTemplateBytes, entities, scaleDenom, zumenSize) {
    await ensureSjisMap();

    // ヘッダの縮尺・用紙サイズを書き換え
    const header = new Uint8Array(headerTemplateBytes);   // コピー
    const dv = new DataView(header.buffer);

    // p=12: "JwwData."(8)+ver(4) 直後
    let p = 12;
    const memoLen = header[p]; p += 1 + memoLen;          // メモ(CString, BYTE-first)
    dv.setUint32(p, zumenSize, true); p += 4;             // 図面サイズ
    p += 4;                                                // 書込レイヤG
    for (let g = 0; g < 16; g++) {                         // 16グループ × 148B
        // state(4) + wlay(4) + scale(8) + prot(4) + 16*(4+4)
        dv.setFloat64(p + 8, scaleDenom, true);            // 縮尺(double)
        p += 148;
    }

    // アーカイブ組み立て
    const ar = new JwwArchive();
    ar.raw(header);
    ar.wCount(entities.length);
    for (const obj of entities) {
        ar.wObject(obj);
    }
    ar.wCount(0);                                          // ブロック定義リスト
    ar.u32(0);                                             // 同梱画像個数

    return ar.bytes();
}

// ─────────────────────────────────────────
// エクスポート
// ─────────────────────────────────────────
window.JwwWriter = {
    JwwArchive,
    CDataSen, CDataEnko, CDataTen, CDataMoji, CDataSolid,
    buildJww,
    ensureSjisMap,
    encodeSjis,
};
