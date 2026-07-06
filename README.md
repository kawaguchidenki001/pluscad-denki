# pluscad-denki

plusCAD電気α型の電気図配置・見積アプリ。ブラウザ完結PWA。

## 現状
- MVP: PDF/画像を下敷きに、標準図準拠の電気シンボル60種をタップ配置。種別集計、保存/読込、スケール較正まで動作。
- 未実装: 照明の自動均等配置、自動配線、見積連携、DXF/JWW書き出し。詳細は `CLAUDE.md` を参照。

## ローカル起動
`index.html` を Chrome / Edge / Firefox で開く。PDF.js は CDN から読み込むためネット接続下で。

## GitHub Pages で公開する
1. このフォルダを GitHub リポジトリに push
2. Settings → Pages → Deploy from a branch → main / root
3. `https://<user>.github.io/<repo>/` でアクセス

## クラウド版 Claude Code で続きを実装する
1. GitHub にリポジトリを push（Windowsのブラウザだけで完結）
2. Windows のブラウザで `https://claude.ai/code` を開く
3. GitHub を接続し、このリポジトリでクラウドセッションを起動
4. 最初のプロンプト:「CLAUDE.md を読んで現状を把握して、Step B（照明の自動均等配置）から始めて」

Windows 側にインストールは不要。実行は Anthropic 側のクラウドVM。

## フォルダ構成
- `index.html` … アプリ本体
- `CLAUDE.md` … 設計仕様書（クラウドClaude Codeが毎回自動で読む）
- `symbols/` … 標準図準拠シンボル60種
  - `svg_mono/` 個別SVG（黒・実図面向け）
  - `svg_color/` 個別SVG（分類色付き）
  - `symbols.js` / `symbols.json` 定義データ
- `lib/dxf_jww/` … DXF⇔JWW変換エンジン（完成図書き出し用、Step E で使用）
- `reference/` … 国交省標準図PDF、図記号抽出テキスト
