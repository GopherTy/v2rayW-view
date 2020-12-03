import { Component, OnInit, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MsgService } from '../service/msg/msg.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from 'angular2-toaster';
import { Params } from '../v2ray/param';
import { ProtocolService } from '../service/protocol/protocol.service';

@Component({
  selector: 'app-configfile',
  templateUrl: './configfile.component.html',
  styleUrls: ['./configfile.component.css']
})
export class ConfigfileComponent implements OnInit {
  // 是否禁用按钮
  disable = false
  // 启动配置参数
  params: Params

  // 当前协议的初始化配置文件
  v2rayCnf = ''

  // 控制增加或者修改的开关，默认增加。
  on: boolean

  constructor(
    private protocol: ProtocolService,
    private toaster: ToasterService,
    private dialogRef: MatDialogRef<ConfigfileComponent>,
    private msg: MsgService,
    private jwt: JwtHelperService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    // 获取用户信息
    const userInfo = this.jwt.decodeToken(this.jwt.tokenGetter())
    this.params = {
      UID: userInfo.user_id,
      Custom: true,
    }

    // 修改
    if (this.data.op === 'update') {
      this.params.Protocol = this.data.value.Protocol,
        this.params.UID = this.data.value.UID
      this.params.ID = this.data.value.ID,
        this.params.Name = this.data.value.Name,
        this.v2rayCnf = this.data.value.ConfigFile
      this.on = true
    }

    // 增加
    if (this.data.op === 'add') {
      this.on = false
    }
  }
  // 修改
  update() {
    // 支持配置文件修改。
    // 解析配置文件进行输入框对应的参数做修改
    try {
      const cnf = JSON.parse(this.v2rayCnf)
      const initCnf = JSON.parse(this.v2rayCnf)
      if (typeof cnf === 'number') {
        this.toaster.pop("error", "JSON格式不正确")
        return
      }
      // 除了日志，其他符合本应用的定位的配置允许使用配置文件修改。
      initCnf["api"] = cnf["api"]
      initCnf["dns"] = cnf["dns"]
      initCnf["routing"] = cnf["routing"]
      initCnf["policy"] = cnf["policy"]
      initCnf["transport"] = cnf["transport"]
      initCnf["stats"] = cnf["stats"]
      initCnf["reverse"] = cnf["reverse"]
      initCnf["inbounds"] = cnf["inbounds"]

      const outbound = cnf["outbounds"][0]
      if (!outbound) {
        this.toaster.pop("error", "导入失败", "配置文件不正确")
        return
      }

      const vp = outbound["settings"]["vnext"]
      const sp = outbound["settings"]["servers"]
      if (!vp && !sp) {
        this.toaster.pop("error", "导入失败", "配置文件不正确")
        return
      }

      // vmess，vless 协议参数
      if (vp) {
        this.params.Address = vp[0]["address"]
        this.params.Port = vp[0]["port"]

        const user = vp[0]["users"][0]
        if (user) {
          this.params.UserID = user["id"]
          this.params.AlertID = user["alterId"]
          this.params.Level = user["level"]
          this.params.Security = user["security"]
          this.params.Encryption = user["encryption"]
        }

        const streamSettings = outbound["streamSettings"]
        if (streamSettings) {
          this.params.Network = streamSettings["network"]
          this.params.NetSecurity = streamSettings["security"]

          if (streamSettings["wsSettings"]) {
            this.params.Path = streamSettings["wsSettings"]["path"]
            if (streamSettings["wsSettings"]["headers"]) {
              this.params.Domains = streamSettings["wsSettings"]["headers"]["Host"]
            }
          }

          if (streamSettings["httpSettings"]) {
            this.params.Path = streamSettings["httpSettings"]["path"]
            this.params.Domains = streamSettings["httpSettings"]["host"]
          }
        }
      }
      // socks，ss 协议参数
      if (sp) {
        this.params.Address = sp[0]["address"]
        this.params.Port = sp[0]["port"]

        if (sp[0]["users"]) {
          const user = sp[0]["users"][0]
          if (user) {
            this.params.User = user["user"]
            this.params.Passwd = user["pass"]
          }
        }

        if (sp[0]["method"]) {
          this.params.Security = sp[0]["method"]
        }
        if (sp[0]["password"]) {
          this.params.Passwd = sp[0]["password"]
        }
      }
      initCnf["outbounds"] = cnf["outbounds"]

      this.disable = true
      this.params.ConfigFile = JSON.stringify(initCnf, null, 4)
      this.protocol.update(this.params).then(() => {
        this.msg.updateProtocol(this.params)
        this.toaster.pop("success", "修改成功")
        this.dialogRef.close()
      }).catch(() => {
        this.toaster.pop("error", "修改失败")
      }).finally(() => {
        this.disable = false
      })
    } catch (error) {
      console.log(error)
      this.toaster.pop("error", "JSON格式不正确")
    }
  }

