/*
 * JWW → DXF 変換器（JS版）
 * Python版 jww_to_dxf.py を移植
 */

const _JWW_TO_DXF_COLOR_JS = {
    0: 7, 1: 1, 2: 3, 3: 5, 4: 4, 5: 6, 6: 2, 7: 7, 8: 8
};

function jwwColorToDxf(pc) {
    return _JWW_TO_DXF_COLOR_JS[pc] !== undefined ? _JWW_TO_DXF_COLOR_JS[pc] : 7;
}

class DxfWriter {
    constructor() {
        this.lines = [];
        this.layers = new Map();
    }
    pair(code, value) {
        this.lines.push(String(code).padStart(3, ' '));
        if (typeof value === 'number' && !Number.isInteger(value)) {
            this.lines.push(value.toFixed(6));
        } else {
            this.lines.push(String(value));
        }
    }
    addLayer(name, color) {
        if (!this.layers.has(name)) this.layers.set(name, color);
    }

    writeHeader(extmin, extmax) {
        this.pair(0, 'SECTION'); this.pair(2, 'HEADER');
        this.pair(9, '$ACADVER'); this.pair(1, 'AC1009');
        this.pair(9, '$INSBASE');
        this.pair(10, 0.0); this.pair(20, 0.0); this.pair(30, 0.0);
        this.pair(9, '$EXTMIN');
        this.pair(10, extmin[0]); this.pair(20, extmin[1]); this.pair(30, 0.0);
        this.pair(9, '$EXTMAX');
        this.pair(10, extmax[0]); this.pair(20, extmax[1]); this.pair(30, 0.0);
        this.pair(9, '$LIMMIN');
        this.pair(10, extmin[0]); this.pair(20, extmin[1]);
        this.pair(9, '$LIMMAX');
        this.pair(10, extmax[0]); this.pair(20, extmax[1]);
        this.pair(9, '$DWGCODEPAGE'); this.pair(3, 'ANSI_932');
        this.pair(0, 'ENDSEC');
    }

    writeTables() {
        this.pair(0, 'SECTION'); this.pair(2, 'TABLES');

        this.pair(0, 'TABLE'); this.pair(2, 'LAYER');
        this.pair(70, this.layers.size + 1);
        this.pair(0, 'LAYER'); this.pair(2, '0');
        this.pair(70, 0); this.pair(62, 7); this.pair(6, 'CONTINUOUS');
        for (const [name, color] of this.layers) {
            this.pair(0, 'LAYER'); this.pair(2, name);
            this.pair(70, 0); this.pair(62, color); this.pair(6, 'CONTINUOUS');
        }
        this.pair(0, 'ENDTAB');

        this.pair(0, 'TABLE'); this.pair(2, 'STYLE');
        this.pair(70, 1);
        this.pair(0, 'STYLE'); this.pair(2, 'STANDARD');
        this.pair(70, 0); this.pair(40, 0.0); this.pair(41, 1.0);
        this.pair(50, 0.0); this.pair(71, 0); this.pair(42, 2.5);
        this.pair(3, 'MS Gothic'); this.pair(4, '');
        this.pair(0, 'ENDTAB');

        this.pair(0, 'ENDSEC');
    }

    writeBlocks() {
        this.pair(0, 'SECTION'); this.pair(2, 'BLOCKS');
        this.pair(0, 'ENDSEC');
    }

