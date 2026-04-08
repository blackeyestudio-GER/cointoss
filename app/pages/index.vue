<template>
  <div
    class="min-h-dvh text-white"
    :class="obsMode ? 'flex flex-col items-center justify-center p-2' : 'bg-night px-4 py-6'"
  >
    <div v-if="!obsMode" class="mx-auto mb-10 mt-2 flex max-w-7xl flex-col gap-4 md:flex-row">
      <img
        class="aspect-square w-full rounded-lg border border-white/10 object-cover shadow-md md:w-1/4"
        :src="introLogoSrc"
        width="400"
        height="400"
        alt="Logo"
        loading="lazy"
      />
      <div class="rounded-lg border border-white/10 bg-eerie-black p-4 text-sm leading-relaxed text-gray-200 shadow md:w-3/4">
        <p>
          Hier kannst du eine Münze virtuell werfen und per Zufall <strong>Kopf</strong> oder <strong>Zahl</strong> erhalten –
          praktisch für Streams, Mini-Spiele, wer dran ist, oder wenn schnell jemand entscheiden soll. Klick auf die Münze
          oder den Button, fertig.
        </p>
        <p class="mt-3">
          Die Nutzung ist für dich dauerhaft kostenlos. Es gibt <strong>keine Werbung</strong> auf dieser Seite – ich trage die
          Kosten selbst und finanziere das Projekt aus eigener Tasche.
        </p>
        <p class="mt-3">
          Wenn du dich mit dem Angebot verbunden fühlst und mich dennoch unterstützen möchtest, kannst du das freiwillig über
          die folgenden Kanäle tun:
          <a
            href="https://paypal.me/blackeye1987"
            class="font-medium text-moonstone underline decoration-moonstone/50 underline-offset-2 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
            >PayPal</a
          >,
          <a
            href="https://ko-fi.com/blackeye1987"
            class="font-medium text-moonstone underline decoration-moonstone/50 underline-offset-2 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
            >Ko-fi</a
          >
          oder
          <a
            href="https://www.patreon.com/blackeye1987"
            class="font-medium text-moonstone underline decoration-moonstone/50 underline-offset-2 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
            >Patreon</a
          >. Das ist keine Verpflichtung – ein einfaches Danke reicht mir auch. Vielen Dank fürs Vorbeischauen.
        </p>
      </div>
    </div>

    <div
      class="mx-auto flex w-full max-w-xl flex-col gap-4"
      :class="obsMode ? 'max-w-none flex-1 items-center justify-center' : ''"
    >
      <header v-if="!obsMode" class="flex w-full flex-wrap items-center gap-x-5 gap-y-2">
        <label class="flex cursor-pointer items-center gap-2.5 text-sm text-white">
          <input
            type="checkbox"
            :checked="viewMode === 'bird'"
            class="input-check"
            @change="viewMode = ($event.target as HTMLInputElement).checked ? 'bird' : 'top'"
          />
          <span>3D</span>
        </label>
        <button
          type="button"
          class="ml-auto inline-flex items-center gap-2 rounded-lg border border-white/20 bg-eerie-black px-3 py-2 text-sm font-semibold text-white hover:border-moonstone/50 hover:bg-white/5"
          @click="shareOpen = true"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
          </svg>
          Teilen
        </button>
      </header>

      <div
        class="w-full max-w-[min(100%,440px)]"
        :class="obsMode ? 'max-w-[min(92vmin,560px)]' : 'mx-auto'"
      >
        <div
          ref="stageOuter"
          class="relative aspect-[3/5] w-full overflow-hidden"
          :class="
            obsMode
              ? ''
              : [
                  'shadow-lg',
                  canvasIsTransparent
                    ? 'rounded-lg border-[3px] border-black/50 ring-1 ring-black/30'
                    : 'rounded-lg border-[3px] border-moonstone/45 ring-1 ring-white/10',
                ]
          "
          :style="{ backgroundColor: canvasIsTransparent ? 'transparent' : '#1C1E1E' }"
        >
          <div
            ref="flickWrap"
            class="flick-wrap absolute inset-0"
            :class="{ 'is-flicking': flicking }"
            @click="onStageClick"
            @keydown.space.prevent="onStageClick"
            tabindex="0"
            role="button"
            :aria-label="tossing ? 'Münze wirft …' : 'Klicken zum Werfen'"
          >
            <canvas ref="canvasEl" class="block h-full w-full touch-manipulation" />
          </div>
        </div>
      </div>

      <div v-if="!obsMode" class="flex justify-center">
        <button
          type="button"
          :disabled="tossing || !threeReady"
          class="rounded-lg bg-twitch-purple px-8 py-3 text-sm font-bold text-white shadow-lg transition enabled:hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
          @click="startToss"
        >
          {{ !threeReady ? 'Laden …' : tossing ? 'Wirft …' : 'Münze werfen' }}
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="shareOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
        role="presentation"
        @click.self="shareOpen = false"
      >
        <div
          class="max-h-[min(90vh,640px)] w-full max-w-lg overflow-y-auto rounded-xl border border-white/15 bg-eerie-black text-white shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-title"
          @click.stop
        >
          <div class="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h2 id="share-title" class="text-lg font-semibold">Link teilen</h2>
            <button
              type="button"
              class="rounded-lg px-3 py-2 text-dim-gray hover:bg-white/10 hover:text-white"
              aria-label="Schließen"
              @click="shareOpen = false"
            >
              ✕
            </button>
          </div>
          <div class="flex flex-col gap-3 p-5">
            <label class="share-option share-option--compact">
              <input v-model="shareIncludeObs" type="checkbox" class="input-check" />
              <span class="share-option-label">OBS</span>
            </label>
            <label class="share-option share-option--compact">
              <input v-model="shareIncludeBirdView" type="checkbox" class="input-check" />
              <span class="share-option-label">3D</span>
            </label>
            <label class="share-option share-option--compact">
              <input v-model="shareIncludeAutostart" type="checkbox" class="input-check" />
              <span class="share-option-label">AUTOSTART</span>
            </label>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label class="flex min-w-0 flex-1 flex-col gap-2 text-xs text-dim-gray">
                URL
                <input
                  :value="shareUrlDisplay"
                  readonly
                  class="w-full rounded-lg border border-white/15 bg-night px-3 py-3 font-mono text-xs text-white"
                  @focus="selectShareInput"
                />
              </label>
              <button
                type="button"
                class="shrink-0 rounded-lg bg-twitch-purple px-6 py-3 text-sm font-semibold hover:bg-violet-600"
                @click="copyShareLink"
              >
                {{ shareCopied ? 'Kopiert' : 'Kopieren' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import introLogoSrc from '~/assets/logo.png'
import { COIN_FACE_SVG_HEADS, COIN_FACE_SVG_TAILS } from '~/utils/coinFaceSvgs'

const route = useRoute()

const obsMode = computed(() => {
  const o = route.query.obs
  return o === '1' || o === 'true' || o === 'yes'
})

/** `top` = Draufsicht; `bird` = Vogelperspektive von vorn (symmetrisch, Münze flach). */
const viewMode = ref<'top' | 'bird'>('top')
const shareOpen = ref(false)
const shareIncludeObs = ref(true)
const shareIncludeBirdView = ref(false)
const shareIncludeAutostart = ref(true)
const shareCopied = ref(false)
let shareCopyResetId = 0

const tossing = ref(false)
const flicking = ref(false)
const threeReady = ref(false)

const flickWrap = ref<HTMLElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const stageOuter = ref<HTMLElement | null>(null)

function truthyQuery(v: unknown): boolean {
  return v === '1' || v === 'true' || v === 'yes' || v === 'on'
}

/**
 * Transparenter Seitenhintergrund (OBS Alpha). Bei obs=1 immer an.
 * Optional: ?transparent=1 | ?alpha=1 ohne OBS; ?chroma=1 bleibt als Legacy-Link kompatibel.
 */
const canvasIsTransparent = computed(() => {
  if (obsMode.value) return true
  const q = route.query
  return truthyQuery(q.transparent) || truthyQuery(q.alpha) || truthyQuery(q.chroma)
})

useHead(() => ({
  htmlAttrs: {
    class: canvasIsTransparent.value ? 'obs-transparent-active' : undefined,
  },
}))

function applyTransparentToDocument(on: boolean) {
  if (!import.meta.client) return
  const html = document.documentElement
  const body = document.body
  const nuxt = document.getElementById('__nuxt')
  const app = document.getElementById('app')
  if (on) {
    html.classList.add('obs-transparent-active')
    html.style.setProperty('background', 'transparent', 'important')
    body.style.setProperty('background', 'transparent', 'important')
    nuxt?.style.setProperty('background', 'transparent', 'important')
    app?.style.setProperty('background', 'transparent', 'important')
  } else {
    html.classList.remove('obs-transparent-active')
    html.style.removeProperty('background')
    body.style.removeProperty('background')
    nuxt?.style.removeProperty('background')
    app?.style.removeProperty('background')
  }
}

function applyQueryFromRoute() {
  const q = route.query

  const v = q.view
  if (typeof v === 'string') {
    const s = v.toLowerCase()
    if (s === 'top' || s === 'oben' || s === 'drauf') viewMode.value = 'top'
    else if (s === 'bird' || s === 'vogel' || s === '3d' || s === 'front' || s === 'vorne') viewMode.value = 'bird'
  }
}

applyQueryFromRoute()

watch(
  () => route.query,
  () => {
    applyQueryFromRoute()
  },
  { deep: true },
)

function buildShareUrl(
  includeObs: boolean,
  includeBirdView: boolean,
  includeAutostart: boolean,
): string {
  if (import.meta.server) return ''
  const u = new URL(window.location.href)
  u.search = ''
  if (includeObs) u.searchParams.set('obs', '1')
  if (includeBirdView) u.searchParams.set('view', 'bird')
  if (includeAutostart) u.searchParams.set('autostart', '1')
  return u.toString()
}

function selectShareInput(ev: Event) {
  const el = ev.target
  if (el instanceof HTMLInputElement) el.select()
}

const shareUrlDisplay = computed(() =>
  buildShareUrl(
    shareIncludeObs.value,
    shareIncludeBirdView.value,
    shareIncludeAutostart.value,
  ),
)

async function copyShareLink() {
  const url = buildShareUrl(
    shareIncludeObs.value,
    shareIncludeBirdView.value,
    shareIncludeAutostart.value,
  )
  try {
    await navigator.clipboard?.writeText(url)
    shareCopied.value = true
    clearTimeout(shareCopyResetId)
    shareCopyResetId = window.setTimeout(() => {
      shareCopied.value = false
    }, 2000)
  } catch {
    prompt('URL kopieren:', url)
  }
}

watch(shareOpen, (open) => {
  if (open) {
    shareIncludeBirdView.value = viewMode.value === 'bird'
    shareIncludeAutostart.value = true
  }
})

/* ----- Web Audio ----- */
let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (import.meta.server) return null
  if (!audioCtx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    audioCtx = new AC()
  }
  return audioCtx
}

function playFlick() {
  const ctx = getAudioContext()
  if (!ctx || ctx.state !== 'running') return
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.setValueAtTime(800, t)
  osc.type = 'square'
  osc.frequency.setValueAtTime(2200, t)
  osc.frequency.exponentialRampToValueAtTime(480, t + 0.035)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(0.09, t + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045)
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.05)
}

