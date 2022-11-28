import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next(); // If schema can be parsed
    } catch (err: any) {
      // Schema can't be parsed
      return res.status(400).send(err.errors);
    }
  };

export default validateResource;
