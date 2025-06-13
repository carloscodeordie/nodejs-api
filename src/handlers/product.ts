import { Request, Response } from "express";
import prisma from "../modules/db";

export const getProducts = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      // @ts-ignore
      id: req.user.id,
    },
    include: {
      products: true,
    },
  });

  res.send({
    data: user?.products,
  });
};

export const getProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      // @ts-ignore
      belongsToId: req.user.id,
    },
  });

  res.send({
    data: product,
  });
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.create({
    data: {
      name: req.body.name,
      // @ts-ignore
      belongsToId: req.user.id,
    },
  });

  res.send({
    data: product,
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.update({
    data: {
      name: req.body.name,
    },
    where: {
      id: req.params.id,
    },
  });

  res.json({
    data: product,
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  await prisma.product.delete({
    where: {
      id: req.params.id,
      // @ts-ignore
      belongsToId: req.user.id,
    },
  });

  res.status(204);
  res.send();
};