function playLand() {
  const ctx = getAudioContext()
  if (!ctx || ctx.state !== 'running') return
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(185, t)
  osc.frequency.exponentialRampToValueAtTime(62, t + 0.14)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(0.32, t + 0.006)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.24)

  const noise = ctx.createBufferSource()
  const nLen = Math.ceil(ctx.sampleRate * 0.06)
  const buf = ctx.createBuffer(1, nLen, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < nLen; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / nLen)
  const ng = ctx.createGain()
  noise.buffer = buf
  ng.gain.setValueAtTime(0.0001, t)
  ng.gain.exponentialRampToValueAtTime(0.07, t + 0.003)
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.055)
  noise.connect(ng)
  ng.connect(ctx.destination)
  noise.start(t)
  noise.stop(t + 0.07)
}

/* ----- SVG → texture ----- */
function textureFromSvg(svg: string): Promise<import('three').CanvasTexture> {
  return import('three').then((THREE) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      img.onload = () => {
        const c = document.createElement('canvas')
        const size = 512
        c.width = size
        c.height = size
        const ctx = c.getContext('2d')
        if (!ctx) {
          URL.revokeObjectURL(url)
          reject(new Error('2d context'))
          return
        }
        ctx.clearRect(0, 0, size, size)
        ctx.drawImage(img, 0, 0, size, size)
        URL.revokeObjectURL(url)
        const tex = new THREE.CanvasTexture(c)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        tex.needsUpdate = true
        resolve(tex)
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('svg image'))
      }
      img.src = url
    })
  })
}

