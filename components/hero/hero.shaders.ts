export const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const fragmentShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#define OCTAVES 4

uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform vec2 uRes;
uniform vec2 uSizeFrom;
uniform vec2 uSizeTo;
uniform float uProgress;
uniform float uTime;
uniform float uVel;
uniform float uDir;
uniform float uZoomFrom;
uniform float uZoomTo;
uniform vec2 uMouse;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    v += a * vnoise(p);
    p = p * 2.02 + 17.0;
    a *= 0.5;
  }
  return v;
}

vec2 cover(vec2 uv, vec2 res, vec2 img, float zoom) {
  float rs = res.x / res.y;
  float is = img.x / img.y;
  vec2 s = rs > is ? vec2(1.0, is / rs) : vec2(rs / is, 1.0);
  return (uv - 0.5) * s / zoom + 0.5;
}

void main() {
  vec2 uv = vUv;
  float p = uProgress;

  float n = fbm(uv * vec2(2.2, 3.0) + vec2(0.0, uTime * 0.04));
  float axis = uDir > 0.0 ? uv.x : 1.0 - uv.x;
  float t = p * 1.9 - 0.45;                      // overshoot so 0 and 1 are clean
  float d = axis + (n - 0.5) * 0.5;               // noisy liquid edge
  float reveal = 1.0 - smoothstep(t - 0.15, t + 0.15, d);

  float band = 4.0 * reveal * (1.0 - reveal);       // 0 at rest, peaks mid-transition
  vec2 flow = vec2(fbm(uv * 3.0 + 7.0) - 0.5, fbm(uv * 3.0 + 13.0) - 0.5);
  vec2 par = (uMouse - 0.5) * 0.012;
  float vel = clamp(uVel, -1.0, 1.0);
  vec2 disp = flow * (0.10 * band + 0.03 * abs(vel));
  float ca = 0.006 * band + 0.004 * abs(vel);       // chromatic split

  float zf = uZoomFrom * (1.0 + 0.08 * p);
  float zt = uZoomTo * (1.10 - 0.10 * p);

  vec2 uvF = cover(uv, uRes, uSizeFrom, zf) + par + disp;
  vec2 uvT = cover(uv, uRes, uSizeTo,   zt) + par - disp;

  vec3 cf = vec3(
    texture2D(uFrom, uvF + vec2(ca, 0.0)).r,
    texture2D(uFrom, uvF).g,
    texture2D(uFrom, uvF - vec2(ca, 0.0)).b
  );

  vec3 ct = vec3(
    texture2D(uTo,   uvT + vec2(ca, 0.0)).r,
    texture2D(uTo,   uvT).g,
    texture2D(uTo,   uvT - vec2(ca, 0.0)).b
  );

  vec3 col = mix(cf, ct, reveal);
  col += (hash(uv * uRes + fract(uTime) * 100.0) - 0.5) * 0.03 * band; // grain ONLY during transition

  gl_FragColor = vec4(col, 1.0);
}
`;
