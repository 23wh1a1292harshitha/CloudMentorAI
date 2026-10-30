// Tiny static server — serves the frontend folder on http://localhost:3000
// No dependencies needed, uses Node built-ins only.
import { createServer } from "http";
import { readFile } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PORT = 3000;

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

createServer(async (req, res) => {
  // Default to ai-buddy-live.html
  const urlPath = req.url === "/" ? "/ai-buddy-live.html" : req.url;
  const filePath = join(__dirname, urlPath);

  try {
    const data = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found: " + urlPath);
  }
}).listen(PORT, () => {
  console.log(`Frontend running on http://localhost:${PORT}`);
  console.log(`Open → http://localhost:${PORT}/ai-buddy-live.html`);
});
