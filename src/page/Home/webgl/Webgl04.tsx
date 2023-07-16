import React, { useRef, useEffect, useState } from "react";
import { initShader } from "@/page/Home/webgl/utils/initShader";

export const Webgl04 = () => {
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

  /** canvas的画图等操作，与react没有半毛钱关系！！！！！！！！！ */

  const points = [{ x: 0, y: 0 }];
  let originSpeed = 0.02;
  let speed = originSpeed;
  let direction = "x";
  let random = {};
  document.onkeydown = (ev) => {
    const code = ev.code;
    switch (code) {
      case "ArrowLeft": // left
        direction = "x";
        speed = -originSpeed;
        break;
      case "ArrowUp": // 上
        direction = "y";
        speed = originSpeed;
        break;
      case "ArrowRight": // right
        direction = "x";
        speed = originSpeed;
        break;
      case "ArrowDown": // 下
        direction = "y";
        speed = -originSpeed;
        break;
    }
  };
  const draw = () => {
    let timer: any = 0;
    if (timer) clearInterval(timer);
    const aPosition = gl?.getAttribLocation(program, "aPosition");
    const uColor = gl?.getUniformLocation(program, "uColor");
    /** 绘制三件套 */
    // 01.设置点的颜色
    gl?.uniform4f(uColor, 1.0, 1.0, 1.0, 1.0);
    timer = setInterval(() => {
      points[0][direction] += speed;
      for (let i = 0; i < points.length; i++) {
        // 02.设置点的位置
        gl?.vertexAttrib4f(aPosition, points[i].x, points[i].y, 0.0, 1.0);
        // 03.执行绘制 - 每次坐标变化都要重新绘制
        gl?.drawArrays(gl?.POINTS, 0, 1);
      }
    }, 1000);
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
