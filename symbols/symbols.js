// 電気設備シンボル定義（公共建築設備工事標準図 電気設備工事編 令和7年版 準拠）
// viewBox 0 0 40 40。ファイル名は英数字のみ（Windows文字化け防止）。日本語名称はnameフィールド参照。
const SYMBOLS = [
 {
  "id": "lt_ceil",
  "nm": "照明 天井付",
  "cat": "照明器具",
  "color": "#E8B23A",
  "g": "<line x1=\"4\" y1=\"20\" x2=\"12.5\" y2=\"20\" stroke=\"currentColor\" stroke-width=\"2.2\"/><circle cx=\"20\" cy=\"20\" r=\"7.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><line x1=\"27.5\" y1=\"20\" x2=\"36\" y2=\"20\" stroke=\"currentColor\" stroke-width=\"2.2\"/>"
 },
 {
  "id": "lt_nobox",
  "nm": "照明 天井付(BOXなし)",
  "cat": "照明器具",
  "color": "#E8B23A",
  "g": "<rect x=\"6\" y=\"15\" width=\"28\" height=\"10\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/>"
 },
 {
  "id": "lt_sq",
  "nm": "照明 角形天井付",
  "cat": "照明器具",
  "color": "#E8B23A",
  "g": "<rect x=\"8\" y=\"8\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/>"
 },
 {
  "id": "lt_wall",
  "nm": "照明 壁付",
  "cat": "照明器具",
  "color": "#E8B23A",
  "g": "<circle cx=\"20\" cy=\"18\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><line x1=\"9\" y1=\"29\" x2=\"31\" y2=\"29\" stroke=\"currentColor\" stroke-width=\"2.4\"/>"
 },
 {
  "id": "lt_fl",
  "nm": "蛍光/LED灯",
  "cat": "照明器具",
  "color": "#E8B23A",
  "g": "<rect x=\"6\" y=\"15\" width=\"28\" height=\"10\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><line x1=\"20\" y1=\"15\" x2=\"20\" y2=\"25\" stroke=\"currentColor\" stroke-width=\"1.3\"/>"
 },
 {
  "id": "lt_dl",
  "nm": "ダウンライト(DL)",
  "cat": "照明器具",
  "color": "#E8B23A",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M14.5 14.5 L25.5 25.5 M25.5 14.5 L14.5 25.5\" stroke=\"currentColor\" stroke-width=\"1.8\"/>"
 },
 {
  "id": "lt_emg",
  "nm": "非常用照明(天井)",
  "cat": "照明器具",
  "color": "#D9522B",
  "g": "<line x1=\"4\" y1=\"20\" x2=\"12.5\" y2=\"20\" stroke=\"currentColor\" stroke-width=\"2.2\"/><circle cx=\"20\" cy=\"20\" r=\"7.5\" fill=\"currentColor\"/><line x1=\"27.5\" y1=\"20\" x2=\"36\" y2=\"20\" stroke=\"currentColor\" stroke-width=\"2.2\"/>"
 },
 {
  "id": "lt_emgs",
  "nm": "非常用照明(●)",
  "cat": "照明器具",
  "color": "#D9522B",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8\" fill=\"currentColor\"/>"
 },
 {
  "id": "lt_exit",
  "nm": "避難口/通路誘導灯",
  "cat": "照明器具",
  "color": "#1F9A60",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M14 14 L26 26 M26 14 L14 26\" stroke=\"currentColor\" stroke-width=\"3.4\"/>"
 },
 {
  "id": "sw",
  "nm": "タンブラSW",
  "cat": "点滅器",
  "color": "#8B5CF6",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"currentColor\"/>"
 },
 {
  "id": "sw2p",
  "nm": "2極(2P)",
  "cat": "点滅器",
  "color": "#8B5CF6",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"currentColor\"/><text x=\"30\" y=\"14\" font-size=\"7.5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">2P</text>"
 },
 {
  "id": "sw3",
  "nm": "3路(3)",
  "cat": "点滅器",
  "color": "#8B5CF6",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"currentColor\"/><text x=\"30\" y=\"14\" font-size=\"9\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">3</text>"
 },
 {
  "id": "sw4",
  "nm": "4路(4)",
  "cat": "点滅器",
  "color": "#8B5CF6",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"currentColor\"/><text x=\"30\" y=\"14\" font-size=\"9\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">4</text>"
 },
 {
  "id": "swH",
  "nm": "位置表示灯付(H)",
  "cat": "点滅器",
  "color": "#8B5CF6",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"currentColor\"/><text x=\"30\" y=\"14\" font-size=\"8.5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">H</text>"
 },
 {
  "id": "swL",
  "nm": "確認表示灯付(L)",
  "cat": "点滅器",
  "color": "#8B5CF6",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"currentColor\"/><text x=\"30\" y=\"14\" font-size=\"8.5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">L</text>"
 },
 {
  "id": "swWP",
  "nm": "防雨形(WP)",
  "cat": "点滅器",
  "color": "#8B5CF6",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"currentColor\"/><text x=\"30\" y=\"13.5\" font-size=\"6\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">WP</text>"
 },
 {
  "id": "swDim",
  "nm": "調光器",
  "cat": "点滅器",
  "color": "#8B5CF6",
  "g": "<circle cx=\"20\" cy=\"22\" r=\"6.5\" fill=\"currentColor\"/><path d=\"M20 22 L29 9 M29 9 l-1.5 4.5 M29 9 l3.5 2\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/>"
 },
 {
  "id": "swD",
  "nm": "遅延SW(D)",
  "cat": "点滅器",
  "color": "#8B5CF6",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"currentColor\"/><text x=\"30\" y=\"14\" font-size=\"8.5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">D</text>"
 },
 {
  "id": "swT",
  "nm": "タイマSW(T)",
  "cat": "点滅器",
  "color": "#8B5CF6",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"currentColor\"/><text x=\"30\" y=\"14\" font-size=\"8.5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">T</text>"
 },
 {
  "id": "swWide",
  "nm": "ワイド形",
  "cat": "点滅器",
  "color": "#8B5CF6",
  "g": "<path d=\"M20 12 L28 20 L20 28 L12 20 Z\" fill=\"currentColor\"/>"
 },
 {
  "id": "swAuto",
  "nm": "自動点滅器(A)",
  "cat": "点滅器",
  "color": "#8B5CF6",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"currentColor\"/><text x=\"30\" y=\"14\" font-size=\"8.5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">A</text>"
 },
 {
  "id": "swR",
  "nm": "リモコンSW(R)",
  "cat": "点滅器",
  "color": "#8B5CF6",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"currentColor\"/><text x=\"30\" y=\"14\" font-size=\"8.5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">R</text>"
 },
 {
  "id": "swRAS",
  "nm": "熱線式自動SW",
  "cat": "点滅器",
  "color": "#8B5CF6",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"currentColor\"/><text x=\"30\" y=\"13.5\" font-size=\"5.5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">RAS</text>"
 },
 {
  "id": "oc",
  "nm": "コンセント",
  "cat": "コンセント",
  "color": "#3F72C4",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M12 20 A8 8 0 0 0 28 20 Z\" fill=\"currentColor\"/>"
 },
 {
  "id": "oc20",
  "nm": "20A",
  "cat": "コンセント",
  "color": "#3F72C4",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M12 20 A8 8 0 0 0 28 20 Z\" fill=\"currentColor\"/><text x=\"20\" y=\"14.5\" font-size=\"6.5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">20A</text>"
 },
 {
  "id": "oc200",
  "nm": "200V(20A250V)",
  "cat": "コンセント",
  "color": "#3F72C4",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M12 20 A8 8 0 0 0 28 20 Z\" fill=\"currentColor\"/><text x=\"20\" y=\"14\" font-size=\"5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">250V</text>"
 },
 {
  "id": "oc3p",
  "nm": "3P",
  "cat": "コンセント",
  "color": "#3F72C4",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M12 20 A8 8 0 0 0 28 20 Z\" fill=\"currentColor\"/><text x=\"20\" y=\"14.5\" font-size=\"6.5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">3P</text>"
 },
 {
  "id": "ocLK",
  "nm": "抜止(LK)",
  "cat": "コンセント",
  "color": "#3F72C4",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M12 20 A8 8 0 0 0 28 20 Z\" fill=\"currentColor\"/><text x=\"20\" y=\"14.5\" font-size=\"6.5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">LK</text>"
 },
 {
  "id": "ocT",
  "nm": "引掛形(T)",
  "cat": "コンセント",
  "color": "#3F72C4",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M12 20 A8 8 0 0 0 28 20 Z\" fill=\"currentColor\"/><text x=\"20\" y=\"14.5\" font-size=\"7\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">T</text>"
 },
 {
  "id": "ocE",
  "nm": "接地極付(E)",
  "cat": "コンセント",
  "color": "#3F72C4",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M12 20 A8 8 0 0 0 28 20 Z\" fill=\"currentColor\"/><text x=\"20\" y=\"14.5\" font-size=\"7\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">E</text>"
 },
 {
  "id": "ocET",
  "nm": "接地端子付(ET)",
  "cat": "コンセント",
  "color": "#3F72C4",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M12 20 A8 8 0 0 0 28 20 Z\" fill=\"currentColor\"/><text x=\"20\" y=\"14.5\" font-size=\"6\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">ET</text>"
 },
 {
  "id": "ocWP",
  "nm": "防雨形(WP)",
  "cat": "コンセント",
  "color": "#3F72C4",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M12 20 A8 8 0 0 0 28 20 Z\" fill=\"currentColor\"/><text x=\"20\" y=\"14\" font-size=\"5.5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">WP</text>"
 },
 {
  "id": "ocEX",
  "nm": "防爆形(EX)",
  "cat": "コンセント",
  "color": "#3F72C4",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M12 20 A8 8 0 0 0 28 20 Z\" fill=\"currentColor\"/><text x=\"20\" y=\"14\" font-size=\"5.5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">EX</text>"
 },
 {
  "id": "ocFloor",
  "nm": "床コンセント",
  "cat": "コンセント",
  "color": "#3F72C4",
  "g": "<rect x=\"8\" y=\"8\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M13.5 20 A6.5 6.5 0 0 0 26.5 20 Z\" fill=\"currentColor\"/>"
 },
 {
  "id": "ocCeil",
  "nm": "天井コンセント",
  "cat": "コンセント",
  "color": "#3F72C4",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><circle cx=\"20\" cy=\"20\" r=\"3\" fill=\"currentColor\"/>"
 },
 {
  "id": "ocNon",
  "nm": "非常コンセント",
  "cat": "コンセント",
  "color": "#3F72C4",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M12 20 A8 8 0 0 0 28 20 Z\" fill=\"currentColor\"/><text x=\"20\" y=\"14.5\" font-size=\"6.5\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">NC</text>"
 },
 {
  "id": "earthT",
  "nm": "接地端子(連用)",
  "cat": "コンセント",
  "color": "#3F72C4",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"7.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><line x1=\"20\" y1=\"15\" x2=\"20\" y2=\"22\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"15.5\" y1=\"22\" x2=\"24.5\" y2=\"22\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"17\" y1=\"25\" x2=\"23\" y2=\"25\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"18.5\" y1=\"27.5\" x2=\"21.5\" y2=\"27.5\" stroke=\"currentColor\" stroke-width=\"2\"/>"
 },
 {
  "id": "panelD",
  "nm": "分電盤",
  "cat": "盤・機器",
  "color": "#EDEBE4",
  "g": "<rect x=\"7\" y=\"13\" width=\"26\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M7 27 L33 13 L33 27 Z\" fill=\"currentColor\"/>"
 },
 {
  "id": "panelH",
  "nm": "配電盤",
  "cat": "盤・機器",
  "color": "#EDEBE4",
  "g": "<rect x=\"7\" y=\"13\" width=\"26\" height=\"14\" fill=\"currentColor\"/>"
 },
 {
  "id": "panelC",
  "nm": "制御盤",
  "cat": "盤・機器",
  "color": "#EDEBE4",
  "g": "<rect x=\"7\" y=\"13\" width=\"26\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><text x=\"20\" y=\"24.5\" font-size=\"9\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">C</text>"
 },
 {
  "id": "motor",
  "nm": "電動機(M)",
  "cat": "盤・機器",
  "color": "#26C6DA",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"9.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><text x=\"20\" y=\"24.5\" font-size=\"11\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">M</text>"
 },
 {
  "id": "fan",
  "nm": "換気扇",
  "cat": "盤・機器",
  "color": "#26C6DA",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"9.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M13 13 L27 27 M27 13 L13 27\" stroke=\"currentColor\" stroke-width=\"1.8\"/><circle cx=\"20\" cy=\"20\" r=\"2.4\" fill=\"currentColor\"/>"
 },
 {
  "id": "info",
  "nm": "情報用アウトレット",
  "cat": "情報・通信",
  "color": "#4ADE80",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M13 24 L20 13 L27 24 Z\" fill=\"currentColor\"/>"
 },
 {
  "id": "tel",
  "nm": "電話アウトレット",
  "cat": "情報・通信",
  "color": "#4ADE80",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><text x=\"20\" y=\"24.5\" font-size=\"11\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">T</text>"
 },
 {
  "id": "tv",
  "nm": "テレビ端子",
  "cat": "情報・通信",
  "color": "#4ADE80",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><text x=\"20\" y=\"24\" font-size=\"9\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">TV</text>"
 },
 {
  "id": "speaker",
  "nm": "スピーカ",
  "cat": "情報・通信",
  "color": "#4ADE80",
  "g": "<path d=\"M12 15 L19 15 L27 9 L27 31 L19 25 L12 25 Z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/>"
 },
 {
  "id": "smoke",
  "nm": "煙感知器(S)",
  "cat": "防災・警報",
  "color": "#F87171",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"9.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><text x=\"20\" y=\"24.5\" font-size=\"10\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">S</text>"
 },
 {
  "id": "heatD",
  "nm": "差動式スポット",
  "cat": "防災・警報",
  "color": "#F87171",
  "g": "<rect x=\"10\" y=\"10\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/>"
 },
 {
  "id": "heatF",
  "nm": "定温式スポット",
  "cat": "防災・警報",
  "color": "#F87171",
  "g": "<rect x=\"10\" y=\"10\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><circle cx=\"20\" cy=\"20\" r=\"3.2\" fill=\"currentColor\"/>"
 },
 {
  "id": "callP",
  "nm": "P型発信機",
  "cat": "防災・警報",
  "color": "#F87171",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"9.5\" fill=\"currentColor\"/><text x=\"20\" y=\"24.5\" font-size=\"11\" text-anchor=\"middle\" fill=\"#12151a\" font-family=\"sans-serif\" font-weight=\"700\">P</text>"
 },
 {
  "id": "bell",
  "nm": "警報ベル(B)",
  "cat": "防災・警報",
  "color": "#F87171",
  "g": "<path d=\"M10 22 A10 10 0 0 1 30 22 Z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><line x1=\"10\" y1=\"22\" x2=\"30\" y2=\"22\" stroke=\"currentColor\" stroke-width=\"2.2\"/>"
 },
 {
  "id": "indL",
  "nm": "表示灯",
  "cat": "防災・警報",
  "color": "#F87171",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><circle cx=\"20\" cy=\"20\" r=\"3.2\" fill=\"currentColor\"/>"
 },
 {
  "id": "receiver",
  "nm": "受信機",
  "cat": "防災・警報",
  "color": "#F87171",
  "g": "<rect x=\"7\" y=\"12\" width=\"26\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M7 12 L20 20 L33 12\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/>"
 },
 {
  "id": "mbox",
  "nm": "機器収容箱",
  "cat": "防災・警報",
  "color": "#F87171",
  "g": "<rect x=\"8\" y=\"12\" width=\"24\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/>"
 },
 {
  "id": "term",
  "nm": "終端抵抗(Ω)",
  "cat": "防災・警報",
  "color": "#F87171",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><text x=\"20\" y=\"24.5\" font-size=\"11\" text-anchor=\"middle\" fill=\"currentColor\" font-family=\"sans-serif\" font-weight=\"700\">Ω</text>"
 },
 {
  "id": "jb",
  "nm": "ジョイントBOX",
  "cat": "配線・接続",
  "color": "#9AA0AA",
  "g": "<rect x=\"11\" y=\"11\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\"/>"
 },
 {
  "id": "pb",
  "nm": "プルボックス",
  "cat": "配線・接続",
  "color": "#9AA0AA",
  "g": "<rect x=\"9\" y=\"9\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M9 9 L31 31 M31 9 L9 31\" stroke=\"currentColor\" stroke-width=\"1.8\"/>"
 },
 {
  "id": "cjb",
  "nm": "ケーブル用JB",
  "cat": "配線・接続",
  "color": "#9AA0AA",
  "g": "<circle cx=\"20\" cy=\"20\" r=\"10\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M12 24 L20 14 M15 27 L24 15 M19 28 L28 17\" stroke=\"currentColor\" stroke-width=\"1.5\"/>"
 },
 {
  "id": "ob",
  "nm": "アウトレットBOX",
  "cat": "配線・接続",
  "color": "#9AA0AA",
  "g": "<rect x=\"11\" y=\"11\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\"/><circle cx=\"20\" cy=\"20\" r=\"2.4\" fill=\"currentColor\"/>"
 },
 {
  "id": "riser",
  "nm": "立上り",
  "cat": "配線・接続",
  "color": "#9AA0AA",
  "g": "<circle cx=\"20\" cy=\"25\" r=\"3.5\" fill=\"currentColor\"/><path d=\"M20 23 L20 10 M20 10 l-3 4 M20 10 l3 4\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/>"
 }
];
