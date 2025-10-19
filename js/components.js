/**
 * 共通コンポーネント読み込みとモバイルメニュー機能
 * JIS X 8341-3:2016 Level AA準拠
 */

(function () {
  "use strict";

  // DOMの読み込み完了を待つ
  if (document.readyState === "loading") {console.log("111");
    document.addEventListener("DOMContentLoaded", init);
  } else {console.log("222");
    init();
  }

  function init() {
    // 現在のページのパスからルートへの相対パスを計算
    function getRelativePathToRoot() {
      const path = window.location.pathname;

      // パスからファイル名を除去してディレクトリパスを取得
      let directory = path.substring(0, path.lastIndexOf("/"));

      // GitHub Pagesのベースパス（/saitama-navi/）を除外
      if (directory.startsWith("/saitama-navi")) {
        directory = directory.replace("/saitama-navi", "");
      }

      // ルートからの階層数を計算（先頭と末尾の/を除く）
      const pathParts = directory.split("/").filter((p) => p);
      const depth = pathParts.length;

      // 階層数に応じた相対パスを返す
      if (depth === 0) {
        return "./";
      } else {
        return "../".repeat(depth);
      }
    }

    const basePath = getRelativePathToRoot();

    // header/footer内の絶対パスを相対パスに変換
    function convertAbsolutePathsToRelative(element) {
      // リンク（a, link要素）のhrefを修正
      element.querySelectorAll('a[href^="/"], link[href^="/"]').forEach((elem) => {
        const href = elem.getAttribute("href");
        if (href && href.startsWith("/") && !href.startsWith("//")) {
          elem.setAttribute("href", basePath + href.substring(1));
        }
      });

      // 画像のsrcを修正
      element.querySelectorAll('img[src^="/"]').forEach((img) => {
        const src = img.getAttribute("src");
        if (src && src.startsWith("/") && !src.startsWith("//")) {
          img.setAttribute("src", basePath + src.substring(1));
        }
      });
    }
    
    // ヘッダーを読み込む
    fetch(basePath + "components/header.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        const headerPlaceholder = document.getElementById("header-placeholder");
        if (headerPlaceholder) {
          headerPlaceholder.innerHTML = html;
          convertAbsolutePathsToRelative(headerPlaceholder);
          highlightCurrentPage();
          initMobileMenu();
        }
      })
      .catch((error) =>
        console.error("ヘッダーの読み込みに失敗しました:", error)
      );

    // フッターを読み込む
    fetch(basePath + "components/footer.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        const footerPlaceholder = document.getElementById("footer-placeholder");
        if (footerPlaceholder) {
          footerPlaceholder.innerHTML = html;
          convertAbsolutePathsToRelative(footerPlaceholder);
        }
      })
      .catch((error) =>
        console.error("フッターの読み込みに失敗しました:", error)
      );

    // 現在のページをナビゲーションでハイライト
    function highlightCurrentPage() {
      const currentPath = window.location.pathname;
      const menuLinks = document.querySelectorAll("#mobile-menu a");

      menuLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        // 現在のパスを正規化（GitHub Pagesのベースパスを除去）
        let normalizedPath = currentPath;
        if (normalizedPath.startsWith("/saitama-navi")) {
          normalizedPath = normalizedPath.replace("/saitama-navi", "");
        }

        // リンクのhrefを絶対パス形式に変換して比較
        let absoluteHref = href;
        if (href.startsWith("../")) {
          // 相対パスを絶対パスに変換
          const depth = (href.match(/\.\.\//g) || []).length;
          const pathParts = normalizedPath.split("/").filter((p) => p);
          pathParts.splice(pathParts.length - depth);
          const remainingPath = href.replace(/\.\.\//g, "");
          absoluteHref = "/" + pathParts.join("/") + "/" + remainingPath;
        } else if (href.startsWith("./")) {
          const directory = normalizedPath.substring(
            0,
            normalizedPath.lastIndexOf("/")
          );
          absoluteHref = directory + "/" + href.substring(2);
        }

        // パスが一致する、または現在のパスがそのセクションに含まれる場合
        if (
          normalizedPath === absoluteHref ||
          normalizedPath.startsWith(absoluteHref.replace(/index\.html$/, ""))
        ) {
          link.classList.remove("hover:bg-gray-100", "hover:text-saitama-blue");
          link.classList.add("bg-saitama-blue", "text-white", "font-semibold");
          link.setAttribute("aria-current", "page");
        }
      });
    }

    // モバイルメニューの初期化
    function initMobileMenu() {
      const menuButton = document.getElementById("mobile-menu-button");
      const menu = document.getElementById("mobile-menu");

      if (menuButton && menu) {
        menuButton.addEventListener("click", function () {
          const expanded = this.getAttribute("aria-expanded") === "true";
          this.setAttribute("aria-expanded", !expanded);
          menu.classList.toggle("hidden");

          // アイコン変更
          const icon = this.querySelector("svg path");
          if (!expanded) {
            icon.setAttribute("d", "M6 18L18 6M6 6l12 12");
            this.querySelector(".sr-only").textContent = "メニューを閉じる";
          } else {
            icon.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
            this.querySelector(".sr-only").textContent = "メニューを開く";
          }
        });

        // Escキーでメニューを閉じる（アクセシビリティ向上）
        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape" && !menu.classList.contains("hidden")) {
            menuButton.click();
          }
        });
      }
    }
  }
})();
