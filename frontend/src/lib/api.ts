export interface ContainerPrediction {
  id: number;
  containerNumber: string;
  destinationPort: string;
  status: string;
  probabilityEmpty: number;
  confidenceScore: number;
  prediction: string;
}

export interface CooperativeStock {
  id: number;
  name: string;
  productType: string;
  availableWeight: number;
  availableVolume: number;
  phone: string;
}

export interface OptimizationMatch {
  id: number;
  name: string;
  productType: string;
  phone: string;
  allocationFraction: number;
  allocatedWeight: number;
  allocatedVolume: number;
}

export interface OptimizationMetrics {
  usedWeight: number;
  usedVolume: number;
  maxWeight: number;
  maxVolume: number;
  weightFillRate: number;
  volumeFillRate: number;
  finalFillRate: number;
}

export interface OptimizationResult {
  strategy: string;
  matchedCooperatives: OptimizationMatch[];
  skippedCooperatives: Array<{ id: number; reason: string }>;
  metrics: OptimizationMetrics;
  customsManifest: {
    fileName: string;
    status: "generated" | "not_generated";
  };
}

export interface OptimizeResponse {
  success: boolean;
  container: {
    id: number;
    containerNumber: string;
    destinationPort: string;
    maxWeight: number;
    maxVolume: number;
  };
  optimization: OptimizationResult;
}

interface ApiListResponse<T> {
  success: boolean;
  count?: number;
  data: T[];
}

interface ApiErrorBody {
  error?: string;
  details?: string;
}

function resolveApiBaseUrl() {
  const viteUrl = typeof import.meta !== "undefined" ? import.meta.env?.GEMINI_API_KEY : undefined;
  const nextUrl =
    typeof globalThis !== "undefined"
      ? (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
          ?.NEXT_PUBLIC_API_BASE_URL
      : undefined;

  const baseUrl = viteUrl || nextUrl || "http://localhost:3000";
  return baseUrl.replace(/\/+$/, "");
}

const API_BASE_URL = resolveApiBaseUrl();

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;



  try {
    console.log(`Making API request to: ${API_BASE_URL}${path}`);

    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      ...init,
    });
  } catch {
    throw new Error("AI Engine unreachable. Please check server connection.");
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error("AI Engine returned an invalid JSON response.");
  }

  if (!response.ok) {
    const errorBody = body as ApiErrorBody;
    throw new Error(errorBody.error || errorBody.details || `API request failed (${response.status}).`);
  }

  return body as T;
}

export async function fetchContainers() {
  const response = await request<ApiListResponse<ContainerPrediction>>("/api/containers/predict");
  return response.data || [];
}

export async function fetchCooperatives() {
  const response = await request<ApiListResponse<CooperativeStock>>("/api/cooperatives");
  return response.data || [];
}

export async function runAiOptimization(containerId: number) {
  return request<OptimizeResponse>("/api/match/optimize", {
    method: "POST",
    body: JSON.stringify({ containerId }),
  });
}
