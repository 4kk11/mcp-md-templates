# mcp-md-templates

Markdownテンプレートを管理・活用するためのMCPサーバーです。
議事録、プロジェクト提案書、バグレポート、デイリースタンドアップなど、様々なドキュメントテンプレートをMarkdown形式で管理し、LLMと連携して利用できます。

## 主な機能

### 1. テンプレートの利用
既存のMarkdownテンプレートを取得して、各種ドキュメント作成に活用できます。

### 2. テンプレートの登録
新しいカスタムテンプレートを登録して、テンプレートライブラリを拡張できます。

## インストール

### npxを使用する場合

設定例 (claude_desktop_config.json):
```json
{
  "mcpServers": {
    "md-templates": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-md-templates"
      ],
      "env": {
        "READ_ONLY": "false",
        "TEMPLATES_DIR": "YOUR_TEMPLATES_DIR"
      }
    }
  }
}
```

### Node.jsで直接実行する場合

1. リポジトリをクローン:
```bash
git clone <repository-url>
cd mcp-md-templates
```

2. 依存関係をインストール:
```bash
npm install
```

3. プロジェクトをビルド:
```bash
npm run build
```

4. claude_desktop_config.jsonに設定:
```json
{
  "mcpServers": {
    "md-templates": {
      "command": "node",
      "args": [
        "/path/to/mcp-md-templates/build/index.js"
      ],
      "env": {
        "READ_ONLY": "false",
        "TEMPLATES_DIR": "YOUR_TEMPLATES_DIR"
      }
    }
  }
}
```

## 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|--------------|
| READ_ONLY | テンプレートの追加・変更を許可するかどうか | false |
| TEMPLATES_DIR | テンプレートファイルを保存するディレクトリのパス | ./resources |

## 利用可能なテンプレート

デフォルトで以下のテンプレートが含まれています：

1. **meeting-minutes** - 標準的な会議議事録テンプレート
2. **project-proposal** - 包括的なプロジェクト提案書テンプレート
3. **bug-report** - 詳細なバグレポートテンプレート
4. **daily-standup** - デイリースタンドアップミーティングメモテンプレート

## 使用例

### テンプレートの取得

`get_template`ツールを使用してMarkdownテンプレートを取得します：

```
Tool: get_template
Arguments: {
  "style": "meeting-minutes"
}
```

### 新しいテンプレートの登録

`register_template`ツールを使用して新しいMarkdownテンプレートを追加します：

```
Tool: register_template
Arguments: {
  "stylename": "code-review",
  "markdown": "# コードレビュー\n\n**PRタイトル:** ...\n**作成者:** ...\n..."
}
```

## 開発者向け情報

### プロジェクト構造

```
mcp-md-templates/
├── src/
│   ├── index.ts      # エントリーポイント
│   └── templates.ts  # メインサーバー実装
├── resources/        # デフォルトテンプレートディレクトリ
│   ├── meeting-minutes.md
│   ├── project-proposal.md
│   ├── bug-report.md
│   └── daily-standup.md
├── package.json
├── tsconfig.json
└── README.md
```

### ビルド

```bash
npm run build
```

## ライセンス

このプロジェクトはMITライセンスの下でリリースされています。