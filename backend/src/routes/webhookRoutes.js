import express from "express";
import prisma from "../config/prisma.js";
import { extractWhatsappShipment } from "../services/aiEngine.js";

const router = express.Router();

router.post("/webhook/whatsapp", async (req, res, next) => {
  try {
    const text = req.body?.text;
    const phone = req.body?.phone;
    const providedName = req.body?.name;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid payload. Expected body.text as a non-empty string.",
      });
    }

    const parsed = await extractWhatsappShipment(text);

    const cooperative = await prisma.cooperative.create({
      data: {
        name:
          (typeof providedName === "string" && providedName.trim()) ||
          parsed.cooperativeName ||
          `Farmer ${phone || "Unknown"}`,
        productType: parsed.productType,
        availableWeight: parsed.availableWeight,
        availableVolume: parsed.availableVolume,
        phone:
          (typeof phone === "string" && phone.trim()) ||
          "UNKNOWN",
      },
    });

    return res.status(201).json({
      success: true,
      message: "WhatsApp onboarding processed and cooperative created",
      parsed,
      cooperative,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
