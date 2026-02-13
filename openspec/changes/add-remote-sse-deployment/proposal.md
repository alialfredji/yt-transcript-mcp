## Why

The current MCP server only supports stdio transport, limiting it to local machine usage. To enable mobile access (Claude mobile app) and public sharing, we need remote deployment capability. This allows the YouTube transcript tool to be accessible from anywhere via HTTPS, while maintaining backward compatibility for local users.

## What Changes

- **Add HTTP/SSE Transport**: Implement `StreamableHTTPServerTransport` from @modelcontextprotocol/sdk alongside existing stdio transport
- **Dual-mode Operation**: Support `--stdio` flag for local use, `--http` flag for server mode
- **Containerization**: Create Dockerfile with Node.js, Python 3, and bundled yt-dlp binary
- **Render Deployment**: Add `render.yaml` for one-click deployment to Render's free tier
- **Hetzner Deployment**: Add `docker-compose.yml` for self-hosted deployment
- **Environment Configuration**: Support `PORT` environment variable for cloud platforms
- **Session Management**: Implement in-memory session store for HTTP transport with reconnection support
- **Documentation Updates**: Add deployment instructions for Render and Hetzner

**Breaking Changes**: None - this is fully backward compatible

## Capabilities

### New Capabilities
- `http-sse-transport`: HTTP/SSE transport endpoint at `/mcp` for remote access
- `container-deployment`: Docker containerization with Python 3 + yt-dlp dependencies
- `render-deployment`: Render platform deployment configuration
- `hetzner-deployment`: Docker Compose configuration for self-hosted servers

### Modified Capabilities
- `cli-interface`: Existing stdio transport now selectable via `--stdio` flag (default behavior unchanged)

## Impact

**Affected Files:**
- `src/index.ts`: Add HTTP transport, dual-mode logic, session management
- `package.json`: Add `express` types to devDependencies, update scripts
- New files: `Dockerfile`, `render.yaml`, `docker-compose.yml`, `.dockerignore`
- Documentation: `README.md` with deployment instructions

**Dependencies:**
- No new runtime dependencies (Express already included in @modelcontextprotocol/sdk v1.26.0)
- DevDependencies: `@types/express` for TypeScript support

**APIs/Endpoints:**
- New HTTP endpoint: `POST /mcp` (MCP JSON-RPC over SSE)
- Healthcheck endpoint: `GET /health` for platform monitoring

**Systems:**
- Deployment platforms: Render (serverless containers), Hetzner (Docker)
- No database or persistent storage needed (in-memory session management)
