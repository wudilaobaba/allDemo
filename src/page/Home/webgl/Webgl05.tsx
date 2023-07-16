import React, { useRef, useEffect, useState } from "react";
import { initShader } from "@/page/Home/webgl/utils/initShader";

/**
 * 利用缓冲区绘制多个点
 */
export const Webgl05 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [program, setProgram] = useState<WebGLProgram>(null);
  const [gl, setGl] = useState<WebGLRenderingContext>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>(null);
  const initCanvas = () => {
    setCanvas(canvasRef.current);
    setGl(canvasRef.current?.getContext("webgl"));
    const VERTEX_SHADER_SOURCE = `
      attribute vec4 aPosition;
      void main() {
        gl_Position = aPosition;
        gl_PointSize = 10.0;
      }
    `;

    const FRAGMENT_SHADER_SOURCE = `
      precision mediump float;
      uniform vec4 uColor;
      void main() {
        gl_FragColor = uColor;
      }
    `;

    const { program } = initShader(
      canvasRef.current?.getContext("webgl"),
      VERTEX_SHADER_SOURCE,
      FRAGMENT_SHADER_SOURCE
    );
    setProgram(program as any);
  };
  const draw = () => {
    let timer: any = 0;
    if (timer) clearInterval(timer);
    const aPosition = gl?.getAttribLocation(program, "aPosition");
    const uColor = gl?.getUniformLocation(program, "uColor");
    /** 绘制三件套 1.片源颜色 2.点的信息 3.执行绘制 */
    // gl?.uniform4f(uColor, 1.0, 1.0, 1.0, 1.0);
    // gl?.vertexAttrib4f(aPosition, 0.0, 0.0, 0.0, 1.0);
    // gl?.drawArrays(gl?.POINTS, 0, 1);

    gl?.uniform4f(uColor, 1.0, 1.0, 1.0, 1.0);
    // 用缓冲区保存大量的顶点数据 以下是三个顶点数据(使用类型化数组保存)
    const points = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5]);
    // 内存区域(用来存储顶点数据)
    const buffer = gl?.createBuffer();
    // 将顶点数据绑定到webgl的缓存中
    gl?.bindBuffer(gl?.ARRAY_BUFFER, buffer);
    // 将顶点数据写入到webgl的缓存中
    gl?.bufferData(gl?.ARRAY_BUFFER, points, gl?.STATIC_DRAW);
    // 绘制保存的的点
    gl?.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    // 激活aPosition
    gl?.enableVertexAttribArray(aPosition);
    // 执行绘制 从哪一个顶点开始绘制，绘制几个点
    gl?.drawArrays(gl?.POINTS, 0, 3);
  };

  useEffect(() => {
    initCanvas();
  }, []);
  return (
    <div>
      <button onClick={draw}>START</button>
      <canvas
        style={{ background: "gray" }}
        ref={canvasRef}
        width={500}
        height={500}
      >
        不支持canvas
      </canvas>
    </div>
  );
};
