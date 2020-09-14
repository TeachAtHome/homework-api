import { NextFunction, Request, Response } from 'express';
import {
  OK,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CREATED,
  BAD_REQUEST
} from 'http-status-codes';
import {
  GroupNotFoundException,
  DocumentNotFoundException
} from '../types/ErrorTypes';

export class DocumentEndpoints {
  postLinkDocumentToGroups = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.body.documentRefId || !req.body.groups) {
      res.status(BAD_REQUEST).json({
        error:
          "Invalid request: parameter 'documentRefId' or 'groups' is not set in body"
      });
      return;
    }
    const documentRefId: string = req.body.documentRefId;
    const groups: string[] = req.body.groups;
    try {
      for (const groupIdx in groups) {
        if (
          !(await req.services.groupService.checkGroupExists(groups[groupIdx]))
        ) {
          res.status(BAD_REQUEST).json({
            error: 'Group ' + groups[groupIdx] + ' is not know to the system'
          });
        }
      }
      await req.services.documentService.linkDocumentToGroups(
        documentRefId,
        groups
      );
      res.sendStatus(CREATED);
    } catch (error) {
      console.log(error);
      if (error instanceof GroupNotFoundException) {
        res.status(BAD_REQUEST).json({
          error: 'Specified group is not know to the system'
        });
      } else {
        res.sendStatus(INTERNAL_SERVER_ERROR);
      }
      next();
    }
  };
  getDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const documentRefId = req.params.documentRefId;
    try {
      const document = await req.services.documentService.getDocument(
        documentRefId
      );
      res.status(OK).json(document);
    } catch (error) {
      console.log(error);
      if (error instanceof DocumentNotFoundException) {
        res.sendStatus(NOT_FOUND);
      } else {
        res.sendStatus(INTERNAL_SERVER_ERROR);
      }
      next();
    }
  };
  getAllDocuments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const group = req.query.group;
    try {
      let documents;
      if (group) {
        await req.services.groupService.getGroup(group);
        documents = await req.services.documentService.getAllDocumentsByGroup(
          group
        );
      } else {
        documents = await req.services.documentService.getAllDocuments();
      }
      res.status(OK).json(documents);
    } catch (error) {
      console.log(error);
      if (error instanceof GroupNotFoundException) {
        res.sendStatus(INTERNAL_SERVER_ERROR);
      } else if (error instanceof DocumentNotFoundException) {
        res.sendStatus(NOT_FOUND);
      } else {
        res.sendStatus(INTERNAL_SERVER_ERROR);
      }
      next();
    }
  };
  deleteDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const documentRefId = req.params.documentRefId;
    try {
      await req.services.documentService.deleteDocument(documentRefId);
      res.sendStatus(OK);
    } catch (error) {
      console.log(error);
      if (error instanceof DocumentNotFoundException) {
        res.sendStatus(NOT_FOUND);
      } else {
        res.sendStatus(INTERNAL_SERVER_ERROR);
      }
      next();
    }
  };
}
