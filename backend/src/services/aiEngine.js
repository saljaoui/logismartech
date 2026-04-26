import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function extractQuantityAndUnit(text) {
  const quantityUnitRegex = /(\d+(?:[.,]\d+)?)\s*(boxes?|box|pallets?|drums?|tons?|tonnes?|kg|kilograms?|cartons?|crates?)/i;
  const match = text.match(quantityUnitRegex);

  if (match) {
    return {
      quantity: parseFloat(match[1].replace(",", ".")),
      unit: match[2].toLowerCase(),
    };
  }

  const numberOnly = text.match(/(\d+(?:[.,]\d+)?)/);
  if (numberOnly) {
    return {
      quantity: parseFloat(numberOnly[1].replace(",", ".")),
      unit: "units",
    };
  }

  return { quantity: 1, unit: "units" };
}

function deriveWeightVolume(quantity, unit) {
  const qty = Math.max(1, quantity);
  const normalizedUnit = unit.toLowerCase();

  if (normalizedUnit.includes("ton")) {
    return { weightKg: qty * 1000, volumeM3: qty * 1.6 };
  }
  if (normalizedUnit === "kg" || normalizedUnit.includes("kilogram")) {
    return { weightKg: qty, volumeM3: qty * 0.0015 };
  }
  if (normalizedUnit.includes("pallet")) {
    return { weightKg: qty * 500, volumeM3: qty * 1.2 };
  }
  if (normalizedUnit.includes("drum")) {
    return { weightKg: qty * 220, volumeM3: qty * 0.27 };
  }
  if (
    normalizedUnit.includes("box") ||
    normalizedUnit.includes("carton") ||
    normalizedUnit.includes("crate")
  ) {
    return { weightKg: qty * 25, volumeM3: qty * 0.08 };
  }

  return { weightKg: qty * 25, volumeM3: qty * 0.08 };
}

function heuristicExtract(text) {
  const { quantity, unit } = extractQuantityAndUnit(text);

  const productMatch = text.match(/\b(?:of|de)\s+([a-zA-Z0-9\s\-']+?)(?:\s+(?:ready|for|to|toward|destined)\b|$)/i);
  const destinationMatch = text.match(/\b(?:to|for|destination|destined for)\s+([a-zA-Z][a-zA-Z\s\-']{2,})/i);

  const productType = productMatch?.[1]?.trim() || "Mixed products";
  const destination = destinationMatch?.[1]?.trim() || "Unknown destination";
  const { weightKg, volumeM3 } = deriveWeightVolume(quantity, unit);

  return {
    cooperativeName: null,
    productType,
    quantity,
    unit,
    destination,
    availableWeight: Number(weightKg.toFixed(2)),
    availableVolume: Number(volumeM3.toFixed(3)),
  };
}

function normalizeLlmExtraction(extracted, rawText) {
  const fallback = heuristicExtract(rawText);

  const quantity = clamp(parseNumber(extracted.quantity, fallback.quantity), 1, 1000000);
  const unit = typeof extracted.unit === "string" && extracted.unit.trim() ? extracted.unit.trim() : fallback.unit;

  let availableWeight = parseNumber(extracted.availableWeight, NaN);
  let availableVolume = parseNumber(extracted.availableVolume, NaN);

  if (!Number.isFinite(availableWeight) || !Number.isFinite(availableVolume)) {
    const derived = deriveWeightVolume(quantity, unit);
    availableWeight = Number.isFinite(availableWeight) ? availableWeight : derived.weightKg;
    availableVolume = Number.isFinite(availableVolume) ? availableVolume : derived.volumeM3;
  }

  return {
    cooperativeName:
      typeof extracted.cooperativeName === "string" && extracted.cooperativeName.trim()
        ? extracted.cooperativeName.trim()
        : null,
    productType:
      typeof extracted.productType === "string" && extracted.productType.trim()
        ? extracted.productType.trim()
        : fallback.productType,
    quantity,
    unit,
    destination:
      typeof extracted.destination === "string" && extracted.destination.trim()
        ? extracted.destination.trim()
        : fallback.destination,
    availableWeight: Number(clamp(availableWeight, 1, 1_000_000).toFixed(2)),
    availableVolume: Number(clamp(availableVolume, 0.01, 100_000).toFixed(3)),
  };
}

async function extractWithLlm(text) {
  if (!openai) {
    return null;
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const systemPrompt = [
    "You are an extraction engine for logistics onboarding.",
    "Return ONLY valid JSON with keys:",
    "cooperativeName (string|null), productType (string), quantity (number), unit (string), destination (string), availableWeight (number, kg), availableVolume (number, cubic meters).",
    "If a value is uncertain, infer a realistic value and keep it practical for shipping.",
  ].join(" ");

  const completion = await openai.chat.completions.create({
    model,
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ],
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("LLM returned an empty response");
  }

  return JSON.parse(content);
}

export async function extractWhatsappShipment(text) {
  try {
    const llmExtraction = await extractWithLlm(text);
    if (llmExtraction) {
      return normalizeLlmExtraction(llmExtraction, text);
    }
  } catch (error) {
    console.warn("[AI Engine] Falling back to heuristic parser:", error.message);
  }

  return heuristicExtract(text);
}
