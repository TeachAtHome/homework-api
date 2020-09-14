export class PersonNotFoundException implements Error {
  name = 'PersonNotFoundException';
  constructor(public message = 'Person does not exist') {}
}

export class PersonAlreadyExistingException implements Error {
  name = 'PersonAlreadyExistingException';
  constructor(public message = 'Person does already exist') {}
}

export class GroupNotFoundException implements Error {
  name = 'GroupNotFoundException';
  constructor(public message = 'Group does not exist') {}
}

export class GroupAlreadyExistingException implements Error {
  name = 'GroupAlreadyExistingException';
  constructor(public message = 'Group does already exist') {}
}

export class DocumentNotFoundException implements Error {
  name = 'DocumentNotFoundException';
  constructor(public message = 'Document does not exist') {}
}
