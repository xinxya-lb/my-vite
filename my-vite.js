// server.js
import http from 'http';
import connect from 'connect';
import { indexHTMLMiddleware, replaceImportMiddleware,vueCompilerMiddleware } from './middlewares';
import color from 'picocolors';
const { PORT_HTTP, PROJECT_NAME } = process.env;
const middleware = connect();
middleware.use(vueCompilerMiddleware);
middleware.use(replaceImportMiddleware);
middleware.use(indexHTMLMiddleware);

http.createServer(middleware).listen(PORT_HTTP);
console.log(`${color.red(`${PROJECT_NAME}`)} `, color.green('SERVER ON!'));
