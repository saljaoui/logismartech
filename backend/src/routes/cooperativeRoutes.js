import express from "express";
import prisma from "../config/prisma.js";

const router = express.Router();

router.get("/cooperatives", async (_req, res, next) => {
  try {
    const cooperatives = await prisma.cooperative.findMany({
      where: {
        availableWeight: { gt: 0 },
        availableVolume: { gt: 0 },
      },
      orderBy: { id: "asc" },
    });

    return res.json({
      success: true,
      count: cooperatives.length,
      data: cooperatives,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
