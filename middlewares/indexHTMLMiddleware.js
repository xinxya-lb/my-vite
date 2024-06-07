// middlewares/indexHTMLMiddleware.js
async function indexHTMLMiddleware(req, res, next) {
  if (req.url === '/') {
    const file = Bun.file('./index.html');
    const content = await file.text();
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(content);
    return;
  }
  next();
}

export default indexHTMLMiddleware;