# mcp-md-templates

An MCP server for managing and utilizing Markdown templates. You can manage various document templates such as meeting minutes, project proposals, bug reports, and daily standups in Markdown format and use them in connection with LLMs.

## Main Features

### 1. Using Templates
Retrieve and use existing Markdown templates for various documentation needs.

### 2. Registering Templates
Register new custom Markdown templates to expand your template library.

## Installation

### Using npx

Configuration example (claude_desktop_config.json):
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

### Using Node.js directly

1. Clone the repository:
```bash
git clone <repository-url>
cd mcp-md-templates
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Configure in claude_desktop_config.json:
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

## Environment Variables

| Variable Name | Description | Default Value |
|--------------|-------------|---------------|
| READ_ONLY | Whether to allow adding/modifying templates | false |
| TEMPLATES_DIR | Path to directory where template files are stored | ./resources |

## Available Templates

The following templates are included by default:

1. **meeting-minutes** - Standard meeting minutes template
2. **project-proposal** - Comprehensive project proposal template
3. **bug-report** - Detailed bug report template
4. **daily-standup** - Daily standup meeting notes template

## Usage Examples

### Getting a Template

Use the `get_template` tool to retrieve a Markdown template:

```
Tool: get_template
Arguments: {
  "style": "meeting-minutes"
}
```

### Registering a New Template

Use the `register_template` tool to add a new Markdown template:

```
Tool: register_template
Arguments: {
  "stylename": "code-review",
  "markdown": "# Code Review\n\n**PR Title:** ...\n**Author:** ...\n..."
}
```

## For Developers

### Project Structure

```
mcp-md-templates/
├── src/
│   ├── index.ts      # Entry point
│   └── templates.ts  # Main server implementation
├── resources/        # Default template directory
│   ├── meeting-minutes.md
│   ├── project-proposal.md
│   ├── bug-report.md
│   └── daily-standup.md
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

## License

This project is released under the MIT License.