/* ----- Three.js ----- */
let THREE: typeof import('three') | null = null
let renderer: import('three').WebGLRenderer | null = null
let scene: import('three').Scene | null = null
let camera: import('three').PerspectiveCamera | null = null
let coinPivot: import('three').Group | null = null
let coinRestTilt: import('three').Group | null = null
let coinMesh: import('three').Mesh | null = null
let faceTextures: { heads: import('three').CanvasTexture; tails: import('three').CanvasTexture } | null = null

/** Vertical FOV (deg). */
const CAMERA_FOV = 50
/** Vogelperspektive: Bogen in Y (Münze hebt sich). */
const TOSS_ARC_PEAK_BIRD = 2.38
/** Draufsicht: Bogen in Welt-Z. */
const TOSS_ARC_PEAK_TOP_Z = 1.12
/** Pivot Y at rest — tiefer = Münze weiter unten im Kasten (Draufsicht & 3D). */
const COIN_REST_Y = -0.14
let rafId = 0
let resizeObs: ResizeObserver | null = null

const prefersReducedMotion =
  import.meta.client && typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

function coinHeight(): number {
  return 0.15
}

function applyCameraPose() {
  if (!camera) return
  if (viewMode.value === 'top') {
    camera.up.set(0, 0, -1)
    camera.position.set(0, 8.9, 0)
    camera.lookAt(0, COIN_REST_Y, 0)
    camera.fov = 44
  } else {
    camera.up.set(0, 1, 0)
    camera.position.set(0, 4.35, 6.95)
    camera.lookAt(0, COIN_REST_Y, 0)
    camera.fov = 46
  }
  camera.updateProjectionMatrix()
}

