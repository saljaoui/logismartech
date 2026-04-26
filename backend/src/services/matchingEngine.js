function round(value, digits = 2) {
  return Number(value.toFixed(digits));
}

function candidateScore(cooperative, container) {
  const weightRatio = cooperative.availableWeight / container.maxWeight;
  const volumeRatio = cooperative.availableVolume / container.maxVolume;
  const balance = 1 - Math.abs(weightRatio - volumeRatio);
  return weightRatio * 0.45 + volumeRatio * 0.45 + balance * 0.1;
}

export function optimizeContainerFill(container, cooperatives) {
  const sorted = [...cooperatives].sort(
    (a, b) => candidateScore(b, container) - candidateScore(a, container),
  );

  const matched = [];
  const skipped = [];

  let usedWeight = 0;
  let usedVolume = 0;

  for (const coop of sorted) {
    const remainingWeight = container.maxWeight - usedWeight;
    const remainingVolume = container.maxVolume - usedVolume;

    if (remainingWeight <= 0 || remainingVolume <= 0) {
      skipped.push({ id: coop.id, reason: "Container already full" });
      continue;
    }

    const fractionByWeight = remainingWeight / coop.availableWeight;
    const fractionByVolume = remainingVolume / coop.availableVolume;
    const fraction = Math.min(1, fractionByWeight, fractionByVolume);

    if (fraction <= 0) {
      skipped.push({ id: coop.id, reason: "Would exceed capacity" });
      continue;
    }

    if (fraction < 0.2) {
      skipped.push({ id: coop.id, reason: "Low marginal fit (<20%)" });
      continue;
    }

    const allocatedWeight = coop.availableWeight * fraction;
    const allocatedVolume = coop.availableVolume * fraction;

    usedWeight += allocatedWeight;
    usedVolume += allocatedVolume;

    matched.push({
      id: coop.id,
      name: coop.name,
      productType: coop.productType,
      phone: coop.phone,
      allocationFraction: round(fraction, 3),
      allocatedWeight: round(allocatedWeight, 2),
      allocatedVolume: round(allocatedVolume, 3),
    });
  }

  const weightFillRate = container.maxWeight > 0 ? (usedWeight / container.maxWeight) * 100 : 0;
  const volumeFillRate = container.maxVolume > 0 ? (usedVolume / container.maxVolume) * 100 : 0;
  const finalFillRate = (weightFillRate + volumeFillRate) / 2;

  return {
    strategy: "greedy-2d",
    matchedCooperatives: matched,
    skippedCooperatives: skipped,
    metrics: {
      usedWeight: round(usedWeight, 2),
      usedVolume: round(usedVolume, 3),
      maxWeight: container.maxWeight,
      maxVolume: container.maxVolume,
      weightFillRate: round(weightFillRate, 1),
      volumeFillRate: round(volumeFillRate, 1),
      finalFillRate: round(finalFillRate, 1),
    },
    customsManifest: {
      fileName: "Customs_Manifest_Generated.pdf",
      status: matched.length ? "generated" : "not_generated",
    },
  };
}
