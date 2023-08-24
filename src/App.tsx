import React, {useEffect} from "react";
// import {Home} from "@/page/Home";
import { Three3D } from "@/page//Three3D";
import { Study } from "@/page/Study";
import "./app.css";

const App = () => {
    useEffect(()=>{
        const arr = [1, "-2", false];
        const a = arr.reduce<number | string | boolean>((p: number | string | boolean, c: number | string | boolean, i: number, arr: (number | string | boolean)[]) => {
            // 1.p就是对当前数组的操作做一个汇总
            // 2.reduce的泛型就是汇总结果的范型，也就是p的类型
            // 3.返回值类型是当前汇总值的类型
            // 4.汇总的初始值必须是汇总值的类型（即reduce的第二个参数）！！！
            // 5.该函数的返回值就是汇总值p!!!!! 每return一次，p都会有变化！！！！！！
            // 6.reduce最终的返回值就是5中的返回值
            // console.log("当前数组值:", c)
            // console.log("===>",p);
            // (p as number )+ (c as number)
            return "999";
        }, "----->")
        console.log(a)
    },[])
  return (
    <div>
      <Three3D />
      {/*<Study />*/}
    </div>
  );
};
export default App;
