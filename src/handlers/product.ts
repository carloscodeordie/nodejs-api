import { Request, Response } from "express";
import prisma from "../modules/db";

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
