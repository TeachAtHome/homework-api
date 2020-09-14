import { Entity } from '../types/Entity';

export interface DatabaseService {
  open: () => Promise<void>;
  close: () => Promise<void>;
  addObject: (
    collectionName: string,
    objectToInsert: Entity
  ) => Promise<Entity>;
  getCollectionEntries: (
    collectionName: string,
    // tslint:disable-next-line:no-any
    query: any
  ) => Promise<Entity[]>;
  getAllCollectionEntries: (collectionName: string) => Promise<Entity[]>;
  deleteCollectionEntry: (
    collectionName: string,
    // tslint:disable-next-line:no-any
    query: any
  ) => Promise<void>;
  updateCollectionEntry: (
    collectionName: string,
    // tslint:disable-next-line:no-any
    query: any,
    objectToUpdate: Entity
  ) => Promise<void>;
}
