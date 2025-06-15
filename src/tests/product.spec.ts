import prisma from "../modules/db";
import { Request, Response, NextFunction } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../handlers/product";

jest.mock("../modules/db", () => ({
  user: {
    findUnique: jest.fn(),
  },
  product: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockUser = {
  id: "user1",
  products: [{ id: "p1", name: "Test Product" }],
};
const mockProduct = { id: "p1", name: "Test Product", belongsToId: "user1" };

const mockReq = (overrides = {}): Partial<Request> => ({
  user: {
    id: "user1",
    username: "testuser",
  },
  params: { id: "p1" },
  body: { name: "Updated Product" },
  ...overrides,
});

const mockRes = (): Partial<Response> => {
  const res: any = {};
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("Product Handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get all products", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    const req = mockReq();
    const res = mockRes();
    await getProducts(req as Request, res as Response, mockNext);
    expect(res.send).toHaveBeenCalledWith({ data: mockUser.products });
  });

  it("should get a product by id", async () => {
    (prisma.product.findFirst as jest.Mock).mockResolvedValue(mockProduct);
    const req = mockReq();
    const res = mockRes();
    await getProduct(req as Request, res as Response, mockNext);
    expect(res.send).toHaveBeenCalledWith({ data: mockProduct });
  });

  it("should create a product", async () => {
    (prisma.product.create as jest.Mock).mockResolvedValue(mockProduct);
    const req = mockReq({ body: { name: "New Product" } });
    const res = mockRes();
    await createProduct(req as Request, res as Response, mockNext);
    expect(res.send).toHaveBeenCalledWith({ data: mockProduct });
  });

  it("should update a product", async () => {
    (prisma.product.update as jest.Mock).mockResolvedValue(mockProduct);
    const req = mockReq();
    const res = mockRes();
    await updateProduct(req as Request, res as Response, mockNext);
    expect(res.json).toHaveBeenCalledWith({ data: mockProduct });
  });

  it("should delete a product", async () => {
    (prisma.product.delete as jest.Mock).mockResolvedValue({});
    const req = mockReq();
    const res = mockRes();
    await deleteProduct(req as Request, res as Response, mockNext);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("should validate product is not created for unauthorized users", async () => {
    const req = mockReq({ user: undefined });
    const res = mockRes();
    await createProduct(req as Request, res as Response, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});
