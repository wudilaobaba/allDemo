import React, { useRef, useEffect, useState } from "react";
import { initShader } from "@/page/Home/webgl/utils/initShader";

export const Webgl03 = () => {
  const points: { x: number; y: number }[] = [];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [program, setProgram] = useState<WebGLProgram>(null);
  const [gl, setGl] = useState<WebGLRenderingContext>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>(null);
  const initCanvas = () => {
    setCanvas(canvasRef.current);
    setGl(canvasRef.current?.getContext("webgl"));
    // 顶点着色器
    // gl_Position: x y z w齐次坐标 （x/w, y/w, z/w）
    const VERTEX_SHADER_SOURCE = `
      attribute vec4 aPosition;
      void main() {
        gl_Position = aPosition;
        gl_PointSize = 10.0;
      }
    `;
    // 片源着色器
    // vec4(0.0, 1.0, 0.0 , 1.0) : gl_FragColor 点的颜色
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

  /** 每一次绘制，必须执行以下三个关键步骤！！！！！ */
  const start = () => {
    const aPosition = gl?.getAttribLocation(program, "aPosition");
    const uColor = gl?.getUniformLocation(program, "uColor");
    /** 绘制三件套 */
    // 01.设置点的颜色
    gl?.uniform4f(uColor, 1.0, 1.0, 1.0, 1.0);
    // 02.设置点的位置
    gl?.vertexAttrib4f(aPosition, 0.0, 0.0, 0.0, 1.0);
    // 03.执行绘制 - 每次坐标变化都要重新绘制
    gl?.drawArrays(gl?.POINTS, 0, 1);
  };

  useEffect(() => {
    initCanvas();
  }, []);
  return (
    <div>
      <button onClick={start}>START</button>
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
