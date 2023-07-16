const Koa = require('koa')
const Router = require('@koa/router')
const static1 = require('koa-static');
const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()
const app = new Koa();
// app.use(ctx=>{
//   const {req, res, path} = ctx;
//   console.log(path)
//   // response.end("22222");
//   res.end("203")
//   // ctx.body = 'hello2';
// });


// 实现静态资源管理
app.use(static1('./public'))

const router = new Router();

/**
 * 查
 */
router.get('/a', async ctx => {
  // await prisma.user.add
  const data = await prisma.user.findMany();
  ctx.body = {msg: data}
})

/**
 * 增
 */
router.get('/add', async ctx => {
  // await prisma.user.add
  const user = {
    name: "Mike1",
    email: "1232@qq.com",
    password: "wwwww"
  }
  await prisma.user.create({
    data: user
  })
  ctx.body = {msg: 'add success!'}
})

// 将id为1的文章关联到id为2的user上 ！！！！！！！！！！
router.get('/add-post', async ctx => {
  await prisma.post.update({
    where: {id: 1},
    data: {
      author: {
        connect: {id: 2}
      }
    }
  })
  ctx.body = {msg: 'post success!'}
})

// 查询用户的同时把文章也查询出来
router.get('/get-user', async ctx => {
  const result = await prisma.user.findUnique({
    where: {
      id: 2
    },
    include: {
      post: true
    }
  })
  ctx.body = {msg: result}
})

// 查询用户的同时屏蔽除id和name以外的其他字段
router.get('/get-user-no-email', async ctx => {
  const result = await prisma.user.findMany({
    select :{
      id: true,
      name: true
    }
  })
  ctx.body = {msg: result}
})

// 创建用户的同时创建一片文章
router.get('/create-user-with-post', async ctx => {
  await prisma.user.create({
    data: {
      name: "halipote",
      email: "123@11.com",
      post:{
        create:{
          title: '我随之而来的一片文章',
          content: "asdasdasdasdasd"
        }
      }
    }
  })
  ctx.body = {msg: 'success~~'}
})

// 过滤查询
router.get('/filter', async ctx => {
  const result = await prisma.user.findMany({
    where:{
      name: {
        startsWith: 'K'
      }
    }
  })
  ctx.body = {msg: result}
})

// 分页查询
router.get('/page', async ctx => {
  const result = await prisma.user.findMany({
    skip: 0,// 从skip+1查起
    take: 3, // 查2条
  })
  ctx.body = {msg: result}
})

// 查询id=2的用户下 已发布的文章
router.get('/unPublish', async ctx => {
  const result = await prisma.user.findUnique({
    where:{
      id: 2
    }
  }).post({
    where:{
      published: true
    }
  })
  ctx.body = {msg: result}
})

/**
 * 改
 */
router.get('/update', async ctx => {
  await prisma.user.update({
    where: {
      id: 2,
    },
    data: {
      name: "Kite",
    }
  })
  ctx.body = {msg: 'update success'};
})

router.get('/a/:id', ctx => {
  ctx.body = {msg: ctx.params}
})
router.post('/a', ctx => {
  ctx.body = {msg: 'ok-post'}
})
app
  .use(router.routes())
  .use(router.allowedMethods())

// 静态资源托管： yarn add koa-static

app.listen(2399, () => console.log("服务启动了！！！"));



