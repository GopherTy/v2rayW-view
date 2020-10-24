export interface Params {
    ID?: number
    Name?: string
    Protocol?: string
    UID?: number
    Address?: string
    Port?: number
    UserID?: string
    AlertID?: number
    Flow?: string
    Encryption?: string
    Level?: number
    Security?: string
    Network?: string
    NetSecurity?: string
    Domains?: string
    Path?: string
    Direct?: boolean
}

// socks 参数
export interface SocksParam {
    Port?: number
    Address?: string
    Protocol?: string
}

// 订阅参数
export interface SubscribeParam {
    UID?: number
    URL?: string
}