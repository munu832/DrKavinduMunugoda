let dpr = Math.max(1, window.devicePixelRatio);

// Load YouTube IFrame API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let youtubePlayers = [];
const videoIds = ['q-lVfEwMxHI', 'x-sdfghjkhg', 'x-sdfghjkbvc'];

function onYouTubeIframeAPIReady() {
    videoIds.forEach((videoId, index) => {
        youtubePlayers[index] = new YT.Player(`youtube-player-${index}`, {
            height: '100%',
            width: '100%',
            videoId: videoId, 
            playerVars: {
                'playsinline': 1,
                'controls': 0,
                'rel': 0,
                'showinfo': 0
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    });
}

function onPlayerReady(event) {
    // Video is ready to play
}

const vertexSource = `#version 300 es
precision highp float;
in vec4 position;
void main(void) {
    gl_Position = position;
}`;

function compile(shader, source) {
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }
}

let canvas, gl, shaders = [], programs = [], vertices, buffer;

function setup() {
  canvas = document.createElement("canvas");
  gl = canvas.getContext("webgl2");
  const vs = gl.createShader(gl.VERTEX_SHADER);
  compile(vs, vertexSource);
  
  shaders = Array.from(document.querySelectorAll("script[type='x-shader/x-fragment']"));
  programs = shaders.map(() => gl.createProgram());

  for (let i = 0; i < shaders.length; i++) {
    let addr = gl.createShader(gl.FRAGMENT_SHADER);
    let program = programs[i];
    compile(addr, shaders[i].textContent);
    gl.attachShader(program, vs);
    gl.attachShader(program, addr);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
    }
  }

  vertices = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  for (const program of programs) {
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    program.resolution = gl.getUniformLocation(program, "resolution");
    program.time = gl.getUniformLocation(program, "time");
  }
}

function draw(now, program) {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.uniform2f(program.resolution, canvas.width, canvas.height);
  gl.uniform1f(program.time, now * 1e-3);
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length * 0.5);
}

let running = false, then = 0, af = null;

function loop(now, index) {
  if (running) {
    draw(now + then, programs[index]);
    af = requestAnimationFrame((t) => loop(t, index));
  } else {
    then = now;
    cancelAnimationFrame(af);
  }
}

function removeCanvas() {
  const canvas = document.querySelector("canvas");
  running = false;
  if (canvas) {
    canvas.remove();
  }
}

function setXOff(slider, value) {
  if (!slider) {
    slider = document.querySelector(".slider");
  }
  slider.style.setProperty("--x-off", `${value}%`);
}

function hookEvents() {
  const slider = document.querySelector(".slider");

  function activate(e) {
    const items = document.querySelectorAll(".slide");
    if (e.target.closest(".nav")) {
      setXOff(slider, 0);
      setTimeout(() => {
        e.target.matches(".next") && slider.append(items[0]);
        e.target.matches(".prev") && slider.prepend(items[items.length - 1]);
        removeCanvas();
        document.querySelectorAll(".slide .more use").forEach((p) => p.setAttribute("href", "#play"));
      }, running ? 1000 : 0);
    }
  }

  let sliding = false;
  let origX = 0;

  function slide(e) {
    if (!sliding) return;
    const { touches } = e;
    const first = touches[0];
    const val = first.screenX - origX;
    setXOff(slider, Math.max(-50, Math.min(50, val)));
    if (val < -50) {
      sliding = false;
      setXOff(slider, 0);
      document.querySelector(".next").click();
    } else if (val > 50) {
      sliding = false;
      setXOff(slider, 0);
      document.querySelector(".prev").click();
    }
  }

  document.addEventListener("click", activate);
  document.addEventListener("touchmove", slide);
  document.addEventListener("touchstart", (e) => {
    if (running) return;
    sliding = true;
    origX = e.touches[0].screenX;
  });
  document.addEventListener("touchend", () => {
    if (running) return;
    sliding = false;
    setXOff(null, 0);
  });

  document.addEventListener("keydown", (e) => {
    const items = document.querySelectorAll(".slide");
    if (e.key === "ArrowRight") {
      document.querySelector(".next").click();
    } else if (e.key === "ArrowLeft") {
      document.querySelector(".prev").click();
    } else if (e.key === " ") {
      const button = items[1].querySelector(".more");
      button.click();
    }
  });

  setupPlayButton();
}

