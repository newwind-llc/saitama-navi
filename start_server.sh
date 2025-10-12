#!/bin/bash
echo "==================================="
echo "さいたまなび - 開発サーバー起動"
echo "==================================="
echo ""
echo "サーバーを起動しています..."
echo "URL: http://localhost:8000"
echo ""
echo "ブラウザで http://localhost:8000 にアクセスしてください"
echo ""
echo "サーバーを停止するには Ctrl+C を押してください"
echo ""

python3 -m http.server 8000