    line(x1,y1,x2,y2,layer,color) {
        this.pair(0,'LINE');this.pair(8,layer);this.pair(62,color);
        this.pair(10,x1);this.pair(20,y1);this.pair(30,0.0);
        this.pair(11,x2);this.pair(21,y2);this.pair(31,0.0);
    }
    circle(cx,cy,r,layer,color) {
        this.pair(0,'CIRCLE');this.pair(8,layer);this.pair(62,color);
        this.pair(10,cx);this.pair(20,cy);this.pair(30,0.0);
        this.pair(40,r);
    }
    arc(cx,cy,r,sd,ed,layer,color) {
        this.pair(0,'ARC');this.pair(8,layer);this.pair(62,color);
        this.pair(10,cx);this.pair(20,cy);this.pair(30,0.0);
        this.pair(40,r);this.pair(50,sd);this.pair(51,ed);
    }
    text(x,y,h,txt,rotDeg,layer,color,wf=1.0) {
        this.pair(0,'TEXT');this.pair(8,layer);this.pair(62,color);
        this.pair(10,x);this.pair(20,y);this.pair(30,0.0);
        this.pair(40,h);this.pair(1,txt);this.pair(50,rotDeg);
        if (wf !== 1.0) this.pair(41,wf);
        this.pair(7,'STANDARD');
    }
    point(x,y,layer,color) {
        this.pair(0,'POINT');this.pair(8,layer);this.pair(62,color);
        this.pair(10,x);this.pair(20,y);this.pair(30,0.0);
    }
    solid(p1,p2,p3,p4,layer,color) {
        this.pair(0,'SOLID');this.pair(8,layer);this.pair(62,color);
        this.pair(10,p1[0]);this.pair(20,p1[1]);this.pair(30,0.0);
        this.pair(11,p2[0]);this.pair(21,p2[1]);this.pair(31,0.0);
        this.pair(12,p3[0]);this.pair(22,p3[1]);this.pair(32,0.0);
        this.pair(13,p4[0]);this.pair(23,p4[1]);this.pair(33,0.0);
    }

    getText() {
        return this.lines.join('\n') + '\n';
    }
}

// Shift-JIS エンコード可能か判定
function _canEncodeSjis(ch) {
    const cp = ch.codePointAt(0);
    return window.JwwWriter._sjisMap ? window.JwwWriter._sjisMap.has(cp) : true;
}

function _sanitizeText(txt) {
    if (!window.JwwWriter._sjisMap) return txt;
    let r = '';
    for (const c of txt) {
        if (window.JwwWriter._sjisMap.has(c.codePointAt(0))) r += c;
        else r += '?';
    }
    return r;
}

// Shift-JISでバイト列に変換
function _toSjisBytes(text) {
    const out = [];
    for (const c of text) {
        const cp = c.codePointAt(0);
        if (cp === 0x0A) { out.push(0x0D, 0x0A); continue; }   // 改行はCRLF
        const b = window.JwwWriter._sjisMap?.get(cp);
        if (b) out.push(...b);
        else if (cp < 0x80) out.push(cp);
        else out.push(0x3F);
    }
    return new Uint8Array(out);
}

/**
 * JWWバイト → DXFバイト（Shift-JIS）
 * @param {Uint8Array} jwwBytes
 * @param {string} layerPrefix
 * @returns {{bytes: Uint8Array, info: object}}
 */
