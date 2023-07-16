export const initShader = (
  gl: WebGLRenderingContext,
  VERTEX_SHADER_SOURCE: string,
  FRAGMENT_SHADER_SOURCE: string
) => {
  // 创建顶点着色器
  const vertexShader = gl?.createShader(gl.VERTEX_SHADER);
  // 创建片源着色器
  const fragmentShader = gl?.createShader(gl.FRAGMENT_SHADER);

  // 关联
  gl?.shaderSource(vertexShader, VERTEX_SHADER_SOURCE); //指定顶点着色器源码
  gl?.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCE); //指定片源着色器源码

  // 编译
  gl?.compileShader(vertexShader);
  gl?.compileShader(fragmentShader);

  // 创建一个程序对象
  const program = gl?.createProgram();
  gl?.attachShader(program, vertexShader);
  gl?.attachShader(program, fragmentShader);

  gl?.linkProgram(program);

  gl?.useProgram(program);

  return { program };
};
