import { Request, Response } from "express";
import prisma from "../modules/db";
import { Product, Update } from "@prisma/client";

export const getUpdates = async (req: Request, res: Response) => {
  const updates = await prisma.product.findMany({
    where: {
      // @ts-ignore
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  res.send({
    data: updates,
  });
};

export const getUpdate = async (req: Request, res: Response) => {
  const update = await prisma.update.findFirst({
    where: {
      id: req.params.id,
    },
  });

  res.send({
    data: update,
  });
};

export const createUpdate = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
      // @ts-ignore
      belongsToId: req.user.id,
    },
  });

  if (!product) {
    res.send("Error: product does not belongs to you");
    return;
  }

  const update = await prisma.update.create({
    data: req.body,
  });

  res.json({
    data: update,
  });
};

export const updateUpdate = async (req: Request, res: Response) => {
  const products: Product[] = await prisma.product.findMany({
    where: {
      // @ts-ignore
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates: any, product) => {
    // @ts-ignore
    return [...allUpdates, ...product.updates];
  }, []);

  const match: Update = updates.find(
    (update: Update) => update.id === req.params.id
  );

  if (!match) {
    res.json({
      message: "Error: Update is not valid",
    });
    return;
  }

  const update = await prisma.update.update({
    where: {
      id: match.id,
    },
    data: req.body,
  });

  res.json({
    data: update,
  });
};

export const deleteUpdate = async (req: Request, res: Response) => {
  const products: Product[] = await prisma.product.findMany({
    where: {
      // @ts-ignore
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates: any, product) => {
    // @ts-ignore
    return [...allUpdates, ...product.updates];
  }, []);

  const match: Update = updates.find(
    (update: Update) => update.id === req.params.id
  );

  if (!match) {
    res.json({
      message: "Error: Update is not valid",
    });
    return;
  }

  await prisma.update.delete({
    where: {
      id: match.id,
    },
  });

  res.status(204);
  res.send();
};
