# WebAR Panel MVP

## 写真撮影・保存

画面右下の丸いカメラボタンを押すと、現在のカメラ映像とA-Frame上のAR表示を1枚のPNGとして合成します。撮影後にプレビューが開くので、`保存` を押して端末へ保存してください。

スマホブラウザではOSやブラウザの仕様により、`保存` ボタンで直接ダウンロードされる場合と、画像が別タブまたはプレビューとして開く場合があります。直接保存されない場合は、表示された画像を長押しして写真へ保存してください。

撮影対象:
- MindARのカメラ映像
- A-Frame canvas上に描画されたキャラと演出

既知の制約:
- ブラウザのカメラ権限がない状態では撮影できません。
- targetを見失ってキャラが非表示の状態では、カメラ映像のみの写真になります。
- v1では端末の写真アプリへ自動登録せず、ブラウザの保存/共有挙動に任せます。

MindAR + A-Frame で、卓上POPを image target として認識したら等身キャラを自動表示する WebAR MVP です。外カメラ前提、タップ不要、安定表示優先の構成にしています。

## セットアップ

1. Node.js 20 以上を用意します。
2. 依存をインストールします。

```bash
npm install
```

3. アセットを所定の場所へ整えたあと、trim済み画像を生成します。

```bash
npm run prepare:assets
```

## ディレクトリ構成

```text
.
├─ index.html
├─ public/
│  └─ assets/
│     ├─ char/
│     │  ├─ source/
│     │  └─ processed/
│     └─ targets/
│        ├─ source/
│        └─ compiled/
├─ scripts/
│  ├─ prepare-assets.js
│  └─ serve.js
└─ src/
   ├─ app.js
   ├─ components/
   └─ config/
```

## 起動方法

ローカル確認用:

```bash
npm start
```

同一ネットワーク内のスマホ確認用:

```bash
npm run start:host
```

起動後に表示される `http://<PCのIPアドレス>:8080` をスマホで開いてください。スマホ側ブラウザは HTTPS 制約の影響を受ける場合があるため、同一LAN確認では Chrome / Safari のカメラ権限を許可してください。

## スマホでの動作確認手順

1. `npm run prepare:assets` を実行します。
2. `npm run start:host` を実行します。
3. PC とスマホを同じネットワークに接続します。
4. 表示された LAN URL をスマホで開きます。
5. カメラ権限を許可します。
6. `target.png` と同じ卓上POPを画角に入れます。
7. POP の少し右、少し前にキャラが自動表示されることを確認します。
8. target を見失うと表示は消え、再び同じ target を写すと同じキャラ表示が戻ります。

## GitHub Pages デプロイ方法

1. このリポジトリの内容をそのまま GitHub リポジトリへ push します。
2. `Settings` > `Pages` でデプロイ元を対象ブランチの `/ (root)` に設定します。
3. 公開 URL で `index.html` が配信されることを確認します。
4. スマホで GitHub Pages の URL を開き、カメラ権限を許可して動作確認します。

GitHub Pages は HTTPS 配信になるため、スマホ実機確認に向いています。

## 使用アセット

- キャラ元画像: `public/assets/char/source/Todoroki-Hajime_pr-img_02.png`
- trim済み画像: `public/assets/char/processed/Todoroki-Hajime_pr-img_02.trimmed.png`
- target source image: `public/assets/targets/source/target.png`
- MindAR compiled target: `public/assets/targets/compiled/targets.mind`
- GitHub Pages runtime copies: `targets.mind`, `character.png`

この構成では、既存の `targets.mind` は `target.png` から生成済みである前提です。GitHub Pages の配信安定性を優先して、実行時はルート直下の `targets.mind` と `character.png` も参照しています。

## キャラ差し替え方法

1. 新しい立ち絵 PNG を `public/assets/char/source/` に置きます。
2. `src/config/ar-config.js` の `assets.characterSourceSrc` と `assets.characterProcessedSrc` を新しいファイル名へ変更します。
3. `scripts/prepare-assets.js` の `sourceCharacterPath` と `processedCharacterPath` も同じファイル名へ合わせます。
4. `npm run prepare:assets` を実行して trim 版を再生成します。
5. 必要に応じて `character.visibleHeightMeters` や `character.offset` を調整します。

元画像は保持し、trim 版を別ファイルとして運用します。

## target 差し替え方法

1. 新しい target 画像を `public/assets/targets/source/` に置きます。
2. `src/config/ar-config.js` の `assets.targetPreviewSrc` を新しいファイル名へ更新します。
3. 公式コンパイラで `.mind` を再生成し、`public/assets/targets/compiled/` に配置します。
4. `src/config/ar-config.js` の `assets.targetMindSrc` を必要に応じて更新します。
5. スマホで再度認識確認を行います。

## MindAR target 再生成方法

MindAR の公式 image target compiler を使って、source image から `.mind` を生成します。

1. `public/assets/targets/source/target.png` を用意します。
2. MindAR 公式 compiler を開きます。
3. source image をアップロードして `.mind` を生成します。
4. 出力した `.mind` を `public/assets/targets/compiled/targets.mind` に置き換えます。
5. 必要なら README の asset 名称も更新します。

公式情報:
- [MindAR docs](https://hiukim.github.io/mind-ar-js-doc/)
- [MindAR repository](https://github.com/hiukim/mind-ar-js)

## 身長変更方法

`src/config/ar-config.js` の `character.visibleHeightMeters` を変更してください。表示サイズは trim 済み画像の実可視領域を基準に計算されるため、透明余白込みではスケールしません。

## オフセット変更方法

`src/config/ar-config.js` の `character.offset` を調整してください。

- `x`: 右方向
- `y`: 上方向の微調整
- `z`: target から前に出す量

## 現在の挙動

- image target 検出時に一度だけキャラ entity を生成します。
- 同じ session 内では再検出しても再生成せず、表示の ON/OFF のみ行います。
- target を見失った時は character も非表示になります。
- v1 では床への厳密な接地は行いません。
- v1 では target が画角に入っている間の安定表示を優先しています。

## 既知の制約

- rear camera の明示固定は端末やブラウザ依存のため、実運用では外カメラ端末での確認が必要です。
- 2D 立ち絵 plane 表示のため、回り込み表現や厳密な接地感はありません。
- target 画像を差し替えた場合は、必ず対応する `.mind` を再生成してください。
- LAN 配信では端末によって HTTPS 制約や権限挙動に差があります。

## 今後の拡張 TODO

- GitHub Actions で GitHub Pages 自動デプロイを追加する
- target と `.mind` の整合チェックをスクリプト化する
- 複数 character / 複数 target 対応に拡張する
- 軽い影表現や接地補助で見た目を改善する
- target 検出安定化のパラメータ比較を実機別に記録する
