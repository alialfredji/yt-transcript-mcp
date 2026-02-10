#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execFile } from "child_process";
import { promisify } from "util";
import { mkdtemp, readdir, readFile, rm } from "fs/promises";
import { tmpdir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function checkPython3(): Promise<void> {
  try {
    await execFileAsync("python3", ["--version"]);
  } catch {
    throw new Error(
      "Python 3 is required but was not found on your system. " +
        "yt-dlp depends on Python 3 to run. " +
        "Please install Python 3: https://www.python.org/downloads/"
    );
  }
}

function getBundledYtDlp(): string {
  // Get the directory where this script is running from
  const __dirname = dirname(fileURLToPath(import.meta.url));
  // Go up one level from dist/ to the project root and find yt-dlp
  return join(__dirname, "..", "yt-dlp");
}

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

/**
 * Strip VTT formatting and return clean plain-text transcript.
 */
function vttToPlainText(vtt: string): string {
  return vtt
    .split("\n")
    .filter((line) => {
      if (/^WEBVTT/.test(line)) return false;
      if (/^Kind:/.test(line)) return false;
      if (/^Language:/.test(line)) return false;
      if (/^NOTE/.test(line)) return false;
      if (/^\d{2}:\d{2}:\d{2}\.\d{3}\s*-->/.test(line)) return false;
      if (/^\s*$/.test(line)) return false;
      return true;
    })
    .map((line) => line.replace(/<[^>]+>/g, "").trim())
    .filter(Boolean)
    .reduce<string[]>((acc, line) => {
      // de-duplicate consecutive identical lines (auto-subs repeat)
      if (acc.length === 0 || acc[acc.length - 1] !== line) {
        acc.push(line);
      }
      return acc;
    }, [])
    .join("\n");
}

async function fetchTranscript(
  url: string,
  lang: string
): Promise<{ transcript: string; videoTitle: string }> {
  const ytDlp = getBundledYtDlp();

  // Get video title first
  let videoTitle = "Unknown";
  try {
    const { stdout } = await execFileAsync(ytDlp, [
      "--no-check-certificates",
      "--skip-download",
      "--print",
      "title",
      url,
    ]);
    videoTitle = stdout.trim();
  } catch {
    // non-critical, continue
  }

  // Download subtitles to a temp directory
  const tmpDir = await mkdtemp(join(tmpdir(), "yt-transcript-"));

  try {
    await execFileAsync(
      ytDlp,
      [
        "--no-check-certificates",
        "--skip-download",
        "--write-subs",
        "--write-auto-subs",
        "--sub-lang",
        `${lang}.*`,
        "--sub-format",
        "vtt",
        "-o",
        join(tmpDir, "sub"),
        url,
      ],
      { timeout: 60_000 }
    );

    // Find the .vtt file
    const files = await readdir(tmpDir);
    const vttFile = files.find((f) => f.endsWith(".vtt"));

    if (!vttFile) {
      throw new Error(
        `No ${lang} subtitles found for this video. The video may not have subtitles available.`
      );
    }

    const vttContent = await readFile(join(tmpDir, vttFile), "utf-8");
    const transcript = vttToPlainText(vttContent);

    if (!transcript) {
      throw new Error("Subtitles file was empty after processing.");
    }

    return { transcript, videoTitle };
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "yt-transcript",
  version: "1.0.0",
});

server.tool(
  "get_transcript",
  "Fetch the transcript / subtitles of a YouTube video. Returns the full plain-text transcript that you can then summarize, analyze, or answer questions about.",
  {
    url: z
      .string()
      .describe(
        "YouTube video URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)"
      ),
    lang: z
      .string()
      .default("en")
      .describe(
        'Subtitle language code (default: "en"). Examples: "en", "es", "fr", "de", "ja"'
      ),
  },
  async ({ url, lang }) => {
    if (!isYouTubeUrl(url)) {
      return {
        content: [
          {
            type: "text" as const,
            text: "Error: The provided URL does not appear to be a YouTube link. Please provide a youtube.com or youtu.be URL.",
          },
        ],
        isError: true,
      };
    }

    try {
      const { transcript, videoTitle } = await fetchTranscript(url, lang);

      return {
        content: [
          {
            type: "text" as const,
            text: `# Transcript: ${videoTitle}\n\n${transcript}`,
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error fetching transcript: ${message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main() {
  await checkPython3();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
