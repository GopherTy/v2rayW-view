// 后端返回的数据结构
export interface BackEndData {
    code: number
    desc: string
    error: string
    data: data
}

interface data {
    msg: string
    value: any
}