  // 加载
  load() {
    try {
      const cnf = JSON.parse(this.v2rayCnf)
      if (typeof cnf === 'number') {
        this.toaster.pop("error", "JSON格式不正确")
        return
      }

      // 除了日志，其他符合本应用的定位的配置允许使用配置文件修改。
      if (cnf["log"]) {
        cnf["log"] = {
          "access": "",
          "error": "",
          "loglevel": "warning",
        }
      }

      const outbound = cnf["outbounds"][0]
      if (!outbound) {
        this.toaster.pop("error", "导入失败", "配置文件不正确")
        return
      }
      // 设置协议
      this.params.Protocol = outbound["protocol"]

      const vp = outbound["settings"]["vnext"]
      const sp = outbound["settings"]["servers"]
      if (!vp && !sp) {
        this.toaster.pop("error", "导入失败", "配置文件不正确")
        return
      }

      // vmess，vless 协议参数
      if (vp) {
        this.params.Address = vp[0]["address"]
        this.params.Port = vp[0]["port"]

        const user = vp[0]["users"][0]
        if (user) {
          this.params.UserID = user["id"]
          this.params.AlertID = user["alterId"]
          this.params.Level = user["level"]
          this.params.Security = user["security"]
          this.params.Encryption = user["encryption"]
        }

        const streamSettings = outbound["streamSettings"]
        if (streamSettings) {
          this.params.Network = streamSettings["network"]
          this.params.NetSecurity = streamSettings["security"]

          if (streamSettings["wsSettings"]) {
            this.params.Path = streamSettings["wsSettings"]["path"]
            if (streamSettings["wsSettings"]["headers"]) {
              this.params.Domains = streamSettings["wsSettings"]["headers"]["Host"]
            }
          }

          if (streamSettings["httpSettings"]) {
            this.params.Path = streamSettings["httpSettings"]["path"]
            this.params.Domains = streamSettings["httpSettings"]["host"]
          }
        }
      }
      // socks，ss 协议参数
      if (sp) {
        this.params.Address = sp[0]["address"]
        this.params.Port = sp[0]["port"]

        if (sp[0]["users"]) {
          const user = sp[0]["users"][0]
          if (user) {
            this.params.User = user["user"]
            this.params.Passwd = user["pass"]
          }
        }

        if (sp[0]["method"]) {
          this.params.Security = sp[0]["method"]
        }
        if (sp[0]["password"]) {
          this.params.Passwd = sp[0]["password"]
        }
      }

      this.params.ConfigFile = JSON.stringify(cnf, null, 4)
      this.disable = true
      this.protocol.save<any>(this.params).then((value) => {
        // 通知主界面将新增的协议增加到列表里。
        this.params.ID = value.data.id
        this.params.ConfigFile = value.data.cnf
        this.msg.addProtocol(this.params)
        this.toaster.pop("success", "增加成功")
        this.dialogRef.close()
      }).catch(() => {
        this.toaster.pop("error", "增加失败")
      }).finally(() => {
        this.disable = false
      })
    } catch (error) {
      console.log(error)
      this.toaster.pop("error", "导入失败", error)
    }
  }
}
