# 制作スターター｜react-ts-tailwind

このフォルダーはEditable Starter Kitのテンプレート、またはそこから生成した案件です。
HTML・CSS・SCSS・TSXを、そのファイルとして直接編集できます。
ひな型を編集した場合、次に生成する案件へ変更が反映されます。生成済み案件は変更しません。
この版は、以前の単体版と同じ基本画面を別ファイルへ分離した新しいテンプレートです。

## 初回

通常生成では、依存導入・整形・検証まで自動実行します。
`--no-install`で生成した場合や、導入を再試行する場合は次を実行します。

```bash
nvm install
nvm use
npm run setup
npm run dev
```

nvmを使っていない場合は、対応するNode.js/npmを用意してからsetupを実行します。
`.nvmrc`は生成直後は24、setupで導入に成功すると実行したNode.jsの正確な版になります。
初回導入にはnpmレジストリーへの通信が必要です。

## コマンド

| コマンド             | 用途                                                   |
| -------------------- | ------------------------------------------------------ |
| npm run dev          | 開発サーバー。表示されたURLを開く                      |
| npm run setup        | 初回導入・版記録・整形・検証。エラー後の再試行にも使用 |
| npm run format       | ソースと設定をPrettierで整形                           |
| npm run format:check | 整形済みかを確認                                       |
| npm run build        | 配信用ファイルをdistへ生成。React版は型検査も実行      |
| npm run check        | 整形確認＋ビルド。React版はLintも実行                  |
| npm run preview      | build済みのdistを手元で確認                            |

setupは生成先のソースやREADMEも整形します。新規生成直後のファイルを対象に行う処理です。
preview自身は再buildしません。ソース変更後はbuildを実行してください。
サーバー停止はControl＋Cです。

## 後日再開・別PCで再現

```bash
nvm use
npm ci
npm run dev
```

Nodeが未導入なら先に`nvm install`を実行します。
node_modulesが導入済みで依存変更もなければ、毎回npm ciを実行する必要はありません。
package.json・package-lock.json・.nvmrcを保存し、共有します。

## バージョンの扱い

初回のpackage.jsonはlatest指定です。setupがnpmのengine・peer依存を確認して導入し、
導入した直接依存をpackage.jsonとpackage-lock.jsonの数値へ固定します。
@types/nodeは実行中のNode.jsと同じメジャーを選択します。
最新版同士に互換性がない場合は停止します。旧版や強制オプションへ自動変更しません。
新規案件の初回導入と、制作中の案件の更新は別の操作です。

## ファイルの担当

Static版はindex.htmlとpages/以下の.htmlを自動検出してビルドします。
共通JSの入口はsrc/scripts/main.jsです。同梱ページは相対リンクを使います。追加ページでもリンクと公開先の対応を確認します。

React版はsrc/main.tsx→App→layouts/AppLayout→pages/HomePage→features/counter/Counterの順です。
components/Buttonは共通部品です。ページフォルダーだけでURLは増えません。
React Router、外部の状態管理、APIクライアントは導入していません。
ButtonのclassNameは既定のクラスへ追加します。競合するTailwindクラスの自動整理はしません。

Sass版はsrc/styles/style.scssからFLOCSSの各ファイルを読み込みます。
ReactのCSS版・Tailwind版はsrc/styles/global.cssを使います。
Tailwind版はViteプラグイン＋通常のCSSで処理し、Sass経由にはしません。
@エイリアスはsrc/を指します。React版はTSのpathsにも対応を設定しています。

## 確認

カウントボタンを2回押し、0→1→2と変わることを確認します。
Static版はaboutページへの移動と、そこからホームへ戻れることも確認します。
Tabでボタンへ移動し、輪郭・Enter／Space操作を確認してください。
狭い画面・拡大表示・読み上げも利用環境で確認します。

テンプレートとして動作確認した後も、node_modules・dist・lock等は案件の生成時にコピーされません。
ただしpackage.jsonの変更はコピーされます。新規案件でlatestを解決したい場合は、
テンプレートのdependencies／devDependenciesの指定をlatestへ戻してから生成します。
setupをテンプレート内で実行すると、そのpackage.json自体が数値で固定されるためです。
ひな型の確認には、まず--no-installで作った確認用案件を使う方法もあります。

## 公式資料

- https://vite.dev/guide/
- https://tailwindcss.com/docs/installation/using-vite
- https://tailwindcss.com/docs/compatibility
- https://react.dev/learn
- https://typescript-eslint.io/getting-started/

生成ツールの版：2.2.0／作成日：2026-10-31
