/*
 * DXF Parser - Minimal ASCII DXF reader
 *
 * 対応: HEADER($EXTMIN/$EXTMAX/$DWGCODEPAGE), LAYERテーブル, ENTITIES（LINE/CIRCLE/ARC/
 *      TEXT/MTEXT/POINT/LWPOLYLINE/POLYLINE/INSERT/HATCH/SOLID）, BLOCKS定義
 *
 * 文字コード: ヘッダの$DWGCODEPAGEを見てShift-JIS/UTF-8を自動判定
 */

// ─────────────────────────────────────────
// Shift-JISデコード（DXFがcp932の場合）
// ─────────────────────────────────────────
function decodeBytes(uint8) {
    // UTF-8で試す→失敗ならShift-JIS
    try {
        const utf8 = new TextDecoder('utf-8', {fatal: true}).decode(uint8);
        return utf8;
    } catch (e) {
        return new TextDecoder('shift_jis').decode(uint8);
    }
}

// ─────────────────────────────────────────
// DXFはペア行構造: 偶数行=グループコード(数字)、奇数行=値
// ─────────────────────────────────────────
class DxfParser {
    constructor(text) {
        // 改行で分割。\r\nと\nの両対応、行頭/末の空白除去
        this.lines = text.split(/\r?\n/).map(l => l.trim());
        this.pos = 0;
    }
    eof() { return this.pos >= this.lines.length - 1; }

    // 次のペア (code, value) を取得。EOFなら null
    nextPair() {
        if (this.pos + 1 >= this.lines.length) return null;
        const codeStr = this.lines[this.pos];
        const value = this.lines[this.pos + 1];
        this.pos += 2;
        const code = parseInt(codeStr, 10);
        if (isNaN(code)) return null;
        return [code, value];
    }

    // ペアを戻す
    pushBack() { this.pos -= 2; }

    // 指定SECTIONの開始までスキップ
    skipToSection(name) {
        this.pos = 0;
        while (!this.eof()) {
            const pair = this.nextPair();
            if (!pair) break;
            if (pair[0] === 0 && pair[1] === 'SECTION') {
                const np = this.nextPair();
                if (np && np[0] === 2 && np[1] === name) return true;
            }
        }
        return false;
    }
}

// ─────────────────────────────────────────
// エンティティ集合の読込（共通: 0 ENDSECで終了）
// ─────────────────────────────────────────
function readEntities(parser, untilSequend = false) {
    const ents = [];
    while (!parser.eof()) {
        const pair = parser.nextPair();
        if (!pair) break;
        if (pair[0] === 0) {
            const type = pair[1];
            if (type === 'ENDSEC' || type === 'ENDBLK') { parser.pushBack(); break; }
            if (untilSequend && type === 'SEQEND') { parser.pushBack(); break; }
            const ent = readEntityBody(parser, type);
            if (ent) ents.push(ent);
        }
    }
    return ents;
}

// 単一エンティティ本体を読む（次の 0 まで）
function readEntityBody(parser, type) {
    const ent = { type, vertices: [] };
    // HATCH/POLYLINE/SOLIDの頂点配列管理
    let polyCur = null;
    while (!parser.eof()) {
        const pair = parser.nextPair();
        if (!pair) break;
        const [code, val] = pair;
        if (code === 0) { parser.pushBack(); break; }
        // 共通属性
        if (code === 8) ent.layer = val;
        else if (code === 62) ent.color = parseInt(val, 10);
        else if (code === 10) {
            if (type === 'LWPOLYLINE' || type === 'HATCH') {
                if (polyCur !== null) ent.vertices.push(polyCur);
                polyCur = { x: parseFloat(val), y: 0 };
            } else ent.x = parseFloat(val);
        }
        else if (code === 20) {
            if (type === 'LWPOLYLINE' || type === 'HATCH') { if (polyCur) polyCur.y = parseFloat(val); }
            else ent.y = parseFloat(val);
        }
        else if (code === 11) ent.x2 = parseFloat(val);
        else if (code === 21) ent.y2 = parseFloat(val);
        else if (code === 40) ent.r = parseFloat(val);  // 半径 / 文字高さ
        else if (code === 41) {
            if (type === 'INSERT') ent.xScale = parseFloat(val);
            else ent.widthFactor = parseFloat(val);    // TEXT/MTEXTの横倍率
        }
        else if (code === 42) {
            if (type === 'INSERT') ent.yScale = parseFloat(val);
        }
        else if (code === 50) {
            if (type === 'INSERT') ent.rotation = parseFloat(val);
            else if (type === 'TEXT' || type === 'MTEXT') ent.rot = parseFloat(val);
            else ent.startAngle = parseFloat(val);     // ARCの開始角
        }
        else if (code === 51) ent.endAngle = parseFloat(val);
        else if (code === 1)  ent.text = val;
        else if (code === 2)  ent.name = val;        // BLOCK名 / INSERT参照名
        else if (code === 7)  ent.style = val;
        else if (code === 70) ent.flags = parseInt(val, 10);
        else if (code === 72) ent.flags72 = parseInt(val, 10);
        else if (code === 73) ent.flags73 = parseInt(val, 10);
        else if (code === 91) ent.pathCount = parseInt(val, 10);  // HATCH
    }
    if ((type === 'LWPOLYLINE' || type === 'HATCH') && polyCur) ent.vertices.push(polyCur);
    return ent;
}

