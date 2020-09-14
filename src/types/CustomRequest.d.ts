/* tslint:disable no-namespace */
import 'express'
import { PersonService } from '../persons/PersonService'
import { GroupService } from '../groups/GroupService'
import { DocumentService } from '../documents/DocumentService';
import { StorageService } from '../storage/StorageService';

export interface RequestServices {
    personService: PersonService
    groupService: GroupService
    documentService: DocumentService
    storageService: StorageService
}

declare global {
    namespace Express {
        interface Request {
            services: RequestServices
        }
    }
}
