import { PersonRepository } from './PersonRepository';
import { Person, PersonRole } from './Person';
import {
  PersonNotFoundException,
  PersonAlreadyExistingException
} from '../types/ErrorTypes';

export class PersonService {
  constructor(private personRepository: PersonRepository) {}

  async listAllPersons(): Promise<Person[]> {
    const persons = await this.personRepository.getAllPersons();
    if (!persons) {
      throw new PersonNotFoundException();
    }
    return persons;
  }

  async listAllStudents(): Promise<Person[]> {
    const persons = await this.personRepository.getPersonsByRole(
      PersonRole.STUDENT
    );
    if (!persons) {
      throw new PersonNotFoundException();
    }
    return persons;
  }

  async listAllTeachers(): Promise<Person[]> {
    const persons = await this.personRepository.getPersonsByRole(
      PersonRole.TEACHER
    );
    if (!persons) {
      throw new PersonNotFoundException();
    }
    return persons;
  }

  async listAllParents(): Promise<Person[]> {
    const persons = await this.personRepository.getPersonsByRole(
      PersonRole.PARENT
    );
    if (!persons) {
      throw new PersonNotFoundException();
    }
    return persons;
  }

  private async addPerson(
    firstname: string,
    lastname: string,
    email: string,
    sick: boolean,
    role: PersonRole
  ): Promise<Person> {
    const person = {
      id: undefined,
      firstname,
      lastname,
      email,
      sick,
      role
    };
    if (!(await this.personRepository.checkPersonExists(person))) {
      return this.personRepository.addPerson(person);
    }
    throw new PersonAlreadyExistingException();
  }

  async addStudent(
    firstname: string,
    lastname: string,
    email: string,
    sick: boolean
  ): Promise<Person> {
    return this.addPerson(firstname, lastname, email, sick, PersonRole.STUDENT);
  }

  async addTeacher(
    firstname: string,
    lastname: string,
    email: string,
    sick: boolean
  ): Promise<Person> {
    return this.addPerson(firstname, lastname, email, sick, PersonRole.TEACHER);
  }

  async addParent(
    firstname: string,
    lastname: string,
    email: string,
    sick: boolean
  ): Promise<Person> {
    return this.addPerson(firstname, lastname, email, sick, PersonRole.PARENT);
  }

  async getPersonById(id: string): Promise<Person> {
    const person = await this.personRepository.getPersonById(id);
    if (!person) {
      throw new PersonNotFoundException(
        'Person with id ' + id + ' does not exist'
      );
    }
    return person;
  }

  private async getPerson(
    firstname: string,
    lastname: string,
    email: string,
    role: PersonRole
  ): Promise<Person> {
    const person = await this.personRepository.getPerson(
      firstname,
      lastname,
      email,
      role
    );
    if (!person) {
      throw new PersonNotFoundException();
    }
    return person;
  }

  async getStudent(
    firstname: string,
    lastname: string,
    email: string
  ): Promise<Person> {
    return this.getPerson(firstname, lastname, email, PersonRole.STUDENT);
  }

  async getTeacher(
    firstname: string,
    lastname: string,
    email: string
  ): Promise<Person> {
    return this.getPerson(firstname, lastname, email, PersonRole.TEACHER);
  }

  async getParent(
    firstname: string,
    lastname: string,
    email: string
  ): Promise<Person> {
    return this.getPerson(firstname, lastname, email, PersonRole.PARENT);
  }

  private async updatePerson(
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    sick: boolean,
    role: PersonRole
  ): Promise<void> {
    const person = {
      id,
      firstname,
      lastname,
      email,
      sick,
      role
    };
    if (await this.personRepository.checkPersonExists(person)) {
      return this.personRepository.updatePerson(person);
    }
    throw new PersonNotFoundException();
  }

  async updateStudent(
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    sick: boolean
  ): Promise<void> {
    await this.updatePerson(
      id,
      firstname,
      lastname,
      email,
      sick,
      PersonRole.STUDENT
    );
  }

  async updateTeacher(
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    sick: boolean
  ): Promise<void> {
    await this.updatePerson(
      id,
      firstname,
      lastname,
      email,
      sick,
      PersonRole.TEACHER
    );
  }

  async updateParent(
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    sick: boolean
  ): Promise<void> {
    await this.updatePerson(
      id,
      firstname,
      lastname,
      email,
      sick,
      PersonRole.PARENT
    );
  }

  async deletePerson(id: string): Promise<void> {
    if (await this.personRepository.checkPersonWithIdExists(id)) {
      return this.personRepository.deletePerson(id);
    }
    throw new PersonNotFoundException();
  }
}
