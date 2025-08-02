# mcp-md-templates

Markdownテンプレートを管理・活用するためのMCPサーバーです。
議事録、プロジェクト提案書、バグレポート、デイリースタンドアップなど、様々なドキュメントテンプレートをMarkdown形式で管理し、LLMと連携して利用できます。

## 主な機能

### 1. テンプレートの利用
既存のテンプレートを取得して活用

### 2. テンプレートの登録
新しいテンプレートを登録

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

## 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|--------------|
| READ_ONLY | テンプレートの追加・変更を許可するかどうか | false |
| TEMPLATES_DIR | テンプレートファイルを保存するディレクトリのパス | - |

## 開発者向け

### ソースからビルド

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

開発用設定例 (claude_desktop_config.json):
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

## ライセンス

このプロジェクトはMITライセンスの下でリリースされています。詳細は[LICENSE](LICENSE)ファイルを参照してください。