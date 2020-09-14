import { DocumentRepository } from './DocumentRepository';
import { Document } from './Document';
import { DocumentNotFoundException } from '../types/ErrorTypes';

export class DocumentService {
  constructor(private documentRepository: DocumentRepository) {}

  async linkDocumentToGroups(
    documentRefId: string,
    groups: string[]
  ): Promise<void> {
    let document = await this.documentRepository.getDocumentById(documentRefId);
    if (!document) {
      document = { id: undefined, documentRefId, groups };
      await this.documentRepository.addDocument(document);
    } else {
      document.groups = document.groups.concat(groups);
      await this.documentRepository.updateDocument(document);
    }
  }

  async getDocument(documentRefId: string): Promise<Document> {
    const document = await this.documentRepository.getDocumentById(
      documentRefId
    );
    if (!document) {
      throw new DocumentNotFoundException(
        'Document with documentRefId ' + documentRefId + ' does not exist'
      );
    }
    return document;
  }

  async deleteDocument(documentRefId: string): Promise<void> {
    if (
      !(await this.documentRepository.checkDocumentWithIdExists(documentRefId))
    ) {
      throw new DocumentNotFoundException(
        'Document with documentRefId ' + documentRefId + ' does not exist'
      );
    }
    return this.documentRepository.deleteDocument(documentRefId);
  }

  async getAllDocuments(): Promise<Document[]> {
    const documents = await this.documentRepository.getAllDocuments();
    if (!documents) {
      throw new DocumentNotFoundException();
    }
    return documents;
  }

  async getAllDocumentsByGroup(group: string): Promise<Document[]> {
    const documents = await this.documentRepository.getAllDocumentsByGroup(
      group
    );
    if (!documents) {
      throw new DocumentNotFoundException();
    }
    return documents;
  }
}
