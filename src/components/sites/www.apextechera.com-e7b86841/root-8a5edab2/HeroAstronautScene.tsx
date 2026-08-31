"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const BASE = "/sites/www.apextechera.com-e7b86841/root-8a5edab2/images";

const DEG = Math.PI / 180;

interface Keyframe {
  s: number;
  x: number;
  y: number;
  z: number;
  ry: number;
  rx: number;
  op: number;
}

const KEYFRAMES: Keyframe[] = [
  { s: 0, x: 0, y: -2.7, z: 0, ry: 0, rx: 0, op: 1 },
  { s: 100, x: 0, y: -2.635, z: 0.13, ry: -11, rx: 0, op: 1 },
  { s: 200, x: 0, y: -2.583, z: 0.235, ry: -20, rx: 0, op: 1 },
  { s: 300, x: 0, y: -2.479, z: 0.441, ry: -38, rx: 0, op: 1 },
  { s: 400, x: 0, y: -2.398, z: 0.604, ry: -51, rx: 0, op: 1 },
  { s: 500, x: 0, y: -2.356, z: 0.688, ry: -58, rx: 0, op: 1 },
  { s: 600, x: 0, y: -2.288, z: 0.825, ry: -70, rx: 0, op: 1 },
  { s: 700, x: 0, y: -2.259, z: 0.882, ry: -75, rx: 0, op: 1 },
  { s: 800, x: 0, y: -2.219, z: 0.961, ry: -82, rx: 0, op: 1 },
  { s: 900, x: 0, y: -2.203, z: 0.995, ry: -85, rx: 0, op: 1 },
  { s: 1000, x: 0, y: -2.2, z: 0.999, ry: -85, rx: 0, op: 1 },
  { s: 1100, x: 0, y: -2.235, z: 0.652, ry: -118, rx: 7, op: 1 },
  { s: 1200, x: 0, y: -2.244, z: 0.562, ry: -127, rx: 9, op: 1 },
  { s: 1300, x: 0, y: -2.261, z: 0.388, ry: -143, rx: 12, op: 1 },
  { s: 1400, x: 0, y: -2.27, z: 0.303, ry: -151, rx: 14, op: 1 },
  { s: 1500, x: 0, y: -2.283, z: 0.166, ry: -164, rx: 17, op: 1 },
  { s: 1600, x: 0, y: -2.292, z: 0.08, ry: -172, rx: 18, op: 1 },
  { s: 1700, x: 0, y: -2.296, z: 0.045, ry: -176, rx: 19, op: 1 },
  { s: 1800, x: 0, y: -2.3, z: 0.005, ry: -180, rx: 20, op: 1 },
  { s: 1900, x: -0.017, y: -2.293, z: 0.049, ry: -181, rx: 20, op: 1 },
  { s: 2000, x: -0.361, y: -2.145, z: 1.032, ry: -199, rx: 20, op: 1 },
  { s: 2100, x: -0.605, y: -2.041, z: 1.728, ry: -212, rx: 20, op: 1 },
  { s: 2200, x: -0.678, y: -2.009, z: 1.937, ry: -216, rx: 20, op: 1 },
  { s: 2300, x: -0.698, y: -2.001, z: 1.995, ry: -217, rx: 20, op: 1 },
  { s: 2400, x: -0.418, y: -1.894, z: 2.341, ry: -203, rx: 18, op: 1 },
  { s: 2460, x: -0.334, y: -1.86, z: 2.439, ry: -198, rx: 18, op: 1 },
  { s: 2560, x: -0.16, y: -1.8, z: 2.643, ry: -189, rx: 17, op: 0 },
  { s: 2600, x: -0.065, y: -1.762, z: 2.768, ry: -184, rx: 16, op: 0 },
  { s: 2700, x: 0.014, y: -1.732, z: 2.863, ry: -180, rx: 16, op: 0 },
  { s: 2800, x: 0.02, y: -1.698, z: 2.87, ry: -180, rx: 16, op: 0 },
  { s: 2900, x: 0.02, y: -1.534, z: 2.87, ry: -180, rx: 16, op: 0 },
  { s: 3000, x: 0.02, y: -1.459, z: 2.87, ry: -180, rx: 16, op: 0 },
  { s: 3100, x: 0.02, y: -1.337, z: 2.87, ry: -180, rx: 16, op: 0 },
  { s: 3200, x: 0.02, y: -1.256, z: 2.87, ry: -180, rx: 16, op: 0 },
  { s: 3300, x: 0.02, y: -1.198, z: 2.87, ry: -180, rx: 16, op: 0 },
  { s: 3400, x: 0.02, y: -1.167, z: 2.87, ry: -180, rx: 16, op: 0 },
  { s: 3467, x: 0.02, y: -1.15, z: 2.87, ry: -180, rx: 16, op: 0 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    2 * p1 +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

function elasticOut(t: number) {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1;
}

function evalCurve(scrollY: number) {
  const kf = KEYFRAMES;
  const n = kf.length;
  if (scrollY <= kf[0].s) return kf[0];
  if (scrollY >= kf[n - 1].s) return kf[n - 1];
  let i = 1;
  while (i < n - 1 && scrollY > kf[i].s) i++;
  const a = kf[i - 1];
  const b = kf[i];
  const f = (scrollY - a.s) / (b.s - a.s);
  const p0 = kf[Math.max(0, i - 2)];
  const p1 = kf[i - 1];
  const p2 = kf[i];
  const p3 = kf[Math.min(n - 1, i + 1)];
  const cr = (get: (k: Keyframe) => number) => catmullRom(get(p0), get(p1), get(p2), get(p3), f);
  return {
    x: cr((k) => k.x),
    y: cr((k) => k.y),
    z: cr((k) => k.z),
    ry: cr((k) => k.ry),
    rx: cr((k) => k.rx),
    op: Math.min(1, Math.max(0, cr((k) => k.op))),
  };
}

interface Props {
  trackRef: RefObject<HTMLElement | null>;
  wheelRef: RefObject<number>;
  cameraInRef: RefObject<{ start: number }>;
}

export function HeroAstronautScene({ trackRef, wheelRef, cameraInRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    const fov = isMobile ? 42 : 30;
    const camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight
    );
    camera.position.set(0, 1.7, 3);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? "low-power" : "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio || 1, 1) : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    container.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const rgbeLoader = new RGBELoader();

    rgbeLoader.load(`${BASE}/space.hdr`, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
    });

    const directionLight = new THREE.DirectionalLight(0xffffff, 0);
    directionLight.position.set(0, 7, -5).normalize();
    scene.add(directionLight);

    const earthTexture = textureLoader.load(`${BASE}/texture_earth.webp`);
    earthTexture.anisotropy = 4;
    const specularMap = textureLoader.load(`${BASE}/4k_earth_specular_map.webp`);
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(6, isMobile ? 16 : 32, isMobile ? 16 : 32),
      new THREE.MeshPhongMaterial({
        map: earthTexture,
        specularMap,
        specular: new THREE.Color("#191A16"),
        shininess: 6,
      })
    );
    earth.frustumCulled = false;
    earth.position.set(0, -12, -12);
    earth.rotation.set(30 * DEG, 239 * DEG, 0);
    scene.add(earth);

    const particleTexture = textureLoader.load(`${BASE}/particle.webp`);
    const pointsMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(0xbfbfc4),
      size: 0.08,
      map: particleTexture,
      transparent: true,
      depthWrite: false,
    });
    const COUNT = isMobile ? 2200 : 7500;
    const positions = new Float32Array(3 * COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 53;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 53;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 53;
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    points.name = "particleSys";
    scene.add(points);

    const bodyRoughnessMap = textureLoader.load(`${BASE}/webgl-roughness.webp`);
    bodyRoughnessMap.flipY = false;
    bodyRoughnessMap.colorSpace = THREE.SRGBColorSpace;
    const bodyMetalnessMap = textureLoader.load(`${BASE}/webgl-metalness.webp`);
    bodyMetalnessMap.flipY = false;
    const bodyNormalMap = textureLoader.load(`${BASE}/webgl-normal.webp`);
    bodyNormalMap.flipY = false;
    const bodyMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 1,
      color: new THREE.Color(0),
      roughness: 0.75,
      metalness: 0.2,
      envMapIntensity: 0.6,
      roughnessMap: bodyRoughnessMap,
      metalnessMap: bodyMetalnessMap,
      normalMap: bodyNormalMap,
    });
    const headMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 1,
      color: new THREE.Color(0),
      roughness: 0.15,
      metalness: 0.6,
      envMapIntensity: 1,
      side: THREE.DoubleSide,
    });
    const noteTexture = textureLoader.load(`${BASE}/macbook-fill.png`);
    noteTexture.colorSpace = THREE.SRGBColorSpace;
    noteTexture.flipY = false;
    const noteMaterial = new THREE.MeshBasicMaterial({
      map: noteTexture,
      transparent: true,
    });

    const video = document.createElement("video");
    video.src = "/sites/apextechera-design-fc4b5892/root-8a5edab2/video/tech-agency-logo.mp4";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    video.autoplay = true;
    video.setAttribute("playsinline", "");
    video.play().catch(() => {});
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    const videoMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.FrontSide,
      toneMapped: false,
    });

    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    gltfLoader.setDRACOLoader(dracoLoader);

    let model: THREE.Group | null = null;
    let fadeMaterials: THREE.Material[] = [];
    let disposed = false;
    let raf = 0;

    gltfLoader.load(`${BASE}/astro-compressed.glb.txt`, (gltf) => {
      if (disposed) return;
      model = gltf.scene;
      model.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          const mesh = node as THREE.Mesh;
          if (mesh.name === "head") mesh.material = headMaterial;
          if (mesh.name === "body") {
            mesh.material = bodyMaterial;
            mesh.frustumCulled = false;
          }
          if (mesh.name === "note") mesh.material = noteMaterial;
        }
      });
      fadeMaterials = [noteMaterial, bodyMaterial, headMaterial];
      model.position.set(0, -2.7, 0);
      scene.add(model);

      const videoPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.8, 0.45),
        videoMaterial
      );
      videoPlane.position.set(0.015, 1.41, 1.341);
      videoPlane.rotation.set(196 * DEG, 0, Math.PI);
      model.add(videoPlane);
    });

    const onResize = () => {
      const isMobile = window.innerWidth <= 768;
      camera.fov = isMobile ? 42 : 30;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio || 1, 1) : Math.min(window.devicePixelRatio || 1, 1.5));
    };
    window.addEventListener("resize", onResize);

    let isPageVisible = !document.hidden;
    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // The site keeps every section permanently mounted and switches between
    // them with CSS transforms (rather than mounting/unmounting), so this
    // WebGL scene would otherwise keep rendering every single frame FOREVER
    // — even hours later while the user is on a totally different section
    // like "We Create". That's a full 3D scene (earth, particles, astronaut
    // model) competing for CPU/GPU non-stop in the background, which was a
    // major contributor to the overall site feeling heavy/hanging on
    // Android. Use an IntersectionObserver on the scene's own container to
    // detect when the Hero section has been scrolled/transformed off-screen
    // and skip rendering entirely until it's back in view.
    let isSectionVisible = true;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isSectionVisible = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    const clock = new THREE.Clock();
    let smoothScroll = 0;
    const tick = () => {
      if (disposed) return;
      if (!isPageVisible || !isSectionVisible) {
        // Tab backgrounded, or this section scrolled out of view — skip
        // rendering to save CPU/GPU and avoid the phone heating up /
        // throttling while nothing is visible.
        raf = requestAnimationFrame(tick);
        return
      }
      const dt = Math.min(clock.getDelta(), 0.1);
      // Snappy and fast response across both Mobile (Android/iOS) and Desktop
      const lerpSpeed = 0.08;
      const targetScroll = wheelRef.current * 1.45;

      smoothScroll += (targetScroll - smoothScroll) * (1 - Math.exp(-dt / lerpSpeed));

      if (cameraInRef.current.start >= 0) {
        const p = Math.min((performance.now() - cameraInRef.current.start) / 2500, 1);
        camera.position.y = 1.7 * (1 - elasticOut(p));
        if (p >= 1) cameraInRef.current.start = -1;
      }

      earth.rotation.y += 0.001;

      for (let i = 2; i < positions.length; i += 3) {
        positions[i] += 0.02;
        if (positions[i] > 40) positions[i] = -20;
      }
      pointsGeometry.attributes.position.needsUpdate = true;

      if (model) {
        const kf = evalCurve(smoothScroll);
        model.position.set(kf.x, kf.y, kf.z);
        model.rotation.set(kf.rx * DEG, kf.ry * DEG, 0);
        for (const mat of fadeMaterials) {
          (mat as THREE.MeshStandardMaterial).opacity = kf.op;
        }
        videoTexture.needsUpdate = true;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      visibilityObserver.disconnect();
      video.pause();
      video.removeAttribute("src");
      video.load();
      videoTexture.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      noteTexture.dispose();
      particleTexture.dispose();
      earthTexture.dispose();
      specularMap.dispose();
      bodyRoughnessMap.dispose();
      bodyMetalnessMap.dispose();
      bodyNormalMap.dispose();
      earth.geometry.dispose();
      bodyMaterial.dispose();
      headMaterial.dispose();
      noteMaterial.dispose();
      videoMaterial.dispose();
      dracoLoader.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      if (model) {
        model.traverse((node) => {
          if ((node as THREE.Mesh).isMesh) {
            (node as THREE.Mesh).geometry.dispose();
          }
        });
      }
    };
  }, [trackRef, wheelRef, cameraInRef]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-[2] block"
      aria-hidden="true"
    />
  );
}
