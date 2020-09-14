import { GroupRepository } from './GroupRepository';
import { Group } from './Group';
import {
  GroupAlreadyExistingException,
  GroupNotFoundException
} from '../types/ErrorTypes';

export class GroupService {
  constructor(private groupRepository: GroupRepository) {}

  async listAllGroups(): Promise<Group[]> {
    const groups = await this.groupRepository.getAll();
    if (!groups) {
      throw new GroupNotFoundException();
    }
    return groups;
  }

  async getGroup(name: string): Promise<Group> {
    const group = await this.groupRepository.getGroupByName(name);
    if (!group) {
      throw new GroupNotFoundException();
    }
    return group;
  }

  async checkGroupExists(name: string): Promise<boolean> {
    const group = await this.groupRepository.getGroupByName(name);
    return group !== null;
  }

  async addGroup(name: string, personIds: string[]): Promise<Group> {
    const group = { id: undefined, name, personIds };
    if (!(await this.groupRepository.checkGroupExists(group))) {
      return this.groupRepository.addGroup(group);
    }
    throw new GroupAlreadyExistingException();
  }

  async updateGroup(name: string, personIds: string[]): Promise<void> {
    const group = { id: undefined, name, personIds };
    if (await this.groupRepository.checkGroupExists(group)) {
      await this.groupRepository.updateGroup(group);
    }
    throw new GroupAlreadyExistingException();
  }
}
