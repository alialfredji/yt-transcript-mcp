# yt-transcript-mcp

MCP server that fetches YouTube video transcripts. Works with Claude Code, Claude Desktop, OpenCode, and any MCP-compatible client.

## Prerequisites

- **Node.js** 18+
- **Python 3** (required by yt-dlp, which handles transcript fetching)

## Quick Install

### Claude Code

```bash
claude mcp add yt-transcript -- npx -y yt-transcript-mcp
```

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "yt-transcript": {
      "command": "npx",
      "args": ["-y", "yt-transcript-mcp"]
    }
  }
}
```

Restart Claude Desktop after saving.

### OpenCode

Edit `~/Library/Application Support/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "yt-transcript": {
      "type": "local",
      "command": ["npx", "-y", "yt-transcript-mcp"],
      "enabled": true
    }
  }
}
```

Restart OpenCode after saving.

## Usage

Once connected, the agent has access to the `get_transcript` tool.

**Examples:**

- *"Get the transcript of https://youtu.be/dQw4w9WgXcQ and summarize it"*
- *"Fetch the transcript from this video and list the main topics"*
- *"Get the Spanish transcript (lang: es) for this YouTube link"*

**Tool Parameters:**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `url`     | Yes      | -       | YouTube video URL |
| `lang`    | No       | `en`    | Subtitle language code (e.g. `es`, `fr`, `de`, `ja`) |

The tool returns the video title and full transcript as plain text.

## Local Development

```bash
git clone <repo-url>
cd yt-transcript-mcp
npm install
npm run build
npm start
```

## License

MIT
