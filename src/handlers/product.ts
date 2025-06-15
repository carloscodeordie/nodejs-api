import { NextFunction, Request, Response } from "express";
import prisma from "../modules/db";
import { CustomError } from "../models/customError";
import { CustomErrorEnum } from "../models/ErrorEnum";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
      include: {
        products: true,
      },
    });
  } catch (error) {
    next(
      new CustomError("Error when fetching products", CustomErrorEnum.PRISMA)
    );
  }

  res.send({
    data: user?.products,
  });
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let product;
  try {
    product = await prisma.product.findFirst({
      where: {
        id: req.params.id,
        belongsToId: req.user?.id,
      },
    });
  } catch (error) {
    next(
      new CustomError(
        "Error when fetching a product by id",
        CustomErrorEnum.PRISMA
      )
    );
  }

  res.send({
    data: product,
  });
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    next(new CustomError("No valid user"));
    return;
  }

  let product;
  try {
    product = await prisma.product.create({
      data: {
        name: req.body.name,
        belongsToId: req.user.id,
      },
    });
  } catch (error) {
    next(
      new CustomError("Error when creating a product", CustomErrorEnum.PRISMA)
    );
  }

  res.send({
    data: product,
  });
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let product;

  try {
    product = await prisma.product.update({
      data: {
        name: req.body.name,
      },
      where: {
        id: req.params.id,
        belongsToId: req.user?.id,
      },
    });
  } catch (error) {
    next(
      new CustomError("Error when updating a product", CustomErrorEnum.PRISMA)
    );
  }

  res.json({
    data: product,
  });
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await prisma.product.delete({
      where: {
        id: req.params.id,
        belongsToId: req.user?.id,
      },
    });
  } catch (error) {
    next(
      new CustomError("Error when deleting a product", CustomErrorEnum.PRISMA)
    );
  }

  res.status(204);
  res.send();
};
