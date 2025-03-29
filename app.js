import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import ending from './ending.js'
import _ from 'lodash'
import { port, baseURL, pubURL } from './config/config.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ipRequestCount = {}
let num = 0

app.use((req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const currentTime = new Date().toLocaleString()

  ipRequestCount[clientIp] = (ipRequestCount[clientIp] || 0) + 1
  num++

  console.log(`\x1b[32m[${currentTime}]\x1b[0m 请求路径 ${req.path}, 请求方法 ${req.method}, 请求IP ${clientIp}, 请求次数 ${ipRequestCount[clientIp]}, 总请求次数 ${num}, 总IP数 ${Object.keys(ipRequestCount).length}`)
  next()
})

app.get('/', (req, res) => {
  const directoryPath = path.join(__dirname, './ending')
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('读取文件夹出错', err)
      return res.status(500).send('无法读取文件夹')
    }
    const randomFile = files[Math.floor(Math.random() * files.length)]
    const filePath = path.join(directoryPath, randomFile)
    res.sendFile(filePath)
  })
})

app.get('/get', (req, res) => {
  const randomEnding = _.sample(ending)
  const data = { ...randomEnding }
  data.image = `${pubURL}/${randomEnding.image}`

  res.send(data)
})


app.get('/ending/:fileName', (req, res) => {
  const fileName = req.params.fileName
  const filePath = path.join(__dirname, './ending', fileName)

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('文件不存在', err)
      return res.status(404).send('文件不存在')
    }
    res.sendFile(filePath)
  })
})

app.listen(port, () => {
  console.log(`服务正在运行 ${baseURL}`)
})
