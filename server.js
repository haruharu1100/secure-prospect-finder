const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;
const authUser = process.env.BASIC_AUTH_USER || "admin";
const authPass = process.env.BASIC_AUTH_PASSWORD;
const publicDir = path.join(__dirname, "public");

function unauthorized(res) {
  res.writeHead(401, {
    "WWW-Authenticate": 'Basic realm="Prospect Finder"',
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end("Authentication required");
}

function isAuthorized(req) {
  if (!authPass) return false;
  const header = req.headers.authorization || "";
  if (!header.startsWith("Basic ")) return false;

  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const separator = decoded.indexOf(":");
  if (separator < 0) return false;

  const user = decoded.slice(0, separator);
  const pass = decoded.slice(separator + 1);
  return user === authUser && pass === authPass;
}

function serveFile(res, filePath, options = {}) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    const type = ext === ".html" ? "text/html; charset=utf-8" : "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": "no-store",
      "X-Robots-Tag": options.allowIndex ? "noindex, follow" : "noindex, nofollow"
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = safePath === "/" ? path.join(publicDir, "index.html") : path.join(publicDir, safePath);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  if (safePath.startsWith("/samples/")) {
    serveFile(res, filePath, { allowIndex: true });
    return;
  }

  if (!isAuthorized(req)) {
    unauthorized(res);
    return;
  }

  serveFile(res, filePath);
});

server.listen(port, () => {
  console.log(`Secure Prospect Finder listening on port ${port}`);
});