/** Keine statische Schräge — nur leichte Wackel-Korrektur beim Flug. */
function applyRestTilt(extraZ: number) {
  if (!coinRestTilt) return
  coinRestTilt.rotation.set(0, 0, extraZ * 0.18)
}

/** Remove mesh + materials; keep shared SVG face textures for rebuild. */
function disposeCoinMeshOnly() {
  if (coinMesh) {
    coinMesh.geometry.dispose()
    const mats = coinMesh.material
    if (Array.isArray(mats)) mats.forEach((m) => m.dispose())
    else mats.dispose()
    coinMesh = null
  }
  coinPivot = null
  coinRestTilt = null
}

function disposeFaceTextures() {
  if (faceTextures) {
    faceTextures.heads.dispose()
    faceTextures.tails.dispose()
    faceTextures = null
  }
}

function disposeThree() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
  resizeObs?.disconnect()
  resizeObs = null
  if (coinPivot && scene) scene.remove(coinPivot)
  disposeCoinMeshOnly()
  disposeFaceTextures()
  renderer?.dispose()
  renderer = null
  scene = null
  camera = null
  threeReady.value = false
}

function syncRendererSize() {
  if (!renderer || !camera || !canvasEl.value || !stageOuter.value) return
  const w = stageOuter.value.clientWidth
  const h = stageOuter.value.clientHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  renderer.setPixelRatio(dpr)
  renderer.setSize(w, h, false)
  camera.aspect = w / Math.max(h, 1)
  camera.updateProjectionMatrix()
}

