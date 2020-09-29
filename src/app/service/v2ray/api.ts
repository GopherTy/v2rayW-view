// 后端 API 请求路径 
export const Start = '/api/v2ray/start'
export const Stop = '/api/v2ray/stop'
export const Status = '/api/v2ray/status'
export const Logs = '/api/v2ray/logs'
export const Settings = "/api/v2ray/settings"
export const ListSettings = "/api/v2ray/listSettings"

// 获取 websocket 地址
export function getWebSocketAddr(path: string): string {
    const location = document.location
    let addr: string
    if (location.protocol == "https") {
        addr = `wss://${location.hostname}`
        if (location.port == "") {
            addr += ":443"
        } else {
            addr += `:${location.port}`
        }
    } else {
        addr = `ws://${location.hostname}`
        if (location.port == "") {
            addr += ":80"
        } else {
            addr += `:${location.port}`
        }
    }
    return `${addr}${path}`
}