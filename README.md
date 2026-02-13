# yt-transcript-mcp

[![npm version](https://img.shields.io/npm/v/yt-transcript-mcp.svg)](https://www.npmjs.com/package/yt-transcript-mcp)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP server that fetches YouTube video transcripts. Works with Claude Code, Claude Desktop, OpenCode, and any MCP-compatible client.

**🚀 Now supports both local and remote deployment!**
- **Local mode**: stdio transport via `npx` (for desktop apps)
- **Remote mode**: HTTP/SSE transport (for mobile apps, cloud deployment)

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

## Remote Deployment

Deploy this MCP server to the cloud for remote access (e.g., from Claude mobile app).

### Deploy to Render (Free Tier)

1. Fork this repository on GitHub
2. Sign up for [Render](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` configuration
6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy your service URL (e.g., `https://yt-transcript-mcp.onrender.com`)

**Configure in Claude Desktop for remote access:**

```json
{
  "mcpServers": {
    "yt-transcript": {
      "url": "https://your-service.onrender.com/mcp",
      "transport": "sse"
    }
  }
}
```

**Note**: Render free tier has 750 hours/month limit and services may spin down after inactivity (cold starts).

### Deploy to Hetzner (or any Docker host)

1. SSH into your server
2. Clone the repository:
   ```bash
   git clone https://github.com/alialfredji/yt-transcript-mcp.git
   cd yt-transcript-mcp
   ```
3. Deploy with Docker Compose:
   ```bash
   docker-compose up -d
   ```
4. The server will be available at `http://your-server-ip:3000/mcp`
5. Set up a reverse proxy (nginx/caddy) with HTTPS for production use

**Configure in Claude Desktop:**

```json
{
  "mcpServers": {
    "yt-transcript": {
      "url": "https://your-domain.com/mcp",
      "transport": "sse"
    }
  }
}
```

### Manual Docker Deployment

```bash
# Build the image
docker build -t yt-transcript-mcp .

# Run the container
docker run -d \
  --name yt-transcript-mcp \
  -p 3000:3000 \
  -e NODE_ENV=production \
  --restart unless-stopped \
  yt-transcript-mcp

# Check health
curl http://localhost:3000/health
```

## Local Development

```bash
git clone https://github.com/alialfredji/yt-transcript-mcp.git
cd yt-transcript-mcp
npm install
npm run build

# Run in stdio mode (default)
npm start

# Or run in HTTP mode for testing
npm run dev:http
```