function rebuildCoinMesh() {
  if (!THREE || !scene || !faceTextures) return

  if (coinPivot) {
    scene.remove(coinPivot)
  }
  disposeCoinMeshOnly()

  const h = coinHeight()
  const geo = new THREE.CylinderGeometry(0.92, 0.92, h, 72)
  const matSide = new THREE.MeshStandardMaterial({
    color: 0xb08a3c,
    metalness: 0.72,
    roughness: 0.28,
  })
  const matHeads = new THREE.MeshStandardMaterial({
    map: faceTextures.heads,
    metalness: 0.18,
    roughness: 0.42,
    color: 0xffffff,
  })
  const matTails = new THREE.MeshStandardMaterial({
    map: faceTextures.tails,
    metalness: 0.18,
    roughness: 0.42,
    color: 0xffffff,
  })
  coinMesh = new THREE.Mesh(geo, [matSide, matHeads, matTails])
  coinMesh.castShadow = false
  coinMesh.receiveShadow = false
  coinMesh.rotation.order = 'YXZ'
  coinMesh.rotation.x = 0

  coinRestTilt = new THREE.Group()
  coinRestTilt.add(coinMesh)

  coinPivot = new THREE.Group()
  coinPivot.position.y = COIN_REST_Y
  coinPivot.add(coinRestTilt)
  scene.add(coinPivot)

  applyRestTilt(0)
  applyCameraPose()
}

function initThree() {
  if (!canvasEl.value || !stageOuter.value) return

  void Promise.all([import('three'), textureFromSvg(COIN_FACE_SVG_HEADS), textureFromSvg(COIN_FACE_SVG_TAILS)]).then(
    ([mod, texHeads, texTails]) => {
      THREE = mod
      faceTextures = { heads: texHeads, tails: texTails }

      const bg = canvasIsTransparent.value ? 0x000000 : 0x1c1e1e
      const alpha = canvasIsTransparent.value ? 0 : 1
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100)
      applyCameraPose()

      renderer = new THREE.WebGLRenderer({
        canvas: canvasEl.value!,
        antialias: true,
        alpha: true,
      })
      renderer.setClearColor(bg, alpha)
      syncRendererSize()

      const amb = new THREE.AmbientLight(0xffffff, 0.52)
      scene.add(amb)
      const key = new THREE.DirectionalLight(0xffffff, 1.08)
      key.position.set(3.2, 6.2, 4.5)
      scene.add(key)
      const fill = new THREE.DirectionalLight(0x3aa1bd, 0.38)
      fill.position.set(-4.2, 2.4, -2.2)
      scene.add(fill)
      const rim = new THREE.DirectionalLight(0xffeedd, 0.22)
      rim.position.set(-1.5, 0.5, -4)
      scene.add(rim)

      rebuildCoinMesh()
      threeReady.value = true

      resizeObs = new ResizeObserver(() => syncRendererSize())
      resizeObs.observe(stageOuter.value!)

      const loop = () => {
        if (renderer && scene && camera) renderer.render(scene, camera)
        rafId = requestAnimationFrame(loop)
      }
      loop()
    },
  )
}

function syncRendererClearColor() {
  if (!renderer || !THREE) return
  const bg = canvasIsTransparent.value ? 0x000000 : 0x1c1e1e
  const alpha = canvasIsTransparent.value ? 0 : 1
  renderer.setClearColor(bg, alpha)
}

watch(canvasIsTransparent, () => {
  applyTransparentToDocument(canvasIsTransparent.value)
  syncRendererClearColor()
})

watch(viewMode, () => {
  if (!THREE || !scene) return
  applyCameraPose()
  syncRendererSize()
  rebuildCoinMesh()
})

function renderFramePose(rx: number, arc: number, tiltZ: number) {
  if (!coinMesh || !coinPivot || !coinRestTilt) return
  coinMesh.rotation.x = rx
  if (viewMode.value === 'top') {
    coinPivot.position.set(0, COIN_REST_Y, -arc * 0.92)
  } else {
    coinPivot.position.set(0, COIN_REST_Y + arc, 0)
  }
  applyRestTilt(tiltZ)
}

