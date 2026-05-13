#!/usr/bin/env node
/**
 * build-static.js — さいたまなび 公開成果物ビルドスクリプト
 *
 * 役割:
 *  1. _site/ をクリーンアップして再生成
 *  2. ソースから _site/ へ静的ファイルを複製
 *  3. _site 内の公開HTMLについて
 *      - <div id="header-placeholder"></div> を共通ヘッダーHTMLに置換
 *      - <div id="footer-placeholder"></div> を共通フッターHTMLに置換
 *      - ヘッダー/フッター内のホストルート相対パス (`/foo`) を
 *        各ページの階層深さに合わせた相対パスへ変換
 *  4. .nojekyll を作成
 *
 * 除外:
 *  - components/header.html / components/footer.html はそのままコピーするが
 *    placeholder 注入の対象にはしない
 *  - googlefed2eeacd163ed0e.html は素通し（注入しない）
 *
 * 依存:
 *  - Node.js 標準モジュール (fs, path) のみ
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "_site");

// 公開HTMLとしてビルド処理しないファイル（コピーは行う）
const SKIP_INJECTION = new Set([
  "googlefed2eeacd163ed0e.html",
  "components/header.html",
  "components/footer.html",
]);

// _site にコピーするトップレベルのエントリ
const COPY_ENTRIES = [
  "index.html",
  "googlefed2eeacd163ed0e.html",
  "robots.txt",
  "sitemap.xml",
  "about",
  "tourism",
  "life",
  "industry",
  "cities",
  "site-info",
  "components",
  "js",
  "css",
  "img",
];

// -----------------------------------------------------------------------------
// ファイル操作ユーティリティ
// -----------------------------------------------------------------------------

function rmrf(p) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
  }
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
}

function walkHtml(dir) {
  /** @type {string[]} */
  const out = [];
  (function recurse(d) {
    for (const name of fs.readdirSync(d)) {
      const full = path.join(d, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        recurse(full);
      } else if (name.endsWith(".html")) {
        out.push(full);
      }
    }
  })(dir);
  return out;
}

// -----------------------------------------------------------------------------
// パス変換
// -----------------------------------------------------------------------------

/**
 * _site 配下の HTML の、_site ルートからの相対パスを得る
 */
function relFromSite(absPath) {
  return path.relative(OUT, absPath).split(path.sep).join("/");
}

/**
 * ページ階層から、ルートまでの相対パスプレフィックスを返す。
 *  index.html               → "./"
 *  about/index.html         → "../"
 *  tourism/spots/foo.html   → "../../"
 */
function relPrefixFor(relPath) {
  const segs = relPath.split("/");
  const depth = segs.length - 1; // ファイル名分を引く
  if (depth <= 0) return "./";
  return "../".repeat(depth);
}

/**
 * ヘッダー/フッターの templateHtml 内に登場する
 *   href="/..." / src="/..."
 * のホストルート相対パスを、prefix を付けた相対パスへ変換する。
 *
 * - `//host/...` (プロトコル相対) は対象外
 * - `https://...` `mailto:` `#anchor` などは正規表現で自然に除外
 */
function rewriteRootRelative(html, prefix) {
  return html.replace(
    /\b(href|src)="\/(?!\/)([^"]*)"/g,
    (_, attr, rest) => `${attr}="${prefix}${rest}"`
  );
}

// -----------------------------------------------------------------------------
// メイン
// -----------------------------------------------------------------------------

function build() {
  console.log(`▶ build-static: ROOT=${ROOT}`);

  // 1) クリーン
  rmrf(OUT);
  ensureDir(OUT);

  // 2) コピー
  for (const entry of COPY_ENTRIES) {
    const src = path.join(ROOT, entry);
    if (!fs.existsSync(src)) {
      console.warn(`  ! missing source: ${entry}`);
      continue;
    }
    const dest = path.join(OUT, entry);
    copyRecursive(src, dest);
  }
  fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

  // 3) ヘッダー/フッターのテンプレを読む
  const headerTpl = fs.readFileSync(
    path.join(OUT, "components/header.html"),
    "utf8"
  );
  const footerTpl = fs.readFileSync(
    path.join(OUT, "components/footer.html"),
    "utf8"
  );

  // 4) 各公開HTMLに対し placeholder を展開
  const htmlFiles = walkHtml(OUT);
  let injected = 0;
  let skipped = 0;
  for (const full of htmlFiles) {
    const rel = relFromSite(full);
    if (SKIP_INJECTION.has(rel)) {
      skipped++;
      continue;
    }
    let content = fs.readFileSync(full, "utf8");

    const hadHeaderPlaceholder = content.includes('id="header-placeholder"');
    const hadFooterPlaceholder = content.includes('id="footer-placeholder"');
    if (!hadHeaderPlaceholder && !hadFooterPlaceholder) {
      // placeholder が無いページはそのまま
      continue;
    }

    const prefix = relPrefixFor(rel);
    const headerExpanded = rewriteRootRelative(headerTpl, prefix);
    const footerExpanded = rewriteRootRelative(footerTpl, prefix);

    if (hadHeaderPlaceholder) {
      content = content.replace(
        /<div\s+id="header-placeholder"\s*>\s*<\/div>/i,
        headerExpanded
      );
    }
    if (hadFooterPlaceholder) {
      content = content.replace(
        /<div\s+id="footer-placeholder"\s*>\s*<\/div>/i,
        footerExpanded
      );
    }

    fs.writeFileSync(full, content);
    injected++;
  }

  console.log(`✓ injected: ${injected} files`);
  console.log(`  skipped:  ${skipped} files (no-inject list)`);

  // 5) 展開済みなので _site/components/ は公開不要。削除する。
  rmrf(path.join(OUT, "components"));
  console.log(`  removed:  _site/components/ (template source — not needed in artifact)`);

  console.log(`▶ done. output: ${OUT}`);
}

build();
