import { Request, Response, NextFunction, RequestHandler } from 'express';
import { RequestServices } from '../types/CustomRequest';

export const addServicesToRequest = (
  services: RequestServices
): RequestHandler => (req: Request, _res: Response, next: NextFunction) => {
  req.services = services;
  next();
};
