import React, { useRef, useEffect, useState } from "react";
import { initShader } from "@/page/Home/webgl/utils/initShader";

export const Webgl02 = () => {
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
      void main() {
        gl_FragColor = vec4(0.0, 1.0, 0.0 , 1.0);
      }
    `;

    const { program } = initShader(
      canvasRef.current?.getContext("webgl"),
      VERTEX_SHADER_SOURCE,
      FRAGMENT_SHADER_SOURCE
    );
    setProgram(program as any);
  };
  const draw = (e: any) => {
    // canvas距离浏览器顶部和左边的距离 - 整数
    const canvasTop = canvas.offsetTop;
    const canvasLeft = canvas.offsetLeft;

    // canvas距离浏览器顶部和左边的距离 - 与上面数据一致（小数）
    // const domPosition = e.target.getBoundingClientRect();
    // const { x, y } = domPosition;
    // console.log({ x, y });

    // 获取鼠标相对于浏览器的位置
    const mouseTop = e.clientY;
    const mouseLeft = e.clientX;
    // console.log(mouseTop, mouseLeft);

    // 以canvas左上角为原点，获取相对于canvas的鼠标坐标
    const myY = mouseTop - canvasTop;
    const myX = mouseLeft - canvasLeft;

    const halfWidth = canvas.offsetWidth / 2;
    const halfHeight = canvas.offsetHeight / 2;
    const canvasX = (myX - halfWidth) / halfWidth;
    const canvasY = (halfHeight - myY) / halfHeight;
    // console.log(canvasX, canvasY);
    points.push({ x: canvasX, y: canvasY });
    const aPosition = gl?.getAttribLocation(program, "aPosition");

    points.forEach((p) => {
      console.log(p.x);
      gl?.vertexAttrib4f(aPosition, p.x, p.y, 0, 1.0);

      // 执行绘制 - 每次坐标变化都要重新绘制
      gl?.drawArrays(gl?.POINTS, 0, 1);
    });
  };

  useEffect(() => {
    initCanvas();
  }, []);
  return (
    <div>
      <canvas
        style={{ background: "gray" }}
        ref={canvasRef}
        width={500}
        height={500}
        onMouseMove={draw}
      >
        不支持canvas
      </canvas>
    </div>
  );
};
