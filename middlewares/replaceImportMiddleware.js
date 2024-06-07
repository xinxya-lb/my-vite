// middlewares/replaceImportMiddleware.js
import { getEntryPoint, getDepModulePath,depsPath } from '../utils';
import path from 'path';
import fs from 'fs';

async function replaceImportMiddleware(req, res, next) {
  if (req.url.endsWith('.js')) {
    const rootPath = process.cwd();
    const filePath = path.join(rootPath, req.url);
    const file = Bun.file(filePath);
    let content = await file.text();
    const regex = /from ['"](?!\.\/)([^'"]+)['"]/g;
    // pre-bundling
    const matches = content.match(regex)
    if (matches) {
      const mod_regex = /['"](?!\.\/)([^'"]+)['"]/
      const modules = matches
        .map((m) => {
          return m.match(mod_regex)[1]
        })
        .map(getEntryPoint)
        try{
          await fs.promises.stat(depsPath)
        }catch{
          Bun.build({
            entryPoints: modules.map((m) => `./node_modules/${m}`),
            outdir: "./node_modules/.vite/deps",
          })
        }
      content = content.replace(regex, (_match, capture) => {
        const entryPoint = getEntryPoint(capture);
        return `from "${getDepModulePath(entryPoint)}"`;
      });
    }
    res.writeHead(200, { "Content-Type": "text/javascript" });
    res.end(content);
    return;
  }
  next();
}

export default replaceImportMiddleware;