// ─────────────────────────────────────────
// HEADERセクション読込（$EXTMIN/$EXTMAX）
// ─────────────────────────────────────────
function readHeader(parser) {
    const hdr = {};
    let currentVar = null;
    while (!parser.eof()) {
        const pair = parser.nextPair();
        if (!pair) break;
        const [code, val] = pair;
        if (code === 0 && val === 'ENDSEC') { parser.pushBack(); break; }
        if (code === 9) { currentVar = val; hdr[val] = {}; }
        else if (currentVar) {
            if (code === 10) hdr[currentVar].x = parseFloat(val);
            else if (code === 20) hdr[currentVar].y = parseFloat(val);
            else if (code === 30) hdr[currentVar].z = parseFloat(val);
            else if (code === 1 || code === 3) hdr[currentVar].text = val;
            else if (code === 70) hdr[currentVar].i = parseInt(val, 10);
        }
    }
    return hdr;
}

// ─────────────────────────────────────────
// TABLESセクションからLAYER色を取得
// ─────────────────────────────────────────
function readLayers(parser) {
    const layers = {};
    while (!parser.eof()) {
        const pair = parser.nextPair();
        if (!pair) break;
        const [code, val] = pair;
        if (code === 0 && val === 'ENDSEC') { parser.pushBack(); break; }
        if (code === 0 && val === 'LAYER') {
            const layer = {};
            while (!parser.eof()) {
                const p = parser.nextPair();
                if (!p) break;
                if (p[0] === 0) { parser.pushBack(); break; }
                if (p[0] === 2) layer.name = p[1];
                else if (p[0] === 62) layer.color = parseInt(p[1], 10);
            }
            if (layer.name) layers[layer.name] = layer;
        }
    }
    return layers;
}

// ─────────────────────────────────────────
// BLOCKSセクション
// ─────────────────────────────────────────
function readBlocks(parser) {
    const blocks = {};
    while (!parser.eof()) {
        const pair = parser.nextPair();
        if (!pair) break;
        const [code, val] = pair;
        if (code === 0 && val === 'ENDSEC') { parser.pushBack(); break; }
        if (code === 0 && val === 'BLOCK') {
            const block = { entities: [], base_x: 0, base_y: 0 };
            // BLOCKヘッダ読み取り
            while (!parser.eof()) {
                const p = parser.nextPair();
                if (!p) break;
                if (p[0] === 0) { parser.pushBack(); break; }
                if (p[0] === 2) block.name = p[1];
                else if (p[0] === 10) block.base_x = parseFloat(p[1]);
                else if (p[0] === 20) block.base_y = parseFloat(p[1]);
            }
            // ブロック内エンティティ
            while (!parser.eof()) {
                const p = parser.nextPair();
                if (!p) break;
                if (p[0] === 0 && p[1] === 'ENDBLK') {
                    // ENDBLK本体の続きを読み飛ばす
                    while (!parser.eof()) {
                        const pp = parser.nextPair();
                        if (!pp) break;
                        if (pp[0] === 0) { parser.pushBack(); break; }
                    }
                    break;
                }
                if (p[0] === 0) {
                    const ent = readEntityBody(parser, p[1]);
                    if (ent) block.entities.push(ent);
                }
            }
            if (block.name) blocks[block.name] = block;
        }
    }
    return blocks;
}

// ─────────────────────────────────────────
// 公開: DXF全体パース
// ─────────────────────────────────────────
function parseDxf(text) {
    const result = { header: {}, layers: {}, blocks: {}, entities: [] };

    // HEADER
    let p = new DxfParser(text);
    if (p.skipToSection('HEADER')) {
        result.header = readHeader(p);
    }
    // TABLES → LAYER
    p = new DxfParser(text);
    if (p.skipToSection('TABLES')) {
        while (!p.eof()) {
            const pair = p.nextPair();
            if (!pair) break;
            if (pair[0] === 0 && pair[1] === 'ENDSEC') break;
            if (pair[0] === 0 && pair[1] === 'TABLE') {
                const np = p.nextPair();
                if (np && np[0] === 2 && np[1] === 'LAYER') {
                    result.layers = readLayers(p);
                }
            }
        }
    }
    // BLOCKS
    p = new DxfParser(text);
    if (p.skipToSection('BLOCKS')) {
        result.blocks = readBlocks(p);
    }
    // ENTITIES
    p = new DxfParser(text);
    if (p.skipToSection('ENTITIES')) {
        result.entities = readEntities(p);
    }
    return result;
}

window.DxfParser = { parseDxf, decodeBytes };
