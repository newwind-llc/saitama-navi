/**
 * components.js — ヘッダー/フッターの動的挙動のみ
 * JIS X 8341-3:2016 Level AA準拠
 *
 * 公開成果物（_site）は scripts/build-static.js により
 *   <div id="header-placeholder"></div>
 *   <div id="footer-placeholder"></div>
 * が <header>/<footer> へ静的展開済みのため、このスクリプトは
 *   - 現在ページに対応するナビ項目のハイライト
 *   - モバイルメニュー開閉
 * のみを担当する。
 *
 * 開発時に元HTMLを直接開いた場合（placeholder のまま）はヘッダー/フッターは
 * 表示されない。プレビュー時は scripts/build-static.js を実行して
 * _site/ を生成し、そちらを HTTP サーバで開くこと。
 */

(function () {
  "use strict";

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    highlightCurrentNav();
    initMobileMenu();
  }

  // ---------------------------------------------------------------------------
  // ナビハイライト
  // ---------------------------------------------------------------------------

  function highlightCurrentNav() {
    const currentUrl = new URL(window.location.href);
    const currentPath = normalizePath(currentUrl.pathname);
    // メニュー項目のみを対象にする（ロゴのホームリンクは除外）
    const links = document.querySelectorAll("#mobile-menu a[href]");

    links.forEach((link) => {
      const rawHref = link.getAttribute("href");
      if (!rawHref || rawHref.startsWith("#")) return;
      let linkUrl;
      try {
        linkUrl = new URL(link.href);
      } catch (_) {
        return;
      }
      if (linkUrl.origin !== currentUrl.origin) return;

      const linkPath = normalizePath(linkUrl.pathname);
      const isExact = currentPath === linkPath;
      // カテゴリトップ（"/about/" 形式）の場合、配下ページもハイライト
      const isAncestor =
        linkPath.endsWith("/") &&
        linkPath !== "/" &&
        currentPath.startsWith(linkPath);

      if (isExact || isAncestor) {
        link.classList.remove("hover:bg-gray-100", "hover:text-saitama-blue");
        link.classList.add("bg-saitama-blue", "text-white", "font-semibold");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function normalizePath(p) {
    // index.html 終端を取り除く（"/about/index.html" → "/about/"）
    return p.replace(/index\.html$/, "");
  }

  // ---------------------------------------------------------------------------
  // モバイルメニュー
  // ---------------------------------------------------------------------------

  function initMobileMenu() {
    const menuButton = document.getElementById("mobile-menu-button");
    const menu = document.getElementById("mobile-menu");
    if (!menuButton || !menu) return;

    menuButton.addEventListener("click", function () {
      const expanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("hidden");

      const icon = this.querySelector("svg path");
      if (!expanded) {
        if (icon) icon.setAttribute("d", "M6 18L18 6M6 6l12 12");
        const sr = this.querySelector(".sr-only");
        if (sr) sr.textContent = "メニューを閉じる";
      } else {
        if (icon) icon.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
        const sr = this.querySelector(".sr-only");
        if (sr) sr.textContent = "メニューを開く";
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.classList.contains("hidden")) {
        menuButton.click();
      }
    });
  }
})();
