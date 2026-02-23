const canvas = document.getElementById('liquid-chrome-canvas');
const gl = canvas.getContext('webgl', { alpha: true });

if (!gl) {
    console.error('WebGL not supported');
} else {
    // 1. Config matching your exact parameters (0.3 / 0.3 / 3.0)
    const config = {
        speed: 0.3,
        amplitude: 0.3,
        frequencyX: 3.0,
        frequencyY: 3.0,
        colors: [
            [0.0, 0.0, 0.0],   // Black
            [1.0, 1.0, 1.0],   // White
            [0.2, 0.2, 0.2],   // Deep Gray
            [1.0, 1.0, 1.0]    // Highlights
        ]
    };

    // 2. Interactive Shader Logic
    const vsSource = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const fsSource = `
        precision highp float;
        uniform float iTime;
        uniform vec2 iResolution;
        uniform vec2 iMouse;
        uniform vec3 c1;
        uniform vec3 c2;
        uniform vec3 c3;
        uniform vec3 c4;

        float noise(vec2 p) {
            return sin(p.x) * sin(p.y);
        }

        const mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
        
        float fbm(vec2 p, float t) {
            float f = 0.0;
            f += 0.5000 * noise(p + t); p = m * p * 2.02;
            f += 0.2500 * noise(p - t); p = m * p * 2.03;
            f += 0.1250 * noise(p + t); p = m * p * 2.01;
            f += 0.0625 * noise(p);
            return f;
        }

        void main() {
            vec2 p = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
            float t = iTime * ${config.speed.toFixed(2)};
            
            vec2 m = (iMouse * 2.0 - 1.0) * 0.2;
            
            vec2 q = vec2(
                fbm(p + vec2(0.0, 0.0) + m, t),
                fbm(p + vec2(5.2, 1.3) - m, t)
            );

            vec2 r = vec2(
                fbm(p + (4.0 * ${config.amplitude.toFixed(2)}) * q + vec2(1.7, 9.2), t * 0.5),
                fbm(p + (4.0 * ${config.amplitude.toFixed(2)}) * q + vec2(8.3, 2.8), t * 0.5)
            );

            float f = fbm(p + (4.0 * ${config.frequencyX.toFixed(2)}) * r, t * 1.2);
            f = pow(f, 3.0) * 5.0; 
            
            vec3 col = mix(c1, c2, clamp(f * f, 0.0, 1.0));
            col = mix(col, c4, clamp(length(q), 0.0, 1.0) * f);
            
            col *= smoothstep(0.0, 0.6, f); 

            gl_FragColor = vec4(col, 1.0);
        }
    `;

    // 3. Mouse Logic for Interactivity
    let mouseX = 0.5, mouseY = 0.5;
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = 1.0 - (e.clientY / window.innerHeight);
    });

    // 4. Setup Shaders
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // 5. Geometry
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    // 6. Uniforms
    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iResLoc = gl.getUniformLocation(program, 'iResolution');
    const iMouseLoc = gl.getUniformLocation(program, 'iMouse');
    const cLocs = [
        gl.getUniformLocation(program, 'c1'),
        gl.getUniformLocation(program, 'c2'),
        gl.getUniformLocation(program, 'c3'),
        gl.getUniformLocation(program, 'c4')
    ];

    function render(time) {
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        if (canvas.width != displayWidth || canvas.height != displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        gl.useProgram(program);
        gl.uniform1f(iTimeLoc, time * 0.001);
        gl.uniform2f(iResLoc, canvas.width, canvas.height);
        gl.uniform2f(iMouseLoc, mouseX, mouseY);
        config.colors.forEach((c, i) => gl.uniform3fv(cLocs[i], c));

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    console.log("LiquidChrome rendering initialized.");
}
