const set = new Set()
onConnect = (event)=>{
  console.log(event,'event')
  const port = event.ports[0]
  set.add(port)
  // 接收信息
  port.onmessage = (e)=>{
    set.forEach((p)=>{
      p.postMessage(e.data)
    })
  }
  // 发送信息
  // port.postMessage('大家好')
  port.start();
}