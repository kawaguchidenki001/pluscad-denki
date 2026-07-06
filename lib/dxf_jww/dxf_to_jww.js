/*
 * DXF→JWW 変換ロジック
 * Python版 dxf_to_jww.py を移植
 */

// 標準縮尺（Python版と同じ）
const STD_SCALES = [1, 2, 2.5, 3, 4, 5, 6, 10, 20, 25, 30, 40, 50, 60,
    100, 200, 250, 300, 400, 500, 600,
    1000, 2000, 2500, 3000, 4000, 5000, 6000,
    10000, 20000, 50000, 100000];

// 縮尺自動判定
function autoScale(extmin, extmax, paperW = 420.0, paperH = 297.0) {
    if (!extmin || !extmax) return 100;
    const w = Math.abs(extmax.x - extmin.x);
    const h = Math.abs(extmax.y - extmin.y);
    if (w === 0 || h === 0) return 100;
    const need = Math.max(w / paperW, h / paperH);
    for (const s of STD_SCALES) if (s >= need) return s;
    return STD_SCALES[STD_SCALES.length - 1];
}

// DXF Color Index → JWW線色(1〜8)
function jwwColor(dxfColor) {
    if (dxfColor === null || dxfColor === undefined || dxfColor === 0 || dxfColor === 256) return 1;
    if (dxfColor >= 1 && dxfColor <= 8) return dxfColor;
    return ((Math.floor(dxfColor) - 1) % 8) + 1;
}

// レイヤ自動マッピング（出現順に16グループ×16レイヤ）
class LayerMapper {
    constructor() { this.map = new Map(); }
    get(name) {
        if (!this.map.has(name)) {
            const idx = this.map.size;
            if (idx <= 255) this.map.set(name, [idx >> 4, idx & 0xF]);
            else this.map.set(name, [15, 15]);
        }
        return this.map.get(name);
    }
}

