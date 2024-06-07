// vueCompiler.js
import { parse, compileTemplate } from '@vue/compiler-sfc';
import { getEntryPoint, getDepModulePath } from '../utils';
import path from 'path';

export default async function vueCompilerMiddleware(req, res, next) {
  const { url } = req;
  if (url.endsWith(".vue")) {
    const rootPath = process.cwd();
    const filePath = path.join(rootPath, url);
    const file = Bun.file(filePath);
    let content = await file.text();
    const { descriptor } = parse(content);
    const templateRender = compileTemplate({ source: descriptor.template.content ,id: filePath});
    content = templateRender.code;
    content += `
      const _sfc = {
        name: '${url.split('.')[0].substr(1)}',
      }
      _sfc.render = render
      export default _sfc
    `;

    // Simplify and centralize regex usage
    const regex = /from ['"](?!\.\/)([^'"]+)['"]/g;
    content = content.replace(regex, (_match, capture) => {
      const entryPoint = getEntryPoint(capture);
      return `from "${getDepModulePath(entryPoint)}"`;
    });

    res.writeHead(200, {"Content-Type": "text/javascript"});
    res.end(content);
    return;
  }
  next();
}