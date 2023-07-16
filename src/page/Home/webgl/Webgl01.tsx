import React, { useRef } from "react";
import { initShader } from "@/page/Home/webgl/utils/initShader";

export const Webgl01 = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const test = () => {
    const gl = canvas.current.getContext("webgl");
    // 设置canvas的全局颜色
    // gl.clearColor(1.0, 0.0, 0.0, 1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // 着色器
    // 顶点着色器
    // gl_Position: x y z w齐次坐标 （x/w, y/w, z/w）
    const VERTEX_SHADER_SOURCE = `
      attribute vec4 aPosition;
      void main() {
        gl_Position = aPosition;
        gl_PointSize = 30.0;
      }
    `;
    // 片源着色器
    // vec4(0.0, 1.0, 0.0 , 1.0) : gl_FragColor 点的颜色
    const FRAGMENT_SHADER_SOURCE = `
      void main() {
        gl_FragColor = vec4(0.0, 1.0, 0.0 , 1.0);
      }
    `;

    const { program } = initShader(
      gl,
      VERTEX_SHADER_SOURCE,
      FRAGMENT_SHADER_SOURCE
    );
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttrib4f(aPosition, 0.5, 0.5, 0, 1.0);

    let x = 0;
    setInterval(() => {
      if (x >= 1) {
        x = 0;
      }
      x += 0.001;
      gl.vertexAttrib4f(aPosition, x, 0.5, 0, 1.0);
      // 执行绘制 - 每次坐标变化都要重新绘制
      gl.drawArrays(gl.POINTS, 0, 1);
    }, 2);
  };
  return (
    <div>
      <button onClick={test}>点击测试</button>
      <canvas
        style={{ background: "gray" }}
        ref={canvas}
        width={500}
        height={500}
      >
        不支持canvas
      </canvas>
    </div>
  );
};
