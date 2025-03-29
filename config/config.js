/** 服务端口号 */
const port = 3000
/** 服务地址，可以设置自己的ip或域名 */
const baseURL = `http://localhost:${port}`
/** 生产环境地址，改成自己的域名 */
const pubURL =  `http://example.com`

// 导出配置
export {
  port,
  baseURL,
  pubURL
}