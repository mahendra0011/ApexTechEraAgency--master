import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_speed;
uniform float u_scale;
uniform float u_octaves;
uniform float u_persistence;
uniform float u_lacunarity;
uniform float u_driftSpeed;
uniform float u_warpSpeed;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_colorGain;
uniform float u_saturation;
uniform float u_brightness;
uniform float u_opacity;
uniform float u_cursorInteraction;
uniform vec2 u_mouse;
uniform float u_cursorIntensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 8; i++) {
    if (float(i) >= u_octaves) break;
    value += amp * noise(p * freq);
    amp *= u_persistence;
    freq *= u_lacunarity;
  }
  return value;
}

vec3 grade(vec3 c) {
  float luma = dot(c, vec3(0.299, 0.587, 0.114));
  c = mix(vec3(luma), c, 1.0 + u_saturation);
  c += u_brightness;
  c *= u_colorGain;
  return c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float t = u_time * u_speed;

  vec2 drift = vec2(
    sin(t * u_driftSpeed * 14.0 + 1.3),
    cos(t * u_driftSpeed * 11.0 + 0.7)
  ) * 0.55;

  float cursor = 0.0;
  if (u_cursorInteraction > 0.5) {
    vec2 mp = (u_mouse - 0.5) * vec2(aspect, 1.0);
    float d = distance(p, mp);
    cursor = exp(-d * d * 4.0) * u_cursorIntensity;
  }

  vec2 q = p * u_scale + drift * u_driftSpeed * 2.0;

  float wd = t * u_warpSpeed * 5.0;
  float f1 = fbm(q + wd + cursor * 0.9);
  float f2 = fbm(q - wd + f1 * 1.5);
  vec2 warped = q + vec2(f1, f2) * (0.4 + cursor * 0.6);

  float n1 = fbm(warped + t * 0.02);
  float n2 = fbm(warped * 1.7 - t * 0.012 + n1 * 0.8);
  float v = n1 * 0.55 + n2 * 0.45;

  v += (hash(uv * u_resolution.y * 0.01) - 0.5) * 0.06;
  v = clamp(v + cursor * 0.1, 0.0, 1.0);

  vec3 color = mix(u_color1, u_color2, v);
  color = grade(color);

  gl_FragColor = vec4(color, u_opacity);
}
`;

function hexToRgb(hex) {
  let h = String(hex).replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(h, 16);
  if (Number.isNaN(num)) return [0, 0, 0];
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Watercolor shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const Watercolor = ({
  width = "100%",
  height = "100%",
  className = "",
  children,
  speed = 0.6,
  scale = 0.6,
  octaves = 6,
  persistence = 0.6,
  lacunarity = 2.4,
  driftSpeed = 0.04,
  warpSpeed = 0.08,
  color1 = "#0a0a0a",
  color2 = "#e0e0e0",
  colorGain = 1,
  saturation = 0,
  brightness = 0.15,
  opacity = 1,
  cursorInteraction = false,
  cursorIntensity = 1,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const propsRef = useRef({});
  propsRef.current = {
    speed,
    scale,
    octaves,
    persistence,
    lacunarity,
    driftSpeed,
    warpSpeed,
    color1,
    color2,
    colorGain,
    saturation,
    brightness,
    opacity,
    cursorInteraction,
    cursorIntensity,
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) {
      console.error("Watercolor: WebGL is not supported.");
      return;
    }

    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Watercolor program error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      speed: gl.getUniformLocation(program, "u_speed"),
      scale: gl.getUniformLocation(program, "u_scale"),
      octaves: gl.getUniformLocation(program, "u_octaves"),
      persistence: gl.getUniformLocation(program, "u_persistence"),
      lacunarity: gl.getUniformLocation(program, "u_lacunarity"),
      driftSpeed: gl.getUniformLocation(program, "u_driftSpeed"),
      warpSpeed: gl.getUniformLocation(program, "u_warpSpeed"),
      color1: gl.getUniformLocation(program, "u_color1"),
      color2: gl.getUniformLocation(program, "u_color2"),
      colorGain: gl.getUniformLocation(program, "u_colorGain"),
      saturation: gl.getUniformLocation(program, "u_saturation"),
      brightness: gl.getUniformLocation(program, "u_brightness"),
      opacity: gl.getUniformLocation(program, "u_opacity"),
      cursorInteraction: gl.getUniformLocation(program, "u_cursorInteraction"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      cursorIntensity: gl.getUniformLocation(program, "u_cursorIntensity"),
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: 1 - (event.clientY - rect.top) / rect.height,
      };
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("pointermove", onPointerMove);

    let rafId;
    const start = performance.now();

    const render = (now) => {
      const p = propsRef.current;
      const t = (now - start) / 1000;

      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, t);
      gl.uniform1f(uniforms.speed, p.speed);
      gl.uniform1f(uniforms.scale, p.scale);
      gl.uniform1f(uniforms.octaves, p.octaves);
      gl.uniform1f(uniforms.persistence, p.persistence);
      gl.uniform1f(uniforms.lacunarity, p.lacunarity);
      gl.uniform1f(uniforms.driftSpeed, p.driftSpeed);
      gl.uniform1f(uniforms.warpSpeed, p.warpSpeed);
      gl.uniform3fv(uniforms.color1, hexToRgb(p.color1));
      gl.uniform3fv(uniforms.color2, hexToRgb(p.color2));
      gl.uniform1f(uniforms.colorGain, p.colorGain);
      gl.uniform1f(uniforms.saturation, p.saturation);
      gl.uniform1f(uniforms.brightness, p.brightness);
      gl.uniform1f(uniforms.opacity, p.opacity);
      gl.uniform1f(uniforms.cursorInteraction, p.cursorInteraction ? 1 : 0);
      gl.uniform2f(uniforms.mouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uniforms.cursorIntensity, p.cursorIntensity);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className ? `watercolor ${className}` : "watercolor"}
      style={{ position: "relative", width, height, overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        className="watercolor__canvas"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />
      {children ? (
        <div className="watercolor__content" style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default Watercolor;