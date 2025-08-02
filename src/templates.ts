/**
 * MCPサーバーの実装
 * Markdownテンプレートをリソースとして提供する
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
  Resource,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// ESModuleでの__dirnameの代替実装
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 環境変数からREAD_ONLYフラグを取得
const isReadOnly = process.env.READ_ONLY === 'true';

/**
 * MCPサーバーインスタンスを作成する
 * リソース機能のみを有効にした設定で初期化
 */
export const createServer = async () => {
  const server = new Server(
    {
      name: "mcp-md-templates",
      version: "1.0.0",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  // テンプレート関連のパス設定
  const TEMPLATES_DIR = process.env.TEMPLATES_DIR 
    ? path.resolve(process.env.TEMPLATES_DIR) 
    : path.join(__dirname, "../resources");

  // テンプレート情報を管理するMap
  const templates = new Map<string, Resource>();

  // テンプレート情報の読み込み
  const loadTemplateInfo = async () => {
    try {
      const files = await fs.readdir(TEMPLATES_DIR);
      const mdFiles = files.filter(file => file.endsWith('.md'));
      
      for (const file of mdFiles) {
        const stylename = path.basename(file, '.md');
        templates.set(stylename, {
          uri: `templates://template/${stylename}`,
          name: stylename,
          mimeType: "text/markdown",
        });
      }
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  };

  // 初期化
  await loadTemplateInfo();

  /**
   * リソース一覧の取得ハンドラー
   * クライアントが利用可能なMarkdownテンプレートの一覧を返す
   */
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: Array.from(templates.values()),
    };
  });

  /**
   * リソーステンプレートの取得ハンドラー
   * 将来的に複数のスタイルに対応できるようURIテンプレートを定義
   */
  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
    return {
      resourceTemplates: [
        {
          uriTemplate: "templates://template/{style}",
          name: "Markdown Template",
          description: "Markdown templates with different styles",
        },
      ],
    };
  });

  /**
   * リソース内容の読み取りハンドラー
   * 指定されたURIに対応するMarkdownテンプレートを返す
   */
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    const template = Array.from(templates.entries()).find(([_, resource]) => resource.uri === uri);

    if (template) {
      const [style, resource] = template;
      const templatePath = path.join(TEMPLATES_DIR, `${style}.md`);
      
      const content = await fs.readFile(templatePath, "utf-8");
      return {
        contents: [
          {
            ...resource,
            text: content,
          },
        ],
      };
    }

    // 未知のURIの場合はエラー
    throw new Error(`Unknown resource: ${uri}`);
  });

  /**
   * テンプレート取得ツールの入力スキーマ
   */
  // スタイル選択のスキーマを動的に生成
  const createGetTemplateSchema = () => {
    const styles = Array.from(templates.keys());
    if (styles.length === 0) {
      console.error("No templates available");
    }
    return z.object({
      style: z.enum(styles as [string, ...string[]])
        .describe("Template style name (available options: " + styles.join(", ") + ")"),
    });
  };

  /**
   * テンプレート登録ツールの入力スキーマ
   */
  const RegisterTemplateSchema = z.object({
    stylename: z.string()
      .describe("Style name for the template to register")
      .min(1),
    markdown: z.string()
      .describe("Markdown content of the template")
      .min(1),
  });


  enum ToolName {
    GET_TEMPLATE = "get_template",
    REGISTER_TEMPLATE = "register_template",
  }
  /**
   * 利用可能なツール一覧の取得ハンドラー
   */
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools: Tool[] = [
      {
        name: ToolName.GET_TEMPLATE,
        description: "Tool to retrieve Markdown templates (when using templates, names must be in alphabet)",
        inputSchema: zodToJsonSchema(createGetTemplateSchema()) as Tool["inputSchema"],
      },
    ];

    // READ_ONLYモードでない場合のみregister_templateツールを追加
    if (!isReadOnly) {
      tools.push({
        name: ToolName.REGISTER_TEMPLATE,
        description: "Tool to register new Markdown templates (must preview before registration)",
        inputSchema: zodToJsonSchema(RegisterTemplateSchema) as Tool["inputSchema"],
      });
    }

    return { tools };
  });

  /**
   * ツール実行ハンドラー
   */
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === ToolName.GET_TEMPLATE) {
      const validatedArgs = createGetTemplateSchema().parse(args);
      const template = templates.get(validatedArgs.style);
      
      if (!template) {
        throw new Error(`Template style "${validatedArgs.style}" not found`);
      }

      const templatePath = path.join(TEMPLATES_DIR, `${validatedArgs.style}.md`);

      const content = await fs.readFile(templatePath, "utf-8");
      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    }

    if (name === ToolName.REGISTER_TEMPLATE) {
      // READ_ONLYモードの場合はエラーを返す
      if (isReadOnly) {
        throw new Error('Template registration is not allowed in read-only mode');
      }
      const validatedArgs = RegisterTemplateSchema.parse(args);
      const { stylename, markdown } = validatedArgs;

      // テンプレートファイルを保存
      const templatePath = path.join(TEMPLATES_DIR, `${stylename}.md`);
      await fs.writeFile(templatePath, markdown, "utf-8");

      // テンプレート情報を登録
      templates.set(stylename, {
        uri: `templates://template/${stylename}`,
        name: stylename,
        mimeType: "text/markdown",
      });

      return {
        content: [
          {
            type: "text",
            text: `Template "${stylename}" has been registered successfully.`,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  });
  return { server, templates };
};