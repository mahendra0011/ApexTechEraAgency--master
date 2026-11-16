/**
 * Production-grade Hardware & GPU Profiler for 3D WebGL (Three.js)
 * Accurately detects low-end & 4GB RAM Android devices to apply optimal
 * rendering tiers (Dynamic Resolution Scaling, Shader Precision, Memory Cap).
 */

export interface DeviceProfile {
  isMobile: boolean;
  isLowEnd: boolean;
  deviceMemory: number; // in GB
  hardwareConcurrency: number; // core count
  gpuRenderer: string;
  recommendedDpr: number;
  maxParticles: number;
  useVideoTexture: boolean;
  use4kSpecular: boolean;
  precision: "mediump" | "highp";
  idleFps: number;
}

export function getDeviceProfile(): DeviceProfile {
  if (typeof window === "undefined") {
    return {
      isMobile: false,
      isLowEnd: false,
      deviceMemory: 8,
      hardwareConcurrency: 8,
      gpuRenderer: "SSR",
      recommendedDpr: 1.5,
      maxParticles: 7500,
      useVideoTexture: true,
      use4kSpecular: true,
      precision: "highp",
      idleFps: 60,
    };
  }

  const width = window.innerWidth;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isMobile = width <= 768 || (isTouch && width <= 1024);

  // 1. Check Device RAM (Chrome Android exposes navigator.deviceMemory in GB)
  const nav = navigator as any;
  const deviceMemory = typeof nav.deviceMemory === "number" ? nav.deviceMemory : 8;

  // 2. Check CPU Cores
  const hardwareConcurrency =
    typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency : 4;

  // 3. Inspect WebGL GPU Renderer via unmasked extension
  let gpuRenderer = "unknown";
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
      }
    }
  } catch {
    // Ignore fallback
  }

  const gpuLower = gpuRenderer.toLowerCase();

  // Low-end mobile GPU signatures (ARM Mali budget series, Adreno 5xx, PowerVR, etc.)
  const isLowEndGpu =
    gpuLower.includes("mali-g51") ||
    gpuLower.includes("mali-g52") ||
    gpuLower.includes("mali-g57") ||
    gpuLower.includes("mali-t") ||
    gpuLower.includes("mali-4") ||
    gpuLower.includes("adreno (tm) 5") ||
    gpuLower.includes("adreno (tm) 610") ||
    gpuLower.includes("adreno (tm) 612") ||
    gpuLower.includes("adreno (tm) 616") ||
    gpuLower.includes("powervr") ||
    gpuLower.includes("sgx") ||
    gpuLower.includes("swiftshader") ||
    gpuLower.includes("llvmpipe");

  // A device is considered Low-End if:
  // - On mobile AND (RAM <= 4GB OR CPU cores <= 4 OR low-end GPU detected)
  const isLowEnd =
    isMobile && (deviceMemory <= 4 || hardwareConcurrency <= 4 || isLowEndGpu);

  // Recommended DPR:
  // - Low-end Android: 0.75 (cuts fragment shader pixel shading work by 45%)
  // - Mid-range mobile: 0.9
  // - Desktop: min(devicePixelRatio, 1.5)
  let recommendedDpr = 1.5;
  if (isLowEnd) {
    recommendedDpr = 0.75;
  } else if (isMobile) {
    recommendedDpr = 0.9;
  } else {
    recommendedDpr = Math.min(window.devicePixelRatio || 1, 1.5);
  }

  // Particle count scaling
  const maxParticles = isLowEnd ? 320 : isMobile ? 650 : 7500;

  // On low-end mobile, video texture decoding locks the Mali GPU bus.
  // Using a static crisp logo WebP provides butter-smooth 60fps scrolling.
  const useVideoTexture = !isLowEnd;

  // Never load 4K specular map on mobile (saves 67MB of GPU VRAM)
  const use4kSpecular = !isMobile;

  // Mobile GPUs excel at 16-bit half-floats (mediump)
  const precision: "mediump" | "highp" = isMobile ? "mediump" : "highp";

  // Idle FPS when user is not touching or scrolling
  const idleFps = isLowEnd ? 30 : isMobile ? 40 : 60;

  return {
    isMobile,
    isLowEnd,
    deviceMemory,
    hardwareConcurrency,
    gpuRenderer,
    recommendedDpr,
    maxParticles,
    useVideoTexture,
    use4kSpecular,
    precision,
    idleFps,
  };
}
