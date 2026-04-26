import express from "express";
import prisma from "../config/prisma.js";
import { optimizeContainerFill } from "../services/matchingEngine.js";

const router = express.Router();

router.post("/match/optimize", async (req, res, next) => {
  try {
    const containerIdRaw = req.body?.containerId;
    const containerId = Number(containerIdRaw);

    if (!Number.isInteger(containerId) || containerId <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid payload. Expected body.containerId as a positive integer.",
      });
    }

    const container = await prisma.container.findUnique({
      where: { id: containerId },
    });

    if (!container) {
      return res.status(404).json({
        success: false,
        error: `Container ${containerId} not found`,
      });
    }

    const cooperatives = await prisma.cooperative.findMany({
      where: {
        availableWeight: { gt: 0 },
        availableVolume: { gt: 0 },
      },
      orderBy: { id: "asc" },
    });

    const optimization = optimizeContainerFill(container, cooperatives);

    if (optimization.matchedCooperatives.length > 0) {
      await prisma.container.update({
        where: { id: container.id },
        data: { status: "MATCH_OPTIMIZED" },
      });
    }

    return res.json({
      success: true,
      container: {
        id: container.id,
        containerNumber: container.containerNumber,
        destinationPort: container.destinationPort,
        maxWeight: container.maxWeight,
        maxVolume: container.maxVolume,
      },
      optimization,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
