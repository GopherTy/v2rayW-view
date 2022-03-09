export interface Params {
    ID?: number
    Name?: string
    Protocol?: string
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

    // socks 协议
    User?: string
    Passwd?: string

    // 此字段用于区分是配置文件修改，还是输入框修改
    Custom?: boolean
    // 全部配置
    ConfigFile?: string

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
    ID?: number
    Name?: string
    URL?: string
}