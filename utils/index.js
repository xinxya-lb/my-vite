// utils.js
import fs from 'fs';
import path from 'path';

export function getEntryPoint(module) {
  if (!module.endsWith(".js")) {
    const package_file = `./node_modules/${module}/package.json`;
    const content = fs.readFileSync(package_file, "utf8");
    const result = JSON.parse(content);
    return `${module}/${result.module}`;
  }
  return module;
}
export  const depsPath = 'node_modules/.vite/deps'
export function getDepModulePath(module) {
  return path.join(getRelativePath("node_modules/.vite/deps"), module.split('/').at(-1));
}

export function getRelativePath(p = __dirname) {
  const rootPath = process.cwd();
  return path.join(path.relative(p, rootPath), p);
}
