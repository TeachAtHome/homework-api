import { NextFunction, Request, Response } from 'express';
import {
  OK,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CREATED,
  BAD_REQUEST
} from 'http-status-codes';
import {
  PersonNotFoundException,
  GroupNotFoundException,
  GroupAlreadyExistingException
} from '../types/ErrorTypes';

export class GroupEndpoints {
  getStudentsByGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const groupName = req.params.name;
      const group = await req.services.groupService.getGroup(groupName);
      const students = [];
      for (let i = 0; i < group.personIds.length; i++) {
        const student = await req.services.personService.getPersonById(
          group.personIds[i]
        );
        if (student) {
          students.push(student);
        }
      }
      res.status(OK).json({ name: group.name, students });
    } catch (error) {
      console.log(error);
      if (error instanceof PersonNotFoundException) {
        res.sendStatus(INTERNAL_SERVER_ERROR);
      } else if (error instanceof GroupNotFoundException) {
        res.sendStatus(NOT_FOUND);
      } else {
        res.sendStatus(INTERNAL_SERVER_ERROR);
      }
      next();
    }
  };
  getGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const groupName = req.params.name;
      const group = await req.services.groupService.getGroup(groupName);
      res.status(OK).json(group);
    } catch (error) {
      console.log(error);
      if (error instanceof GroupNotFoundException) {
        res.sendStatus(NOT_FOUND);
      } else {
        res.sendStatus(INTERNAL_SERVER_ERROR);
      }
      next();
    }
  };
  getAllGroups = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const groups = await req.services.groupService.listAllGroups();
      res.status(OK).json(groups);
    } catch (error) {
      console.log(error);
      if (error instanceof GroupNotFoundException) {
        res.sendStatus(NOT_FOUND);
      } else {
        res.sendStatus(INTERNAL_SERVER_ERROR);
      }
      next();
    }
  };
  postTest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log(req.body);
      res.sendStatus(OK);
    } catch (error) {
      console.log(error);
      res.sendStatus(INTERNAL_SERVER_ERROR);
      next();
    }
  };
  postGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const groupName = req.body.name;
      const personIds = req.body.personIds;
      for (let i = 0; i < personIds.length; i++) {
        await req.services.personService.getPersonById(personIds[i]);
      }
      const group = await req.services.groupService.addGroup(
        groupName,
        personIds
      );
      res.status(CREATED).json(group);
    } catch (error) {
      console.log(error);
      if (error instanceof PersonNotFoundException) {
        res.status(BAD_REQUEST).json({
          error: 'Specified user id is not know to the system'
        });
      } else if (error instanceof GroupAlreadyExistingException) {
        res.status(BAD_REQUEST).json({
          error: 'Group does already exist'
        });
      } else {
        res.sendStatus(INTERNAL_SERVER_ERROR);
      }
      next();
    }
  };
}