// ─────────────────────────────────────────
// メイン変換: DXFパース結果 → CData配列
// ─────────────────────────────────────────
function convertEntities(dxfDoc, scaleDenom) {
    const W = window.JwwWriter;
    const lm = new LayerMapper();

    // 座標オフセット: $EXT中心 を用紙原点へ
    const emin = dxfDoc.header.$EXTMIN || { x: 0, y: 0 };
    const emax = dxfDoc.header.$EXTMAX || { x: 0, y: 0 };
    const ox = (emin.x + emax.x) / 2;
    const oy = (emin.y + emax.y) / 2;
    const fig = v => v / scaleDenom;
    const fx = v => (v - ox) / scaleDenom;
    const fy = v => (v - oy) / scaleDenom;

    // レイヤ色を解決
    function resolveColor(e) {
        let c = e.color;
        if (c === undefined || c === null || c === 0 || c === 256) {
            const lay = dxfDoc.layers[e.layer];
            c = lay ? lay.color : 7;
        }
        return jwwColor(c);
    }
    function addBase(obj, e) {
        const [g, l] = lm.get(e.layer || '0');
        obj.glayer = g;
        obj.layer = l;
        obj.penColor = resolveColor(e);
        return obj;
    }

    const ents = [];
    const stats = {};

    // INSERTの再帰展開用: ブロック内エンティティを変換時に座標変換
    function transformPoint(x, y, ins) {
        // 倍率 → 回転 → 移動
        const sx = ins.xScale ?? 1;
        const sy = ins.yScale ?? 1;
        const rot = (ins.rotation ?? 0) * Math.PI / 180;
        const cs = Math.cos(rot), sn = Math.sin(rot);
        let X = x * sx;
        let Y = y * sy;
        const X2 = X * cs - Y * sn;
        const Y2 = X * sn + Y * cs;
        return [X2 + ins.x, Y2 + ins.y];
    }
    function transformAngle(a, ins) {
        return a + (ins.rotation ?? 0) * Math.PI / 180;
    }

    function convertEntity(e, parentInsert = null, isTop = true) {
        if (isTop) stats[e.type] = (stats[e.type] || 0) + 1;
        try {
            const xf = parentInsert ? (px, py) => transformPoint(px, py, parentInsert) : (px, py) => [px, py];
            const aXf = parentInsert ? a => transformAngle(a, parentInsert) : a => a;
            const sScale = parentInsert ? ((parentInsert.xScale ?? 1) + (parentInsert.yScale ?? 1)) / 2 : 1;

            switch (e.type) {
                case 'LINE': {
                    const [x1, y1] = xf(e.x || 0, e.y || 0);
                    const [x2, y2] = xf(e.x2 || 0, e.y2 || 0);
                    ents.push(addBase(new W.CDataSen(fx(x1), fy(y1), fx(x2), fy(y2)),
                        { layer: e.layer || parentInsert?.layer, color: e.color }));
                    break;
                }
                case 'CIRCLE': {
                    const [cx, cy] = xf(e.x || 0, e.y || 0);
                    const r = (e.r || 0) * sScale;
                    const o = new W.CDataEnko(fx(cx), fy(cy), fig(r), 0.0, 2 * Math.PI);
                    o.zen_en = 1;
                    ents.push(addBase(o, { layer: e.layer || parentInsert?.layer, color: e.color }));
                    break;
                }
                case 'ARC': {
                    const [cx, cy] = xf(e.x || 0, e.y || 0);
                    const r = (e.r || 0) * sScale;
                    const sa = aXf((e.startAngle || 0) * Math.PI / 180);
                    const ea = aXf((e.endAngle || 0) * Math.PI / 180);
                    let sweep = (ea - sa) % (2 * Math.PI);
                    if (sweep < 0) sweep += 2 * Math.PI;
                    const o = new W.CDataEnko(fx(cx), fy(cy), fig(r), sa, sweep);
                    o.zen_en = 0;
                    ents.push(addBase(o, { layer: e.layer || parentInsert?.layer, color: e.color }));
                    break;
                }
                case 'LWPOLYLINE':
                case 'POLYLINE': {
                    const verts = e.vertices || [];
                    if (verts.length < 2) break;
                    const closed = (e.flags & 1) === 1;
                    const segs = [];
                    for (let i = 0; i < verts.length - 1; i++) segs.push([verts[i], verts[i + 1]]);
                    if (closed && verts.length > 2) segs.push([verts[verts.length - 1], verts[0]]);
                    for (const [a, b] of segs) {
                        const [x1, y1] = xf(a.x, a.y);
                        const [x2, y2] = xf(b.x, b.y);
                        ents.push(addBase(new W.CDataSen(fx(x1), fy(y1), fx(x2), fy(y2)),
                            { layer: e.layer || parentInsert?.layer, color: e.color }));
                    }
                    break;
                }
                case 'TEXT': {
                    const [x, y] = xf(e.x || 0, e.y || 0);
                    const h = (e.r || 0) * sScale;
                    const txt = e.text || '';
                    const wf = e.widthFactor || 1.0;
                    const size = fig(h);
                    const sx = size * wf;
                    const sy = size;
                    const rot = e.rot || 0;  // DXF 50で取れるはずだが現状未対応
                    const x2 = fx(x) + txt.length * sx;
                    const o = new W.CDataMoji(fx(x), fy(y), x2, fy(y), txt,
                        { size_x: sx, size_y: sy, kakudo: rot, font: "ＭＳ ゴシック" });
                    ents.push(addBase(o, { layer: e.layer || parentInsert?.layer, color: e.color }));
                    break;
                }
                case 'POINT': {
                    const [x, y] = xf(e.x || 0, e.y || 0);
                    ents.push(addBase(new W.CDataTen(fx(x), fy(y)),
                        { layer: e.layer || parentInsert?.layer, color: e.color }));
                    break;
                }
                case 'INSERT': {
                    const block = dxfDoc.blocks[e.name];
                    if (!block) break;
                    // INSERTの属性をブロック内の座標変換用に
                    const ins = {
                        x: e.x || 0, y: e.y || 0,
                        xScale: e.xScale || 1, yScale: e.yScale || 1,
                        rotation: e.rotation || 0, layer: e.layer
                    };
                    for (const be of block.entities) {
                        // ブロックの基点を引いて参照点起点に
                        const be2 = { ...be };
                        if (be2.x !== undefined) be2.x = be2.x - (block.base_x || 0);
                        if (be2.y !== undefined) be2.y = be2.y - (block.base_y || 0);
                        if (be2.x2 !== undefined) be2.x2 = be2.x2 - (block.base_x || 0);
                        if (be2.y2 !== undefined) be2.y2 = be2.y2 - (block.base_y || 0);
                        // ブロック内エンティティの色がBYBLOCK(0)ならINSERTの色を継承
                        if (be2.color === 0) be2.color = e.color;
                        // レイヤがINSERTのなら継承
                        if (!be2.layer || be2.layer === '0') be2.layer = e.layer;
                        convertEntity(be2, ins, false);
                    }
                    break;
                }
                case 'HATCH': {
                    // 境界を扇形分割してソリッド塗り
                    const verts = e.vertices || [];
                    if (verts.length < 3) break;
                    const col = resolveColor(e);
                    const [g, l] = lm.get(e.layer || '0');
                    for (let i = 1; i < verts.length - 1; i++) {
                        const a = verts[0], b = verts[i], c = verts[i + 1];
                        const [ax, ay] = xf(a.x, a.y);
                        const [bx, by] = xf(b.x, b.y);
                        const [cx, cy] = xf(c.x, c.y);
                        const o = new W.CDataSolid(
                            fx(ax), fy(ay), fx(bx), fy(by), fx(cx), fy(cy));
                        o.glayer = g; o.layer = l; o.penColor = col;
                        ents.push(o);
                    }
                    break;
                }
                // 3DFACE等は段階的に対応
            }
        } catch (ex) {
            console.warn(`変換警告 (${e.type}):`, ex.message);
        }
    }

    for (const e of dxfDoc.entities) {
        convertEntity(e);
    }

    return { entities: ents, stats, layerMap: lm.map };
}

// 公開API
window.DxfToJww = {
    autoScale,
    convertEntities,
    jwwColor,
    STD_SCALES,
};
