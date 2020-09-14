import { ExpressServer } from './ExpressServer';
import { Environment } from './Environment';
import { RequestServices } from './types/CustomRequest';
import { MongoDBService } from './persistance/mongodb/MongoDBService';
import { PersonEndpoints } from './persons/PersonEndpoints';
import { PersonService } from './persons/PersonService';
import { PersonRepository } from './persons/PersonRepository';
import { GroupService } from './groups/GroupService';
import { GroupRepository } from './groups/GroupRepository';
import { GroupEndpoints } from './groups/GroupEndpoints';
import { DocumentService } from './documents/DocumentService';
import { DocumentRepository } from './documents/DocumentRepository';
import { DocumentEndpoints } from './documents/DocumentEndpoints';
import { StorageService } from './storage/StorageService';
import { StorageEndpoints } from './storage/StorageEndpoints';

/**
 * Wrapper around the Node process, ExpressServer abstraction and complex dependencies such as services
 * that ExpressServer needs.
 * When not using Dependency Injection, can be used as place for wiring together services which are
 * dependencies of ExpressServer.
 */
export class Application {
  static async createApplication(): Promise<ExpressServer> {
    const mongoDBService: MongoDBService = await this.initializeDatabaseConnection();

    // Person
    const personRepository = new PersonRepository(mongoDBService);
    const personService = new PersonService(personRepository);

    // Group
    const groupRepository = new GroupRepository(mongoDBService);
    const groupService = new GroupService(groupRepository);

    // Group
    const documentRepository = new DocumentRepository(mongoDBService);
    const documentService = new DocumentService(documentRepository);

    // Storage
    const storageService = new StorageService();

    const requestServices: RequestServices = {
      personService,
      groupService,
      documentService,
      storageService
    };

    const expressServer = new ExpressServer(
      new PersonEndpoints(),
      new GroupEndpoints(),
      new DocumentEndpoints(),
      new StorageEndpoints(),
      requestServices
    );

    await expressServer.setup(Environment.getAppPort());
    Application.handleExit(expressServer, mongoDBService);

    return expressServer;
  }

  private static handleExit(
    express: ExpressServer,
    mongoDBService: MongoDBService
  ) {
    process.on('uncaughtException', (err: Error) => {
      console.error('Uncaught exception', err);
      Application.shutdownProperly(1, express, mongoDBService);
    });
    process.on('unhandledRejection', (reason: {} | null | undefined) => {
      console.error('Unhandled Rejection at promise', reason);
      Application.shutdownProperly(2, express, mongoDBService);
    });
    process.on('SIGINT', () => {
      console.info('Caught SIGINT');
      Application.shutdownProperly(128 + 2, express, mongoDBService);
    });
    process.on('SIGTERM', () => {
      console.info('Caught SIGTERM');
      Application.shutdownProperly(128 + 2, express, mongoDBService);
    });
    process.on('exit', () => {
      console.info('Exiting');
    });
  }

  private static shutdownProperly(
    exitCode: number,
    express: ExpressServer,
    mongoDBService: MongoDBService
  ) {
    Promise.resolve()
      .then(() => express.kill())
      .then(() => {
        console.log('Closing database connection');
        mongoDBService.close();
        console.log('Database connection closed');
      })
      .then(() => {
        console.info('Shutdown complete');
        process.exit(exitCode); // eslint-disable-line no-process-exit
      })
      .catch((err) => {
        console.error('Error during shutdown', err);
        process.exit(1); // eslint-disable-line no-process-exit
      });
  }

  private static async initializeDatabaseConnection(): Promise<MongoDBService> {
    console.log('Initializing database connection');
    const mongoDBService = new MongoDBService(
      Environment.getDBHost(),
      Environment.getDBPort(),
      Environment.getDBName()
    );
    await mongoDBService.open();
    console.log('Database connection established');
    return mongoDBService;
  }
}