function setupPlayButton() {
    const listItems = document.querySelectorAll(".slide");
    for (let i = 0; i < listItems.length; i++) {
        const item = listItems[i];
        const button = item.querySelector(".more");
        button.addEventListener("click", (e) => {
            const slide = e.target.closest(".slide");
            running = !running;
            button.querySelector("use").setAttribute("href", running ? "#pause" : "#play");
            if (!running) {
                setXOff(slider, 0);
                if (slide.classList.contains('youtube-slide')) {
                    youtubePlayers[i].pauseVideo();
                }
                return;
            }
            setXOff(slider, 100);
            if (slide.classList.contains('youtube-slide')) {
                youtubePlayers[i].playVideo();
            } else if (slide.querySelector("canvas")) {
                running = true;
                loop(0, slide.dataset.shaderIndex);
            } else {
                animate(slide);
            }
        });
    }
}

function animate(slide) {
    if (slide.classList.contains('youtube-slide')) {
        const index = Array.from(slide.parentNode.children).indexOf(slide);
        youtubePlayers[index].playVideo();
    } else {
        const shaderIndex = slide.dataset.shaderIndex;
        const visual = slide.querySelector(".visual");
        resizeInner();
        running = true;
        loop(0, shaderIndex);
        visual.append(canvas);
    }
}

async function init() {
    console.clear();
    hookEvents();
    setup();
    resize();

    return new Promise((resolve) => {
        for (let i = 0; i < programs.length; i++) {
            if (i > 1) {
                dpr = Math.max(1, 0.25 * window.devicePixelRatio);
                resize();
            }
            const slide = document.querySelectorAll(".slide")[i];
            if (!slide.classList.contains('youtube-slide')) {
                draw(0, programs[i]);
                const img = canvas.toDataURL();
                slide.style.backgroundImage = `url(${img})`;
                slide.dataset.shaderIndex = i;
                slide.dataset.rerendered = `${canvas.width}x${canvas.height}`;
            }
        }
        dpr = Math.max(1, window.devicePixelRatio);
        setTimeout(async () => await regenerateImagesWithFullResolution(), 2000);
        resolve();
    });
}

async function regenerateImagesWithFullResolution(all = false) {
  return new Promise((resolve) => {
    const slides = document.querySelectorAll(".slide");
    resize();
    for (const slide of slides) {
      const shaderIndex = slide.dataset.shaderIndex;
      if (!all && shaderIndex < 2) continue;
      requestAnimationFrame(() => renderBackground(slide));
    }
    resolve();
  });
}

function renderBackground(slide) {
  const shaderIndex = slide.dataset.shaderIndex;
  draw(0, programs[shaderIndex]);
  const img = canvas.toDataURL();
  slide.style.backgroundImage = `url(${img})`;
  slide.dataset.rerendered = `${canvas.width}x${canvas.height}`;
  slide.classList.toggle("rerendered");
}

function sizeCanvas() {
    const s = Math.min(1600, 0.8 * Math.max(innerWidth, innerHeight));
    const [w, h] = [canvas.width, canvas.height] = [s, s];
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
}

function resizeInner() {
    const main = document.querySelector("main");
    const h = 0.9 * Math.max(320, Math.min(innerHeight, main.clientHeight));
    const w = main.clientWidth;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    sizeCanvas();
}

function resize() {
  resizeInner();
  for (const program of programs) {
    gl.useProgram(program);
    gl.uniform2f(program.resolution, canvas.width, canvas.height);
  }
}

window.addEventListener("resize", resize);
init();
