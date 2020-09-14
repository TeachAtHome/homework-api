import * as express from 'express';
import { Express } from 'express';
import { Server } from 'http';
import * as compress from 'compression';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import * as cookieParser from 'cookie-parser';
import * as fileUpload from 'express-fileupload';
import * as RateLimit from 'express-rate-limit';
import * as noCache from 'nocache';

import { noCacheMiddleware } from './middlewares/NoCacheMiddleware';
import { RequestServices } from './types/CustomRequest';
import { addServicesToRequest } from './middlewares/ServiceDependenciesMiddleware';
// import { Environment } from './Environment'
import { PersonEndpoints } from './persons/PersonEndpoints';
import { GroupEndpoints } from './groups/GroupEndpoints';
import { DocumentEndpoints } from './documents/DocumentEndpoints';
import { StorageEndpoints } from './storage/StorageEndpoints';

/**
 * Abstraction around the raw Express.js server and Nodes' HTTP server.
 * Defines HTTP request mappings, basic as well as request-mapping-specific
 * middleware chains for application logic, config and everything else.
 */
export class ExpressServer {
  private server?: Express;
  private httpServer?: Server;

  constructor(
    private personEndpoints: PersonEndpoints,
    private groupEndpoints: GroupEndpoints,
    private documentEndpoints: DocumentEndpoints,
    private storageEndpoints: StorageEndpoints,
    private requestServices: RequestServices
  ) {}

  async setup(port: number) {
    const server = express();
    this.setupStandardMiddlewares(server);
    this.setupSecurityMiddlewares(server);
    // this.applyWebpackDevMiddleware(server)
    this.setupServiceDependencies(server);
    this.configureApiEndpoints(server);

    this.httpServer = this.listen(server, port);
    this.server = server;
    return this.server;
  }

  listen(server: Express, port: number) {
    console.info(`Starting server on port ${port}`);
    return server.listen(port);
  }

  kill() {
    if (this.httpServer) this.httpServer.close();
  }

  private setupSecurityMiddlewares(server: Express) {
    server.use(hpp());
    server.use(helmet());
    server.use(helmet.referrerPolicy({ policy: 'same-origin' }));
    server.use(noCache());
    server.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'unsafe-inline'"],
          scriptSrc: ["'unsafe-inline'", "'self'"]
        }
      })
    );
  }

  private setupStandardMiddlewares(server: Express) {
    server.use(express.json());
    server.use(cookieParser());
    server.use(compress());
    server.use(
      fileUpload({
        createParentPath: true,
        useTempFiles: true
      })
    );

    const baseRateLimitingOptions = {
      windowMs: 15 * 60 * 1000, // 15 min in ms
      max: 1000,
      message:
        'Our API is rate limited to a maximum of 1000 requests per 15 minutes, please lower your request rate'
    };
    server.use('/api/', new RateLimit(baseRateLimitingOptions));
  }

  private setupServiceDependencies(server: Express) {
    const servicesMiddleware = addServicesToRequest(this.requestServices);
    server.use(servicesMiddleware);
  }

  // private applyWebpackDevMiddleware(server: Express) {
  //     if (Environment.isLocal()) {
  //         const config = require('../../webpack.config.js')
  //         const compiler = require('webpack')(config)

  //         const webpackDevMiddleware = require('webpack-dev-middleware')
  //         server.use(
  //             webpackDevMiddleware(compiler, {
  //                 hot: true,
  //                 publicPath: config.output.publicPath,
  //                 compress: true,
  //                 host: 'localhost',
  //                 port: Environment.getPort()
  //             })
  //         )

  //         const webpackHotMiddleware = require('webpack-hot-middleware')
  //         server.use(webpackHotMiddleware(compiler))
  //     }
  // }

  private configureApiEndpoints(server: Express): void {
    // Person
    server.get(
      '/api/student/:id',
      noCacheMiddleware,
      this.personEndpoints.getStudent
    );
    server.get(
      '/api/student',
      noCacheMiddleware,
      this.personEndpoints.getAllStudents
    );
    server.post(
      '/api/student',
      noCacheMiddleware,
      this.personEndpoints.postStudent
    );

    // Group
    server.get('/api/group/:name', this.groupEndpoints.getGroup);
    server.get(
      '/api/group/:name/students',
      this.groupEndpoints.getStudentsByGroup
    );
    server.get('/api/group', this.groupEndpoints.getAllGroups);
    server.post('/api/group', this.groupEndpoints.postGroup);

    // Document
    server.post(
      '/api/document',
      this.documentEndpoints.postLinkDocumentToGroups
    );
    server.get(
      '/api/document/:documentRefId',
      this.documentEndpoints.getDocument
    );
    server.get('/api/document', this.documentEndpoints.getAllDocuments);
    server.delete(
      '/api/document/deleteDocument/:documentRefId',
      this.documentEndpoints.deleteDocument
    );

    // Storage
    server.put('/api/storage/upload', this.storageEndpoints.uploadDocument);
    server.get(
      '/api/storage/download/:documentRefId',
      this.storageEndpoints.downloadDocument
    );
    server.get(
      '/api/storage/document/:documentRefId',
      this.storageEndpoints.getDocument
    );
    server.post('/api/storage/store', this.storageEndpoints.storeDocument);
  }
}
