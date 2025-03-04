# Node.js 20 の slim イメージを使用（Debian ベース）
FROM node:20-slim

# 必要なパッケージ（curl, unzip など）をインストール
RUN apt-get update && \
    apt-get install -y curl unzip && \
    rm -rf /var/lib/apt/lists/*

# npm を使用して bun をグローバルインストール
RUN npm install -g bun

# 作業ディレクトリの設定
WORKDIR /app

# package.json と bun.lockb（存在する場合）をコピー
COPY package.json bun.lockb* ./

# bun を使用して依存パッケージをインストール
RUN bun install

# アプリケーションのソースコードをコピー
COPY . .

# Cloud Run で利用するポート（例: 8080）を公開
EXPOSE 8080

# アプリケーションの起動（package.json の "start" スクリプトを実行）
CMD ["bun", "run", "serve"]
