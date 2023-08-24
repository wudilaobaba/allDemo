const initCanvas = ()=>{
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.background= 'gray'
    const gl = canvas.getContext('webgl');
    // 设置画布大小
    gl.viewport(0,0,canvas.width, canvas.height)
    document.body.insertBefore(canvas, document.getElementById("root"));
    const {program} = combineShader(gl)
    createBuffer(gl, program)
    toMin(gl, program)

}

/**
 * 创建顶点着色器
 */
const createVertexShader = (gl: WebGLRenderingContext)=>{
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,`
        attribute vec4 a_Position;
        uniform mat4 u_Mat;
        void main(){
            gl_Position = u_Mat * a_Position;
        }
    `);
    gl.compileShader(vertexShader);
    return {vertexShader}
}

/***
 * 创建片源着色器
 */
const createFragmentShader = (gl: WebGLRenderingContext)=>{
    const fragmentShader =  gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,`
        void main(){
            gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);
        }
    `)
    gl.compileShader(fragmentShader);
    return {fragmentShader}
}
/**
 * 关联 片源着色器 和 顶点着色器
 */
const combineShader = (gl: WebGLRenderingContext)=>{
    const program = gl.createProgram();
    const {vertexShader} = createVertexShader(gl);
    const {fragmentShader} = createFragmentShader(gl)
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    return {program}
}

/**
 * 绘制顶点缓冲区对象
 * @param gl
 */
const createBuffer = (gl: WebGLRenderingContext, program: WebGLProgram)=>{
    const vertexBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 开辟空间后写入顶点数据
    const vertices = new Float32Array([
        0.0, 0.5,
        -0.5,-0.5,
        0.5, -0.5
    ]);
    // gl.STATIC_DRAW表示传近来的顶点数据不会改变
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.clearColor(0.0, 0.0,0.0,0.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

/**
 * 图形缩小
 */
const toMin = (gl: WebGLRenderingContext, program: WebGLProgram)=>{
    const scale = {x: 0.5, y: 0.5, z: 0.5};
    const mat = new Float32Array([
        scale.x, 0.0, 0.0, 0.0,
        0.0, scale.y, 0.0, 0.0,
        0.0, 0.0, scale.z, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ]);
    const u_Mat = gl.getUniformLocation(program,'u_Mat')
    gl.uniformMatrix4fv(u_Mat, false, mat);
    gl.clearColor(0.0, 0.0,0.0,0.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}



export const zhuo01 = () => {
    initCanvas();
};
