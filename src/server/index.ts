// const inquirer = require('inquirer')
// /**
//  * 实现命令行的问题交互
//  */
//
// // 设计问题
// const queList = [
//   // {
//   //   type: 'input', // 问题类型，当前是输入型问题
//   //   name: 'username',// 用来接收当前问题的答案
//   //   message:'请输入用户名'
//   // }
//   {
//     type: 'confirm', // 问题类型，是否型
//     name: 'isLoad',// 用来接收当前问题的答案
//     message: '是否执行下载操作'
//   },
//   {
//     type: 'list', // 问题类型，当前是输入型问题
//     name: 'method',// 用来接收当前问题的答案
//     message: '选择下载方式',
//     choices: ['npm', 'cnpm', 'yarn'],
//     when(preAn){ //参数是上一个问题的答案键值对 , 返回值为true，则执行该询问。
//       return preAn.isLoad
//     }
//   },
//   {
//     type: 'checkbox', // 问题类型，多选
//     name: 'type',// 用来接收当前问题的答案
//     pageSize: 4, // 展示4个选项, 可滚动
//     message: '再次选择下载方式吧',
//     choices: ['npm', 'cnpm', 'yarn', 'webpack', 'webpack-cli','vue','react','angular', 'node','itom','windows'],
//   }
// ]
//
// // 处理问题
// inquirer.prompt(queList).then(answer => console.log(answer))

/** nodeJS也可以使用axios来请求数据啦 */
const axios = require('axios')
axios.get('https://api.github.com/users').then(data=>console.log(data))