async function jwwToDxf(jwwBytes, layerPrefix = 'L') {
    // Shift-JISマップ初期化（jww_writerのものを流用）
    await window.JwwWriter.ensureSjisMap();
    // _sjisMapにアクセスできるよう露出させる
    if (!window.JwwWriter._sjisMap) {
        window.JwwWriter._sjisMap = await window.JwwWriter.ensureSjisMap();
    }

    const reader = new window.JwwReader(jwwBytes);
    const parsed = reader.parse();
    const figs = parsed.figs;
    const groupScales = parsed.groupScales;
    const scale = parsed.scale;

    const layerSet = new Set();
    for (const f of figs) {
        layerSet.add(`${f.glayer},${f.layer}`);
    }

    // 図形範囲（ARCは弧上サンプル）
    const xs = [], ys = [];
    for (const f of figs) {
        const sc = (0 <= f.glayer && f.glayer < 16) ? groupScales[f.glayer] : scale;
        if (f.type === 'LINE') {
            xs.push(f.x1*sc, f.x2*sc); ys.push(f.y1*sc, f.y2*sc);
        } else if (f.type === 'CIRCLE') {
            xs.push((f.cx-f.r)*sc, (f.cx+f.r)*sc);
            ys.push((f.cy-f.r)*sc, (f.cy+f.r)*sc);
        } else if (f.type === 'ARC') {
            for (const t of [0,0.25,0.5,0.75,1]) {
                const a = f.sa + f.sw * t;
                xs.push((f.cx + f.r*Math.cos(a))*sc);
                ys.push((f.cy + f.r*Math.sin(a))*sc);
            }
        } else if (f.type === 'TEXT') {
            xs.push(f.x1*sc, f.x2*sc); ys.push(f.y1*sc, f.y2*sc);
        } else if (f.type === 'POINT') {
            xs.push(f.x*sc); ys.push(f.y*sc);
        } else if (f.type === 'SOLID') {
            for (const k of ['p1','p2','p3','p4']) {
                xs.push(f[k][0]*sc); ys.push(f[k][1]*sc);
            }
        }
    }

    const extminRaw = [xs.length ? Math.min(...xs) : 0, ys.length ? Math.min(...ys) : 0];
    const extmaxRaw = [xs.length ? Math.max(...xs) : 0, ys.length ? Math.max(...ys) : 0];
    const shiftX = -extminRaw[0];
    const shiftY = -extminRaw[1];
    const newExtmin = [0.0, 0.0];
    const newExtmax = [extmaxRaw[0] - extminRaw[0], extmaxRaw[1] - extminRaw[1]];

    // DXF書き出し
    const w = new DxfWriter();
    const sortedLayers = Array.from(layerSet).map(s => s.split(',').map(Number)).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
    for (const [g,l] of sortedLayers) w.addLayer(`${layerPrefix}${g}-${l}`, 7);

    w.writeHeader(newExtmin, newExtmax);
    w.writeTables();
    w.writeBlocks();
    w.pair(0, 'SECTION'); w.pair(2, 'ENTITIES');

    const tx = x => x + shiftX;
    const ty = y => y + shiftY;

    for (const f of figs) {
        const g = f.glayer;
        const sc = (0 <= g && g < 16) ? groupScales[g] : scale;
        const layer = `${layerPrefix}${g}-${f.layer}`;
        const color = jwwColorToDxf(f.penColor);

        if (f.type === 'LINE') {
            w.line(tx(f.x1*sc), ty(f.y1*sc), tx(f.x2*sc), ty(f.y2*sc), layer, color);
        } else if (f.type === 'CIRCLE') {
            w.circle(tx(f.cx*sc), ty(f.cy*sc), f.r*sc, layer, color);
        } else if (f.type === 'ARC') {
            const sd = f.sa * 180/Math.PI;
            const ed = (f.sa + f.sw) * 180/Math.PI;
            w.arc(tx(f.cx*sc), ty(f.cy*sc), f.r*sc, sd, ed, layer, color);
        } else if (f.type === 'TEXT') {
            const h = f.size_y * sc;
            const wf = (f.size_y > 0) ? f.size_x / f.size_y : 1.0;
            w.text(tx(f.x1*sc), ty(f.y1*sc), h, _sanitizeText(f.text),
                   f.kakudo, layer, color, wf);
        } else if (f.type === 'POINT') {
            w.point(tx(f.x*sc), ty(f.y*sc), layer, color);
        } else if (f.type === 'SOLID') {
            const p1 = [tx(f.p1[0]*sc), ty(f.p1[1]*sc)];
            const p2 = [tx(f.p2[0]*sc), ty(f.p2[1]*sc)];
            const p3 = [tx(f.p3[0]*sc), ty(f.p3[1]*sc)];
            const p4 = [tx(f.p4[0]*sc), ty(f.p4[1]*sc)];
            w.solid(p1, p2, p4, p3, layer, color);
        }
    }

    w.pair(0, 'ENDSEC');
    w.pair(0, 'EOF');

    const text = w.getText();
    const bytes = _toSjisBytes(text);
    return {
        bytes,
        info: {
            scale, figCount: figs.length, layerCount: layerSet.size,
            extmin: newExtmin, extmax: newExtmax,
            skipped: parsed.skipped, outputBytes: bytes.length,
        }
    };
}

window.JwwToDxf = { jwwToDxf, jwwColorToDxf, DxfWriter, toSjisBytes: _toSjisBytes };
