# Secure Prospect Finder

別のパソコンから使うための、Basic認証つき公開版です。

## 重要

この公開版でも、Google Places APIキーは保存しません。開くたびに手入力します。

サイト自体はBasic認証で守ります。URLを知っているだけの人は、ユーザー名とパスワードがないと開けません。

ただし、営業相手に送るサンプルページだけは認証なしで見られます。

```text
/samples/
/samples/salon-lp.html
/samples/clinic-lp.html
/samples/restaurant-lp.html
/samples/professional-hp.html
/samples/home-service-hp.html
```

管理画面は守り、サンプルだけを相手に見せる構成です。

## ローカル確認

```bash
BASIC_AUTH_USER=admin BASIC_AUTH_PASSWORD=好きなパスワード npm start
```

開くURL:

```text
http://localhost:3000
```

## Renderで公開する場合

1. この `secure-prospect-finder` フォルダをGitHubにアップロード
2. Renderで `New Web Service` を作成
3. リポジトリを選択
4. Start Commandを設定

```text
npm start
```

5. Environment Variablesを設定

```text
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=自分だけが知っている長いパスワード
```

6. Deploy

公開されたURLを別PCで開くと、まずユーザー名とパスワードを聞かれます。

公開後、管理画面の `公開URL` 欄にRenderなどで発行されたURLを入力してください。

```text
例: https://your-app-name.onrender.com
```

これを入れると、DM文面のサンプルURLが `file://...` ではなく、相手が開けるHTTPS URLになります。

## 注意

`BASIC_AUTH_PASSWORD` は短いものにしないでください。最低でも16文字以上がおすすめです。

例:

```text
WebFinder-2026-自分だけの文字列
```
