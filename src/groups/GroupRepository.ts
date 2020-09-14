import { Group } from './Group';
import { DatabaseService } from '../persistance/DatabaseService';

export class GroupRepository {
  private collectionName = 'groups';

  constructor(private databaseConnection: DatabaseService) {}

  async getGroupByName(name: string): Promise<Group | null> {
    const result = await this.databaseConnection.getCollectionEntries(
      this.collectionName,
      { name }
    );
    if (result.length >= 1) {
      return result[0] as Group;
    }
    return null;
  }

  async getAll(): Promise<Group[] | null> {
    return (await this.databaseConnection.getAllCollectionEntries(
      this.collectionName
    )) as Group[];
  }

  async addGroup(group: Group): Promise<Group> {
    return (await this.databaseConnection.addObject(
      this.collectionName,
      group
    )) as Group;
  }

  async updateGroup(group: Group): Promise<void> {
    await this.databaseConnection.updateCollectionEntry(
      this.collectionName,
      { name: group.name },
      group
    );
  }

  async checkGroupExists(group: Group): Promise<boolean> {
    const result = await this.databaseConnection.getCollectionEntries(
      this.collectionName,
      { name: group.name }
    );
    return result.length >= 1;
  }
}
