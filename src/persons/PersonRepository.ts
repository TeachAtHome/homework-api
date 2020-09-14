import { Person, PersonRole } from './Person';
import { DatabaseService } from '../persistance/DatabaseService';

export class PersonRepository {
  private collectionName = 'persons';

  constructor(private databaseConnection: DatabaseService) {}

  async getPersonById(id: string): Promise<Person | null> {
    const result = await this.databaseConnection.getCollectionEntries(
      this.collectionName,
      { id }
    );
    if (result.length >= 1) {
      return result[0] as Person;
    }
    return null;
  }

  async getPerson(
    firstname: string,
    lastname: string,
    email: string,
    role: PersonRole
  ): Promise<Person | null> {
    const query = {
      firstname,
      lastname,
      email,
      role
    };
    const result = await this.databaseConnection.getCollectionEntries(
      this.collectionName,
      query
    );
    if (result.length > 1) {
      console.warn('Warning: Found multiple persons!');
    }
    if (result.length >= 1) {
      return result[0] as Person;
    }
    return null;
  }

  async getAllPersons(): Promise<Person[] | null> {
    return (await this.databaseConnection.getAllCollectionEntries(
      this.collectionName
    )) as Person[];
  }

  async checkPersonExists(person: Person): Promise<boolean> {
    const query = {
      firstname: person.firstname,
      lastname: person.lastname,
      email: person.email
    };
    const result = await this.databaseConnection.getCollectionEntries(
      this.collectionName,
      query
    );
    return result.length >= 1;
  }

  async checkPersonWithIdExists(id: string): Promise<boolean> {
    const result = await this.databaseConnection.getCollectionEntries(
      this.collectionName,
      { id }
    );
    return result.length >= 1;
  }

  async getPersonsByRole(role: PersonRole): Promise<Person[] | null> {
    return (await this.databaseConnection.getCollectionEntries(
      this.collectionName,
      { role }
    )) as Person[];
  }

  async addPerson(person: Person): Promise<Person> {
    return (await this.databaseConnection.addObject(
      this.collectionName,
      person
    )) as Person;
  }

  async deletePerson(id: string): Promise<void> {
    await this.databaseConnection.deleteCollectionEntry(this.collectionName, {
      id
    });
  }

  async updatePerson(person: Person): Promise<void> {
    await this.databaseConnection.updateCollectionEntry(
      this.collectionName,
      { id: person.id as string },
      person
    );
  }
}
