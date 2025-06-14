import { NextFunction, Request, Response } from "express";
import prisma from "../modules/db";
import { Product, Update } from "@prisma/client";
import { CustomError } from "../models/customError";
import { CustomErrorEnum } from "../models/ErrorEnum";

export const getUpdates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let updates;

  try {
    updates = await prisma.product.findMany({
      where: {
        // @ts-ignore
        belongsToId: req.user.id,
      },
      include: {
        updates: true,
      },
    });
  } catch (error) {
    next(
      new CustomError("Error when fetching updates", CustomErrorEnum.PRISMA)
    );
  }
  res.send({
    data: updates,
  });
};

export const getUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let update;

  try {
    update = await prisma.update.findFirst({
      where: {
        id: req.params.id,
      },
    });
  } catch (error) {
    next(
      new CustomError("Error when fetching updates", CustomErrorEnum.PRISMA)
    );
  }
  res.send({
    data: update,
  });
};

export const createUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let product;

  try {
    product = await prisma.product.findUnique({
      where: {
        id: req.body.productId,
        // @ts-ignore
        belongsToId: req.user.id,
      },
    });
  } catch (error) {
    next(
      new CustomError("Error when creating an update", CustomErrorEnum.PRISMA)
    );
  }

  if (!product) {
    next(new CustomError("Error product does not belongs to you"));
  }

  let update;

  try {
    update = await prisma.update.create({
      data: req.body,
    });
  } catch (error) {
    next(
      new CustomError("Error when creating an update", CustomErrorEnum.PRISMA)
    );
  }

  res.json({
    data: update,
  });
};

export const updateUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let products: Product[] = [];

  try {
    products = await prisma.product.findMany({
      where: {
        // @ts-ignore
        belongsToId: req.user.id,
      },
      include: {
        updates: true,
      },
    });
  } catch (error) {
    next(
      new CustomError("Error when fetching a product", CustomErrorEnum.PRISMA)
    );
  }

  const updates = products.reduce((allUpdates: any, product) => {
    // @ts-ignore
    return [...allUpdates, ...product.updates];
  }, []);

  const match: Update = updates.find(
    (update: Update) => update.id === req.params.id
  );

  if (!match) {
    next(new CustomError("Error update does not belongs to you"));
  }

  let update;

  try {
    update = await prisma.update.update({
      where: {
        id: match.id,
      },
      data: req.body,
    });
  } catch (error) {
    next(
      new CustomError("Error when changing an update", CustomErrorEnum.PRISMA)
    );
  }

  res.json({
    data: update,
  });
};

export const deleteUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let products: Product[] = [];

  try {
    products = await prisma.product.findMany({
      where: {
        // @ts-ignore
        belongsToId: req.user.id,
      },
      include: {
        updates: true,
      },
    });
  } catch (error) {
    next(
      new CustomError("Error when fetching a product", CustomErrorEnum.PRISMA)
    );
  }

  const updates = products.reduce((allUpdates: any, product) => {
    // @ts-ignore
    return [...allUpdates, ...product.updates];
  }, []);

  const match: Update = updates.find(
    (update: Update) => update.id === req.params.id
  );

  if (!match) {
    next(new CustomError("Error update does not belongs to you"));
  }

  try {
    await prisma.update.delete({
      where: {
        id: match.id,
      },
    });
  } catch (error) {
    next(
      new CustomError("Error when deleting an update", CustomErrorEnum.PRISMA)
    );
  }

  res.status(204);
  res.send();
};
