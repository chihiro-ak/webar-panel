# AGENTS.md

## Goal
MindAR + A-Frame で、同人イベント向けWebARのMVPを作る。
卓上POPを image target として認識したら、等身キャラを自動出現させる。

## MVP Scope
- image target 認識
- キャラ自動出現
- 外カメラ前提
- タップ不要
- 軽いアイドル演出
- ローカルスマホ確認 or GitHub Pages 確認
- README 整備

## Out of Scope
- 自撮りモード
- 床タップ配置
- 本格的な撮影機能
- 複雑なアニメーション
- 音声
- 3Dモデル化
- World Tracking ベースの空間固定

## Tech
- MindAR
- A-Frame
- セルフホスト前提
- MindAR 公式 docs / 公式 repo を source of truth にすること
- 不要な依存は増やしすぎないこと

## Inputs

### Character image
- 以下URLから等身イラストをダウンロードして使うこと
- https://hololive.hololivepro.com/wp-content/uploads/2023/09/Todoroki-Hajime_pr-img_02.png
- 実表示用には透明余白をtrimして扱うこと
- 元画像は保存し、trim版を別ファイルとして生成すること
- 後で別画像へ差し替えやすい構成にすること

### Target image
- 卓上POP画像はまだ未確定
- 仮のダミー卓上POP画像を作成して使うこと
- image target 用として、特徴量の多いデザインにすること
- QRだけ、ロゴだけ、線画だけのような認識しづらい画像は避けること
- 後で差し替えやすい構成にすること
- MindAR 用ターゲット生成手順も README に書くこと

## Character Rules
- キャラの見えている本体高さを約1.55mにする
- 透明余白込みで雑にスケールしない
- 横幅はアスペクト比維持
- 表示位置は target の少し右、少し前
- v1では target 基準の相対配置でよい
- v1では「POPを画角に入れている間の安定表示」を優先する

## Structure
推奨:
- public/
  - assets/
    - char/
      - source/
      - processed/
    - targets/
      - source/
      - compiled/
- src/
  - app.js
  - config/ar-config.js
  - components/spawn-character.js
  - components/idle-motion.js
  - components/status-ui.js
  - utils/trim-image.js
  - utils/generate-dummy-target.js
- scripts/
- README.md

必要なら多少変更してよいが、責務分離は維持すること。

## Behavior
- image target 検出時に一度だけ spawn
- 無駄な再生成をしない
- targetを見失った時の挙動は README に明記する
- v1では「targetを画角に入れている間に安定して見える」ことを優先する
- UI に「卓上POPにカメラを向けてください」を表示
- 検出後はUIを縮小または非表示

## Dev / Preview
以下のどちらか、または両方に対応すること:
1. 同一ネットワーク内スマホ確認
2. GitHub Pages 確認

README に必ず書くこと:
- セットアップ
- 起動方法
- スマホ確認方法
- GitHub Pages デプロイ方法
- キャラ差し替え方法
- target差し替え方法
- MindARターゲット再生成方法
- 身長変更方法
- オフセット変更方法

## Acceptance Criteria
- スマホで開ける
- image target 認識でキャラが自動出現する
- タップ不要
- 約155cm相当に見える
- 足元が不自然すぎない
- 差し替えしやすい
- README が揃っている

## Workflow
1. 最小構成を作る
2. 等身イラストをダウンロードする
3. trim処理を作る
4. ダミー卓上POP画像を生成する
5. MindAR用ターゲットファイルを生成する
6. そのダミーPOPで target 認識確認
7. 155cm基準でスケール調整
8. 自動spawn
9. idle演出
10. 動作確認手順整備
11. README整備
12. TODO整理

## Output
最終的に出すもの:
- ディレクトリ構成
- 実装コード
- README
- 既知の制約
- 次の改善候補