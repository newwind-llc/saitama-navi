# Nginx ベースの軽量イメージを使用
FROM nginx:alpine

# 作業ディレクトリを設定
WORKDIR /usr/share/nginx/html

# nginxのデフォルトファイルを削除
RUN rm -rf /usr/share/nginx/html/*

# すべてのHTMLファイルをコピー
COPY index.html /usr/share/nginx/html/
COPY about/ /usr/share/nginx/html/about/
COPY tourism/ /usr/share/nginx/html/tourism/
COPY life/ /usr/share/nginx/html/life/
COPY industry/ /usr/share/nginx/html/industry/
COPY cities/ /usr/share/nginx/html/cities/
COPY site-info/ /usr/share/nginx/html/site-info/

# 静的リソースをコピー
COPY components/ /usr/share/nginx/html/components/
COPY js/ /usr/share/nginx/html/js/
COPY css/ /usr/share/nginx/html/css/
COPY img/ /usr/share/nginx/html/img/

# nginxの設定ファイルをコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ポート80を公開
EXPOSE 80

# nginx を起動
CMD ["nginx", "-g", "daemon off;"]
