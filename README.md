# mcp-md-templates

An MCP server for managing and utilizing Markdown templates.
You can manage various document templates such as meeting minutes, project proposals, bug reports, and daily standups in Markdown format and use them in connection with LLMs.

## Main Features

### 1. Using Templates
Retrieve and use existing templates

### 2. Registering Templates
Register new templates

## Installation

### Using Docker

1. Pull Docker image
```bash
docker pull yourusername/mcp-md-templates
```

2. Configuration example (claude_desktop_config.json)
```json
{
  "mcpServers": {
    "md-templates": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "YOUR_TEMPLATES_DIR:/app/resources",
        "-e",
        "READ_ONLY",
        "yourusername/mcp-md-templates"
      ],
      "env": {
        "READ_ONLY": "false"
      }
    }
  }
}
```

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

## Environment Variables

> **Note**: When using Docker, the template directory must be specified using Docker volume mount (`-v YOUR_TEMPLATES_DIR:/app/resources`) instead of environment variables.

| Variable Name | Description | Default Value |
|--------------|-------------|---------------|
| READ_ONLY | Whether to allow adding/modifying templates | false |
| TEMPLATES_DIR | Path to directory where template files are stored | - |

## For Developers

### Building and Managing Docker Images

```bash
# Build Docker image
make docker-build

# Remove Docker image
make docker-clean
```

Development configuration example (claude_desktop_config.json):
```json
{
  "mcpServers": {
    "md-templates": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "YOUR_TEMPLATES_DIR:/app/resources",
        "-e",
        "READ_ONLY",
        "mcp-md-templates"
      ],
      "env": {
        "READ_ONLY": false
      }
    }
  }
}
```

### Building from source

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


## License

This project is released under the MIT License. See [LICENSE](LICENSE) file for details.