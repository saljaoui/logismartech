import express from "express";
import prisma from "../config/prisma.js";

const router = express.Router();

function deterministicConfidence(probabilityEmpty, id) {
  const base = Number(probabilityEmpty || 0) * 100;
  const jitter = ((id * 17) % 11) - 5;
  const confidence = Math.min(99.5, Math.max(50, base + jitter));
  return Number(confidence.toFixed(1));
}

router.get("/containers/predict", async (_req, res, next) => {
  try {
    const containers = await prisma.container.findMany({
      where: {
        status: "AT_NADOR_WEST_MED",
      },
      orderBy: {
        id: "asc",
      },
    });

    const predictions = containers.map((container) => {
      const confidenceScore = deterministicConfidence(container.probabilityEmpty, container.id);

      return {
        id: container.id,
        containerNumber: container.containerNumber,
        destinationPort: container.destinationPort,
        status: container.status,
        probabilityEmpty: container.probabilityEmpty,
        confidenceScore,
        prediction: `${confidenceScore}% probability of returning empty to ${container.destinationPort}`,
      };
    });

    return res.json({
      success: true,
      port: "Nador West Med",
      count: predictions.length,
      data: predictions,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
