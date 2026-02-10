# yt-transcript-mcp

[![npm version](https://img.shields.io/npm/v/yt-transcript-mcp.svg)](https://www.npmjs.com/package/yt-transcript-mcp)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP server that fetches YouTube video transcripts. Works with Claude Code, Claude Desktop, OpenCode, and any MCP-compatible client.

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

- _"Get the transcript of https://youtu.be/dQw4w9WgXcQ and summarize it"_
- _"Fetch the transcript from this video and list the main topics"_
- _"Get the Spanish transcript (lang: es) for this YouTube link"_

**Tool Parameters:**

| Parameter | Required | Default | Description                                          |
| --------- | -------- | ------- | ---------------------------------------------------- |
| `url`     | Yes      | -       | YouTube video URL                                    |
| `lang`    | No       | `en`    | Subtitle language code (e.g. `es`, `fr`, `de`, `ja`) |

The tool returns the video title and full transcript as plain text.

## Local Development

```bash
git clone https://github.com/alialfredji/yt-transcript-mcp.git
cd yt-transcript-mcp
npm install
npm run build
npm start
```
