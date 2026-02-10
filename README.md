# YouTube Transcript MCP Server

Fetch YouTube video transcripts directly in Claude Code, Claude Desktop, or OpenCode.

## Prerequisites

Install `yt-dlp`:

```bash
brew install yt-dlp
```

## Installation

### 1. Build the Server

```bash
cd yt-transcript-mcp
npm install
npm run build
```

### 2. Connect to Your Client

#### Claude Code

```bash
claude mcp add yt-transcript -- node /Users/ali.alfredji/dev/vibe-code/yt-transcript-mcp/dist/index.js
```

#### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "yt-transcript": {
      "command": "node",
      "args": ["/Users/ali.alfredji/dev/vibe-code/yt-transcript-mcp/dist/index.js"]
    }
  }
}
```

Restart Claude Desktop.

#### OpenCode

```bash
opencode mcp add yt-transcript -- node /Users/ali.alfredji/dev/vibe-code/yt-transcript-mcp/dist/index.js
```

**Or** manually edit `.opencode/config.json`:

```json
{
  "mcp": {
    "yt-transcript": {
      "type": "stdio",
      "command": "node",
      "args": ["/Users/ali.alfredji/dev/vibe-code/yt-transcript-mcp/dist/index.js"]
    }
  }
}
```

## Usage

Once connected, the agent has access to the `get_transcript` tool.

**Examples:**

- *"Get the transcript of https://youtu.be/dQw4w9WgXcQ and summarize it"*
- *"Fetch the transcript from this video and list the main topics"*
- *"Get the Spanish transcript (lang: es) for this YouTube link"*

**Tool Parameters:**

- `url` (required): YouTube video URL
- `lang` (optional): Language code (default: `en`)

The tool returns the video title and full transcript as plain text.
