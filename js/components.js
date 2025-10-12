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
        // 現在のページのパスからcomponentsディレクトリへの相対パスを計算
        function getComponentPath() {
            const path = window.location.pathname;

            // パスからファイル名を除去してディレクトリパスを取得
            const directory = path.substring(0, path.lastIndexOf('/'));

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
        fetch(basePath + 'components/header.html')
            .then(response => response.text())
            .then(html => {
                const headerPlaceholder = document.getElementById('header-placeholder');
                if (headerPlaceholder) {
                    headerPlaceholder.innerHTML = html;
                    highlightCurrentPage();
                    initMobileMenu();
                }
            })
            .catch(error => console.error('ヘッダーの読み込みに失敗しました:', error));

        // フッターを読み込む
        fetch(basePath + 'components/footer.html')
            .then(response => response.text())
            .then(html => {
                const footerPlaceholder = document.getElementById('footer-placeholder');
                if (footerPlaceholder) {
                    footerPlaceholder.innerHTML = html;
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
