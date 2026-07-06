/*
 * JWW Reader (JS版) - MFC CArchiveバイナリJWWの読込
 * Python版 jww_reader.py を移植
 */

// CString読み飛ばし（位置だけ進める）
function _skipCString(data, p) {
    let n = data[p]; p += 1;
    if (n === 0xFF) {
        n = (data[p] | (data[p+1] << 8)); p += 2;
        if (n === 0xFFFF) {
            n = (data[p] | (data[p+1]<<8) | (data[p+2]<<16) | (data[p+3]<<24)) >>> 0;
            p += 4;
        }
    }
    return p + n;
}

// JWWヘッダ長を計算
function _headerLength(data) {
    let p = 12;
    p = _skipCString(data, p);
    p += 4 + 4;
    for (let g = 0; g < 16; g++) p += 4+4+8+4 + 16*(4+4);
    p += 14*4 + 5*4 + 4 + 4 + 8*2 + 8 + 4 + 4 + 8 + 8*2 + 8*2;
    for (let i = 0; i < 256; i++) p = _skipCString(data, p);
    for (let i = 0; i < 16; i++) p = _skipCString(data, p);
    p += 8+8+4+8 + 8+8 + 4 + 8*3 + 8*3 + (8+8+8+4)*8;
    p += 8*3+4+8*2+8+4 + 10*8 + 8 + 10*8 + 10*16 + 8*16 + 5*20 + 4*16;
    p += 11*4 + 4 + 4 + 4*3 + 8*2 + 8*2 + 8 + 8 + 8*2 + 8 + 4*2;
    p += 257*8;
    for (let i = 0; i < 257; i++) {
        p = _skipCString(data, p);
        p += 4+4+8;
    }
    p += 33*16;
    for (let i = 0; i < 33; i++) {
        p = _skipCString(data, p);
        p += 4 + 10*8;
    }
    p += 10*28 + 8*3+4*2 + 8*2 + 4 + 8*6;
    return p;
}

class JwwReader {
    constructor(bytes) {
        this.data = bytes;
        this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        this.p = 0;
        this.dec = new TextDecoder('shift_jis');
    }
    u8()  { return this.data[this.p++]; }
    u16() { const v = this.view.getUint16(this.p, true); this.p += 2; return v; }
    u32() { const v = this.view.getUint32(this.p, true); this.p += 4; return v; }
    f64() { const v = this.view.getFloat64(this.p, true); this.p += 8; return v; }
    fns(n) {
        const r = [];
        for (let i = 0; i < n; i++) r.push(this.f64());
        return r;
    }
    cstring() {
        let n = this.u8();
        if (n === 0xFF) {
            n = this.u16();
            if (n === 0xFFFF) n = this.u32();
        }
        const b = this.data.subarray(this.p, this.p + n);
        this.p += n;
        return this.dec.decode(b);
    }
    readCount() {
        let n = this.u16();
        if (n === 0xFFFE) n = this.u32();
        return n;
    }

    parse() {
        // ヘッダから縮尺・図面サイズを取得
        this.p = 8;
        const version = this.u32();
        const memo = this.cstring();
        const zumen = this.u32();
        const writeGlayer = this.u32();
        const groupScales = [];
        for (let g = 0; g < 16; g++) {
            this.u32(); this.u32();          // state, wlay
            groupScales.push(this.f64());    // 縮尺
            this.u32();                       // prot
            this.p += 16 * (4+4);             // 16レイヤ
        }
        // ヘッダ末尾へジャンプ
        this.p = _headerLength(this.data);
        const count = this.readCount();

        const classMap = new Map();
        let mc = 1;
        const robj = () => {
            const tag = this.u16();
            let name;
            if (tag === 0xFFFF) {
                this.u16();
                const nl = this.u16();
                let s = '';
                for (let i = 0; i < nl; i++) s += String.fromCharCode(this.data[this.p++]);
                name = s;
                classMap.set(mc, name); mc += 1;
            } else if (tag & 0x8000) {
                name = classMap.get(tag & 0x7FFF) || '?';
            } else {
                name = classMap.get(tag) || `o${tag}`;
            }
            mc += 1;
            return name;
        };

        const figs = [];
        const skipped = [];
        for (let i = 0; i < count; i++) {
            const name = robj();
            const base = {
                lgrp: this.u32(),
                penStyle: this.u8(),
                penColor: this.u16(),
                penWidth: this.u16(),
                layer: this.u16(),
                glayer: this.u16(),
                flg: this.u16(),
            };
            try {
                if (name === 'CDataSen') {
                    const [x1,y1,x2,y2] = this.fns(4);
                    figs.push({ type: 'LINE', x1, y1, x2, y2, ...base });
                } else if (name === 'CDataEnko') {
                    const [cx,cy,r,sa,sw,ry,tilt] = this.fns(7);
                    const zen = this.u32();
                    figs.push({ type: zen ? 'CIRCLE' : 'ARC', cx, cy, r, sa, sw, ...base });
                } else if (name === 'CDataTen') {
                    const [x,y] = this.fns(2);
                    this.u32();
                    figs.push({ type: 'POINT', x, y, ...base });
                } else if (name === 'CDataMoji') {
                    const [x1,y1,x2,y2] = this.fns(4);
                    const ms = this.u32();
                    const [sx, sy, kk, kd] = this.fns(4);
                    const font = this.cstring();
                    const text = this.cstring();
                    figs.push({ type: 'TEXT', x1, y1, x2, y2,
                        size_x: sx, size_y: sy, kakudo: kd, kankaku: kk,
                        font, text, ...base });
                } else if (name === 'CDataSolid') {
                    const c = this.fns(8);
                    if (base.penColor === 10) this.u32();
                    figs.push({ type: 'SOLID',
                        p1:[c[0],c[1]], p2:[c[2],c[3]], p3:[c[4],c[5]], p4:[c[6],c[7]],
                        ...base });
                } else {
                    skipped.push({ index: i, class: name });
                    break;
                }
            } catch (e) {
                skipped.push({ index: i, class: name, error: e.message });
                break;
            }
        }

        return {
            zumen, scale: groupScales[0] || 1.0,
            groupScales, figs, skipped, count
        };
    }
}

window.JwwReader = JwwReader;
