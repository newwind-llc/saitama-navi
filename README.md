# さいたまなび

JIS X 8341-3:2016 Level AA準拠の埼玉県総合紹介サイト（全51ページ）

## 技術スタック

- HTML5
- TailwindCSS v3.4.18（プリコンパイル済みの静的CSS `css/styles.css` として同梱）
- 独自スタイル（`css/custom-styles.css`）
- Vanilla JavaScript（共通ヘッダー/フッター読み込み、モバイルメニュー）
- Nginx（Docker - ローカル開発用）

※ `package.json` / `tailwind.config.js` はリポジトリに含まれていません。`css/styles.css` は外部ビルド済みの成果物として配置されているため、未使用のTailwindユーティリティは含まれません。新たに必要なクラスがある場合は `css/custom-styles.css` に追記してください。

## サイト構成

### トップページ
- `index.html` - サイトトップページ

### 埼玉県について (about/) - 5ページ
- `index.html` - カテゴリートップ
- `geography.html` - 地理・地形・気候
- `history.html` - 歴史
- `population.html` - 人口統計
- `symbols.html` - 県のシンボル

### 観光・レジャー (tourism/) - 12ページ
- `index.html` - カテゴリートップ
- `spots/` - 観光スポット（5ページ）
  - chichibu.html, kawagoe.html, omiya.html, nagatoro.html, tokorozawa.html
- `events/` - イベント・祭り（3ページ）
  - chichibu-yomatsuri.html, kawagoe-matsuri.html, hanabi.html
- `food/` - グルメ・特産品（3ページ）
  - local-cuisine.html, specialties.html, sweets.html

### 日常生活 (life/) - 10ページ
- `index.html` - カテゴリートップ
- `transport/` - 交通・アクセス（3ページ）
  - railway.html, highway.html, access.html
- `welfare/` - 医療・福祉（3ページ）
  - medical.html, elderly-care.html, support.html
- `education/` - 教育・学び（3ページ）
  - schools.html, childcare.html, lifelong.html

### 産業・経済 (industry/) - 8ページ
- `index.html` - カテゴリートップ
- `sectors/` - 産業分野（3ページ）
  - manufacturing.html, agriculture.html, commerce.html
- `companies/` - 企業情報（2ページ）
  - major-companies.html, startups.html
- `employment/` - 雇用・就業（2ページ）
  - job-support.html, career.html

### 市町村情報 (cities/) - 10ページ
- `index.html` - カテゴリートップ
- 主要9市の詳細ページ
  - saitama-city.html, kawaguchi.html, kawagoe-city.html
  - tokorozawa-city.html, koshigaya.html, kasukabe.html
  - ageo.html, kumagaya.html, chichibu-city.html

### サイト情報 (site-info/) - 5ページ
- `accessibility.html` - アクセシビリティ方針
- `accessibility-test-result.html` - アクセシビリティ試験結果（JIS X 8341-3:2016 達成基準ごとの判定結果）
- `sitemap.html` - サイトマップ
- `privacy.html` - プライバシーポリシー
- `contact.html` - お問い合わせ

## アクセシビリティ対応

### JIS X 8341-3:2016 Level AA準拠

- ✅ スキップリンク（全ページ）
- ✅ 適切な見出し階層
- ✅ セマンティックHTML5
- ✅ ARIA属性の適切な使用
- ✅ キーボード操作対応
- ✅ 明確なフォーカスインジケーター
- ✅ 4.5:1のコントラスト比
- ✅ 画像の代替テキスト
- ✅ レスポンシブデザイン

## データソース

すべてのコンテンツは2024-2026年の公式データに基づいています：

- 埼玉県公式サイト
- 各市町村公式サイト
- 総務省統計局
- 農林水産省
- 経済産業省
- 各種観光協会

## ライセンス

© 2026 合同会社NEWWIND. All rights reserved.

本リポジトリは合同会社NEWWINDが制作した制作物であり、無断での複製・転載・改変・再配布、ならびに本コードを利用した類似サイトの構築を禁じます。

埼玉県および各市町村の公式情報は各機関に著作権があり、本サイトは情報提供を目的に出典を明示の上で引用しています。
