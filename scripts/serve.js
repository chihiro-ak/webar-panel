#!/usr/bin/env node

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const rootDir = path.resolve(__dirname, "..");
const args = process.argv.slice(2);

function getArgValue(flag, fallback) {
  const index = args.indexOf(flag);
  if (index === -1) {
    return fallback;
  }
  return args[index + 1] ?? fallback;
}

const host = getArgValue("--host", "127.0.0.1");
const port = Number.parseInt(getArgValue("--port", "8080"), 10);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mind": "application/octet-stream",
  ".css": "text/css; charset=utf-8"
};

function resolveRequestPath(requestUrl) {
  const requestedPath = new URL(requestUrl, "http://localhost").pathname;
  const safePath = path.normalize(decodeURIComponent(requestedPath)).replace(/^(\.\.[/\\])+/, "");
  const normalizedPath =
    safePath === path.sep || safePath === "."
      ? "index.html"
      : safePath.replace(/^[/\\]/, "");
  const fullPath = path.join(rootDir, normalizedPath);

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return { filePath: fullPath, fallback: false };
  }

  if (!path.extname(normalizedPath)) {
    return { filePath: path.join(rootDir, "index.html"), fallback: true };
  }

  return { filePath: "", fallback: false };
}

const server = http.createServer((request, response) => {
  const { filePath, fallback } = resolveRequestPath(request.url || "/");
  if (!filePath) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found.");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[extension] || "application/octet-stream";
  const stream = fs.createReadStream(filePath);

  response.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": fallback ? "no-store" : "public, max-age=0"
  });

  stream.on("error", () => {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Failed to read file.");
  });

  stream.pipe(response);
});

server.listen(port, host, () => {
  const interfaces = os.networkInterfaces();
  const urls = [`http://${host}:${port}`];

  for (const networkInterface of Object.values(interfaces)) {
    for (const details of networkInterface || []) {
      if (details.family === "IPv4" && !details.internal) {
        urls.push(`http://${details.address}:${port}`);
      }
    }
  }

  console.log("Static server running:");
  for (const url of new Set(urls)) {
    console.log(`  ${url}`);
  }
});
