import {
  getUpdates,
  getUpdate,
  createUpdate,
  updateUpdate,
  deleteUpdate,
} from "../handlers/update";
import prisma from "../modules/db";

jest.mock("../modules/db", () => ({
  user: {
    findUnique: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  update: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockReq = (data: Partial<any> = {}) =>
  ({
    user: {
      id: "user1",
      username: "testuser",
    },
    params: {},
    body: {},
    ...data,
  } as any);

const mockRes = () => {
  const res: any = {};
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Update Handlers", () => {
  describe(getUpdates.name, () => {
    it("should fetch all updates", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([
        { id: "p1", updates: [] },
      ]);

      const req = mockReq();
      const res = mockRes();

      await getUpdates(req, res, mockNext);

      expect(res.send).toHaveBeenCalledWith({
        data: [{ id: "p1", updates: [] }],
      });
    });

    it("should call next on fetching updates error", async () => {
      (prisma.product.findMany as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );

      const req = mockReq();
      const res = mockRes();

      await getUpdates(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe(getUpdate.name, () => {
    it("should return single update", async () => {
      (prisma.update.findFirst as jest.Mock).mockResolvedValue({
        id: "update1",
      });

      const req = mockReq({ params: { id: "update1" } });
      const res = mockRes();

      await getUpdate(req, res, mockNext);

      expect(res.send).toHaveBeenCalledWith({ data: { id: "update1" } });
    });
  });

  describe(createUpdate.name, () => {
    it("should create update if product belongs to user", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({ id: "p1" });
      (prisma.update.create as jest.Mock).mockResolvedValue({ id: "u1" });

      const req = mockReq({ body: { productId: "p1" } });
      const res = mockRes();

      await createUpdate(req, res, mockNext);

      expect(prisma.update.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ data: { id: "u1" } });
    });

    it("should call next if product does not belong to user", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      const req = mockReq({ body: { productId: "bad-id" } });
      const res = mockRes();

      await createUpdate(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe(updateUpdate.name, () => {
    it("should update update if it belongs to user", async () => {
      const mockUpdates = [{ id: "u1" }];
      (prisma.product.findMany as jest.Mock).mockResolvedValue([
        { updates: mockUpdates },
      ]);
      (prisma.update.update as jest.Mock).mockResolvedValue({
        id: "u1",
        name: "updated",
      });

      const req = mockReq({ params: { id: "u1" }, body: { name: "updated" } });
      const res = mockRes();

      await updateUpdate(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        data: { id: "u1", name: "updated" },
      });
    });

    it("should call next if update does not belong to user", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([
        { updates: [] },
      ]);

      const req = mockReq({ params: { id: "nope" } });
      const res = mockRes();

      await updateUpdate(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe(deleteUpdate.name, () => {
    it("should delete update if it belongs to user", async () => {
      const mockUpdates = [{ id: "u1" }];
      (prisma.product.findMany as jest.Mock).mockResolvedValue([
        { updates: mockUpdates },
      ]);
      (prisma.update.delete as jest.Mock).mockResolvedValue({});

      const req = mockReq({ params: { id: "u1" } });
      const res = mockRes();

      await deleteUpdate(req, res, mockNext);

      expect(prisma.update.delete).toHaveBeenCalledWith({
        where: { id: "u1" },
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should call next if update does not belong to user", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([
        { updates: [] },
      ]);

      const req = mockReq({ params: { id: "u1" } });
      const res = mockRes();

      await deleteUpdate(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
