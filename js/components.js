/**
 * 共通コンポーネント読み込みとモバイルメニュー機能
 * JIS X 8341-3:2016 Level AA準拠
 */

(function() {
    'use strict';

    // DOMの読み込み完了を待つ
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // ベースパスを検出（GitHub Pages対応）
        const siteBasePath = window.location.pathname.match(/^\/[^\/]+\//) ? window.location.pathname.match(/^\/[^\/]+\//)[0] : '/';

        // 画像パスを修正（GitHub Pages対応）
        function fixImagePaths() {
            if (siteBasePath !== '/') {
                // すべての画像のsrc属性を修正（getAttribute使用で元の値を取得）
                document.querySelectorAll('img').forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && src.startsWith('/img/')) {
                        img.setAttribute('src', siteBasePath + src.substring(1));
                    }
                });

                // 背景画像のパスを修正
                document.querySelectorAll('[style*="url(\'/img/"]').forEach(elem => {
                    const style = elem.getAttribute('style');
                    if (style) {
                        elem.setAttribute('style', style.replace(/url\('\/img\//g, `url('${siteBasePath}img/`));
                    }
                });

                // CSSの背景画像を修正（index.htmlの<style>タグ内）
                document.querySelectorAll('style').forEach(styleTag => {
                    const content = styleTag.textContent;
                    if (content.includes("url('/img/")) {
                        styleTag.textContent = content.replace(/url\('\/img\//g, `url('${siteBasePath}img/`);
                    }
                });
            }
        }

        // 画像パスを即座に修正
        fixImagePaths();

        // 現在のページのパスからcomponentsディレクトリへの相対パスを計算
        function getComponentPath() {
            const path = window.location.pathname;

            // GitHub Pagesのベースパス（/saitama-navi/）を除外
            let adjustedPath = path;
            const basePathMatch = path.match(/^\/[^\/]+\//);
            if (basePathMatch && basePathMatch[0] !== '/') {
                // ベースパスがある場合（GitHub Pages等）、それを除外
                if (path.startsWith('/saitama-navi/')) {
                    adjustedPath = path.replace('/saitama-navi', '');
                }
            }

            // パスからファイル名を除去してディレクトリパスを取得
            const directory = adjustedPath.substring(0, adjustedPath.lastIndexOf('/'));

            // ルートからの階層数を計算（先頭と末尾の/を除く）
            const pathParts = directory.split('/').filter(p => p);
            const depth = pathParts.length;

            // 階層数に応じた相対パスを返す
            if (depth === 0) {
                return './';
            } else {
                return '../'.repeat(depth);
            }
        }

        const basePath = getComponentPath();

        // ヘッダーを読み込む
        fetch(getComponentPath() + 'components/header.html')
            .then(response => response.text())
            .then(html => {
                const headerPlaceholder = document.getElementById('header-placeholder');
                if (headerPlaceholder) {
                    headerPlaceholder.innerHTML = html;
                    fixImagePaths(); // ヘッダー内の画像パスを修正
                    highlightCurrentPage();
                    initMobileMenu();
                }
            })
            .catch(error => console.error('ヘッダーの読み込みに失敗しました:', error));

        // フッターを読み込む
        fetch(getComponentPath() + 'components/footer.html')
            .then(response => response.text())
            .then(html => {
                const footerPlaceholder = document.getElementById('footer-placeholder');
                if (footerPlaceholder) {
                    footerPlaceholder.innerHTML = html;
                    fixImagePaths(); // フッター内の画像パスを修正
                }
            })
            .catch(error => console.error('フッターの読み込みに失敗しました:', error));

        // 現在のページをナビゲーションでハイライト
        function highlightCurrentPage() {
            const path = window.location.pathname;
            const menuLinks = document.querySelectorAll('#mobile-menu a');

            menuLinks.forEach(link => {
                const href = link.getAttribute('href');
                // パスが一致する、または現在のパスがそのセクションに含まれる場合
                if (path === href || (href !== '/index.html' && path.startsWith(href.replace('index.html', '')))) {
                    link.classList.remove('hover:bg-gray-100', 'hover:text-saitama-blue');
                    link.classList.add('bg-saitama-blue', 'text-white', 'font-semibold');
                    link.setAttribute('aria-current', 'page');
                }
            });
        }

        // モバイルメニューの初期化
        function initMobileMenu() {
            const menuButton = document.getElementById('mobile-menu-button');
            const menu = document.getElementById('mobile-menu');

            if (menuButton && menu) {
                menuButton.addEventListener('click', function() {
                    const expanded = this.getAttribute('aria-expanded') === 'true';
                    this.setAttribute('aria-expanded', !expanded);
                    menu.classList.toggle('hidden');

                    // アイコン変更
                    const icon = this.querySelector('svg path');
                    if (!expanded) {
                        icon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
                        this.querySelector('.sr-only').textContent = 'メニューを閉じる';
                    } else {
                        icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
                        this.querySelector('.sr-only').textContent = 'メニューを開く';
                    }
                });

                // Escキーでメニューを閉じる（アクセシビリティ向上）
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
                        menuButton.click();
                    }
                });
            }
        }
    }
})();
