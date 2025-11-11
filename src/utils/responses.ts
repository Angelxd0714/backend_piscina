import { Response } from "express";

export const RESPONSES = {
  OK: (res: Response, data: any) => res.status(200).json(data),
  CREATED: (res: Response, data: any) => res.status(201).json(data),
  NO_CONTENT: (res: Response) => res.status(204).send(),
  BAD_REQUEST: (res: Response, message: string) =>
    res.status(400).json({ error: message }),
  UNAUTHORIZED: (res: Response, message: string) =>
    res.status(401).json({ error: message }),
  FORBIDDEN: (res: Response, message: string) =>
    res.status(403).json({ error: message }),
  NOT_FOUND: (res: Response, message: string) =>
    res.status(404).json({ error: message }),
  CONFLICT: (res: Response, message: string) =>
    res.status(409).json({ error: message }),
  INTERNAL_SERVER_ERROR: (res: Response, message: string) =>
    res.status(500).json({ error: message }),
};
