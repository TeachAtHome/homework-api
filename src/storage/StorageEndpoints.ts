import { promises as fs } from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { NextFunction, Request, Response } from 'express';
import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
  BAD_REQUEST
} from 'http-status-codes';
import { UploadedFile } from 'express-fileupload';

export class StorageEndpoints {
  uploadDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.files || !req.files.document) {
        res.status(BAD_REQUEST).json({
          error: 'No file specified'
        });
        return;
      }
      const file = req.files.document as UploadedFile;
      const documentName = uuid.v4().concat(path.extname(file.name));
      await req.services.storageService.uploadDocument(
        documentName,
        file.tempFilePath,
        file.mimetype
      );
      res.status(CREATED).json({
        id: documentName
      });
    } catch (error) {
      console.log(error);
      res.status(INTERNAL_SERVER_ERROR).send(error);
      next();
    }
  };
  storeDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.body.content) {
        res.status(BAD_REQUEST).json({
          error: 'No content specified in body'
        });
        return;
      }
      const documentRefId = req.body.documentRefId
        ? req.body.documentRefId
        : uuid.v4();
      const documentPath = await req.services.storageService.createTempFile(
        documentRefId,
        req.body.content
      );
      await req.services.storageService.uploadDocument(
        documentRefId,
        documentPath,
        'application/json'
      );
      res.status(CREATED).json({
        id: documentRefId
      });
    } catch (error) {
      console.log(error);
      res.status(INTERNAL_SERVER_ERROR).send(error);
      next();
    }
  };
  downloadDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.params || !req.params.documentRefId) {
        res.status(BAD_REQUEST).json({
          error: "Parameter 'documentRefId' is not specified"
        });
        return;
      }
      const documentRefId = req.params.documentRefId;
      const documentPath = await req.services.storageService.downloadDocument(
        documentRefId
      );
      res.download(documentPath);
    } catch (error) {
      console.log(error);
      res.status(INTERNAL_SERVER_ERROR).send(error);
      next();
    }
  };

  getDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.params || !req.params.documentRefId) {
        res.status(BAD_REQUEST).json({
          error: "Parameter 'documentRefId' is not specified"
        });
        return;
      }
      const documentRefId = req.params.documentRefId;
      const documentPath = await req.services.storageService.downloadDocument(
        documentRefId
      );
      const fileContent = await fs.readFile(documentPath);
      res.status(OK).json({
        content: fileContent.toString()
      });
    } catch (error) {
      console.log(error);
      res.status(INTERNAL_SERVER_ERROR).send(error);
      next();
    }
  };
}
