import express, { Express } from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import _ from 'lodash';
import path from 'path';

import { generateLogMessage } from '../lib/utilities';

/**
 * Web server setup.
 *
 * @param {Express}     server    - Web server instance.
 * @param {number}      httpPort  - HTTP port.
 * @param {number}      httpsPort - HTTPS port.
 * @param {fs.PathLike} httpsKey  - HTTPS private key (PEM format) file path.
 * @param {fs.PathLike} httpsCert - HTTPS certificate chain (PEM format) file path.
 * @param {fs.PathLike} httpsCa   - HTTPS certificate authority file path.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function webServerSetup(server: Express, httpPort: number, httpsPort: number, httpsKey: fs.PathLike, httpsCert: fs.PathLike, httpsCa: fs.PathLike): void {
  // Middleware.
  server.use(express.json());
  server.use(express.urlencoded({
    extended: true,
  }));

  // Templates.
  server.set('view engine', 'ejs');
  server.set('views', path.join(__dirname, '../views'));

  // HTTP web server.
  if (_.inRange(httpPort, 0, 65536)) {
    const httpServer = http.createServer(server);

    httpServer.listen(httpPort, () => {
      generateLogMessage(
        [
          'HTTP web server started',
          `(function: webServerSetup, port: ${httpPort})`,
        ].join(' '),
        30,
      );
    });
  }

  // HTTPS web server.
  if (
    _.inRange(httpsPort, 0, 65536)
    && fs.existsSync(httpsKey)
    && fs.existsSync(httpsCert)
    && fs.existsSync(httpsCa)
  ) {
    const httpsServer = https.createServer({
      key: fs.readFileSync(httpsKey, 'utf-8'),
      cert: fs.readFileSync(httpsCert, 'utf-8'),
      ca: fs.readFileSync(httpsCa, 'utf-8'),
    }, server);

    httpsServer.listen(httpsPort, () => {
      generateLogMessage(
        [
          'HTTPS web server started',
          `(function: webServerSetup, port: ${httpsPort})`,
        ].join(' '),
        30,
      );
    });
  }
}