function startToss() {
  if (tossing.value || !coinMesh || !THREE) return
  void getAudioContext()?.resume()

  flicking.value = true
  window.setTimeout(() => {
    flicking.value = false
  }, 160)
  playFlick()

  tossing.value = true

  const isHeads = Math.random() < 0.5
  const startRx = coinMesh.rotation.x
  const fullSpins = 5 + Math.floor(Math.random() * 4)
  const endRx = startRx + fullSpins * 2 * Math.PI + (isHeads ? 0 : Math.PI)
  const duration = prefersReducedMotion ? 450 : 2100
  const peakH = prefersReducedMotion
    ? 0.45
    : viewMode.value === 'top'
      ? TOSS_ARC_PEAK_TOP_Z
      : TOSS_ARC_PEAK_BIRD
  const t0 = performance.now()
  let landed = false

  const tick = (now: number) => {
    if (!coinMesh || !coinPivot || !coinRestTilt) return
    const elapsed = now - t0
    const u = Math.min(elapsed / duration, 1)
    const ease = 1 - (1 - u) ** 3
    const arc = 4 * peakH * u * (1 - u)
    const rx = startRx + (endRx - startRx) * ease
    const tiltZ = Math.sin(u * Math.PI * 2.2) * (prefersReducedMotion ? 0.03 : 0.12) * (1 - u)
    renderFramePose(rx, arc, tiltZ)

    if (u >= 1 && !landed) {
      landed = true
      playLand()
      renderFramePose(endRx, 0, 0)
      tossing.value = false
      return
    }
    if (u < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function onStageClick() {
  if (!threeReady.value) return
  startToss()
}

let audioBump: (() => void) | null = null
let autostartTimeoutId = 0

function wantsAutostartFromQuery(): boolean {
  return truthyQuery(route.query.autostart)
}

function scheduleAutostartFromQuery() {
  if (import.meta.server) return
  clearTimeout(autostartTimeoutId)
  if (!wantsAutostartFromQuery()) return
  autostartTimeoutId = window.setTimeout(() => {
    autostartTimeoutId = 0
    void getAudioContext()?.resume()
    if (threeReady.value && !tossing.value) startToss()
  }, 1000)
}

watch([threeReady, () => route.query.autostart], () => {
  if (threeReady.value) scheduleAutostartFromQuery()
})

onMounted(() => {
  audioBump = () => {
    void getAudioContext()?.resume()
  }
  window.addEventListener('pointerdown', audioBump, { capture: true, passive: true })

  nextTick(() => {
    applyTransparentToDocument(canvasIsTransparent.value)
    initThree()
  })
})

onUnmounted(() => {
  if (audioBump) {
    window.removeEventListener('pointerdown', audioBump, true)
    audioBump = null
  }
  clearTimeout(autostartTimeoutId)
  clearTimeout(shareCopyResetId)
  disposeThree()
  applyTransparentToDocument(false)
  void audioCtx?.close()
  audioCtx = null
})
</script>

<style scoped>
.input-check {
  @apply h-4 w-4 shrink-0 cursor-pointer rounded border-2 border-white/30 bg-night text-moonstone accent-moonstone transition;
  @apply focus:outline-none focus:ring-2 focus:ring-moonstone/45 focus:ring-offset-2 focus:ring-offset-night;
  @apply checked:border-moonstone hover:border-white/45;
}

.share-option {
  @apply flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-1 py-1.5 text-sm text-white transition hover:border-white/10 hover:bg-white/[0.03];
}

.share-option--compact {
  @apply items-center py-1;
}

.share-option-label {
  @apply text-xs font-semibold tracking-widest text-white;
}

@keyframes coin-flick-bump {
  0% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-22px);
  }
  100% {
    transform: translateY(0);
  }
}

.flick-wrap.is-flicking {
  animation: coin-flick-bump 0.14s cubic-bezier(0.25, 0.9, 0.32, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .flick-wrap.is-flicking {
    animation: none;
  }
}
</style>
