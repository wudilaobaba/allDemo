const {homedir} = require('os')
const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')

fs.readFile(path.join(homedir(), 'Desktop/post/0.txt'), 'utf8', (err, text) => {
  const transporter = nodemailer.createTransport({
    service: 'qq',
    secure: true,
    auth: {
      user: '1273803935@qq.com',
      pass: 'flexxwhhgcecjeic'
    }
  })
  const mainOptions = {
    from: '1273803935@qq.com',
    to: '1273803935@qq.com',
    subject: "1234567890",
    text
  }
  transporter.sendMail(mainOptions, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  })
})
