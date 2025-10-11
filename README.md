# さいたまなび

JIS X 8341-3:2016 Level AA準拠の埼玉県総合紹介サイト（全50ページ）

## 技術スタック

- HTML5
- TailwindCSS (CDN)
- Vanilla JavaScript
- Nginx (Docker - ローカル開発用)

## GitHub Pagesでの公開

このプロジェクトはGitHub Actionsで自動的にデプロイされます。

### セットアップ手順

1. **リポジトリ設定**
   - GitHubリポジトリの「Settings」→「Pages」を開く
   - 「Source」を「GitHub Actions」に設定

2. **自動デプロイ**
   - mainブランチにプッシュすると自動的にデプロイされます
   - `.github/workflows/deploy.yml`が実行されます
   - HTMLファイルのみが公開されます（設定ファイルやドキュメントは除外）

3. **公開URL**
   - `https://<username>.github.io/<repository-name>/`

### セキュリティ
- nginx.conf、Dockerfile、CLAUDE.md、docs/などの内部ファイルは公開されません
- GitHub Actionsが自動的にHTMLファイルのみを抽出してデプロイします

## ローカル環境での確認方法

### 方法1: Docker Compose（推奨）

```bash
# イメージをビルドして起動
docker-compose up -d

# ブラウザで確認
open http://localhost:8080

# 停止
docker-compose down
```

### 方法2: Dockerコマンド

```bash
# イメージをビルド
docker build -t saitama-website .

# コンテナを起動
docker run -d -p 8080:80 --name saitama-website saitama-website

# ブラウザで確認
open http://localhost:8080

# 停止と削除
docker stop saitama-website
docker rm saitama-website
```

### 方法3: 簡易HTTPサーバー（Dockerなし）

Pythonがインストールされている場合：

```bash
# Python 3の場合
python3 -m http.server 8080

# ブラウザで確認
open http://localhost:8080
```

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

### サイト情報 (site-info/) - 4ページ
- `accessibility.html` - アクセシビリティ方針
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

すべてのコンテンツは2024-2025年の公式データに基づいています：

- 埼玉県公式サイト
- 各市町村公式サイト
- 総務省統計局
- 農林水産省
- 経済産業省
- 各種観光協会

## ライセンス

このプロジェクトは教育目的で作成されています。
