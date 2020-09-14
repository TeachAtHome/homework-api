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
    query: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => Promise<Entity[]>;
  getAllCollectionEntries: (collectionName: string) => Promise<Entity[]>;
  deleteCollectionEntry: (
    collectionName: string,
    query: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => Promise<void>;
  updateCollectionEntry: (
    collectionName: string,
    query: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    objectToUpdate: Entity
  ) => Promise<void>;
}
