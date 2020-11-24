import { Component, OnInit, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MsgService } from '../service/msg/msg.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from 'angular2-toaster';
import { Params } from '../v2ray/param';
import { isNumber } from 'util';
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
  initConfig = ''

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
    }


    // 修改
    if (this.data.op === 'update') {
      this.params.Protocol = this.data.value.Protocol,

        this.params.ID = this.data.value.ID,
        this.params.Name = this.data.value.Name,
        this.params.Address = this.data.value.Address,
        this.params.Port = this.data.value.Port,
        this.params.UserID = this.data.value.UserID,
        this.params.AlertID = this.data.value.AlertID,
        this.params.Encryption = this.data.value.Encryption,
        this.params.User = this.data.value.User,
        this.params.Passwd = this.data.value.Passwd,
        this.params.Level = this.data.value.Level,
        this.params.Security = this.data.value.Security,
        this.params.Network = this.data.value.Network,
        this.params.Domains = this.data.value.Domains,
        this.params.Path = this.data.value.Path,
        this.params.NetSecurity = this.data.value.NetSecurity,
        this.params.Direct = this.data.value.Direct,
        this.params.Custom = true,
        this.initConfig = this.data.value.ConfigFile
      this.params.ConfigFile = this.data.value.ConfigFile
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
      const cnf = JSON.parse(this.params.ConfigFile)
      const initCnf = JSON.parse(this.initConfig)
      if (isNumber(cnf)) {
        this.toaster.pop("error", "JSON格式不正确")
        return
      }
      // 除了日志和入口配置，其他符合本应用的定位的配置允许使用配置文件修改。
      initCnf["api"] = cnf["api"]
      initCnf["dns"] = cnf["dns"]
      initCnf["routing"] = cnf["routing"]
      initCnf["policy"] = cnf["policy"]
      initCnf["transport"] = cnf["transport"]
      initCnf["stats"] = cnf["stats"]
      initCnf["reverse"] = cnf["reverse"]

      const outbound = cnf["outbounds"][0]
      const vp = outbound["settings"]["vnext"]
      const sp = outbound["settings"]["servers"]
      // vmess，vless 协议参数
      if (vp) {
        initCnf["outbounds"][0]["settings"]["vnext"][0] = vp[0]
        initCnf["outbounds"][0]["streamSettings"] = outbound["streamSettings"]

        this.params.Address = vp[0]["address"]
        this.params.Port = vp[0]["port"]

        const user = vp[0]["users"][0]
        this.params.UserID = user["id"]
        this.params.AlertID = user["alterId"]
        this.params.Level = user["level"]
        this.params.Security = user["security"]
        this.params.Encryption = user["encryption"]


        const streamSettings = outbound["streamSettings"]
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
          if (streamSettings["httpSettings"]["host"]) {
            this.params.Domains = streamSettings["httpSettings"]["host"]
          }
        }
      }
      // socks，ss 协议参数
      if (sp) {
        initCnf["outbounds"][0]["settings"]["servers"][0] = sp[0]
        initCnf["outbounds"][0]["streamSettings"] = outbound["streamSettings"]

        this.params.Address = sp[0]["address"]
        this.params.Port = sp[0]["port"]
        if (sp[0]["users"][0]) {
          const user = sp[0]["users"][0]
          this.params.User = user["user"]
          this.params.Passwd = user["pass"]
        }

        if (sp[0]["method"]) {
          this.params.Security = sp[0]["method"]
        }
        if (sp[0]["password"]) {
          this.params.Passwd = sp[0]["password"]
        }
      }

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
      const cnf = JSON.parse(this.params.ConfigFile)
      if (isNumber(cnf)) {
        this.toaster.pop("error", "JSON格式不正确")
        return
      }
      // 除了日志和入口配置，其他符合本应用的定位的配置允许使用配置文件修改。

      const outbound = cnf["outbounds"][0]
      if (outbound["protocol"]) {
        this.params.Protocol = outbound["protocol"]
      }
      const vp = outbound["settings"]["vnext"]
      const sp = outbound["settings"]["servers"]
      // vmess，vless 协议参数
      if (vp) {
        cnf["outbounds"][0]["settings"]["vnext"][0] = vp[0]
        if (outbound["streamSettings"]) {
          cnf["outbounds"][0]["streamSettings"] = outbound["streamSettings"]
        }

        this.params.Address = vp[0]["address"]
        this.params.Port = vp[0]["port"]

        const user = vp[0]["users"][0]
        this.params.UserID = user["id"]
        this.params.AlertID = user["alterId"]
        this.params.Level = user["level"]
        this.params.Security = user["security"]
        this.params.Encryption = user["encryption"]

        if (outbound["streamSettings"]) {
          const streamSettings = outbound["streamSettings"]
          this.params.Network = streamSettings["network"]
          this.params.NetSecurity = streamSettings["security"]

          this.params.Path = streamSettings["wsSettings"]["path"]
          if (streamSettings["wsSettings"]["headers"]) {
            this.params.Domains = streamSettings["wsSettings"]["headers"]["Host"]
          }

          if (streamSettings["httpSettings"]) {
            this.params.Path = streamSettings["httpSettings"]["path"]
            if (streamSettings["httpSettings"]["host"]) {
              this.params.Domains = streamSettings["httpSettings"]["host"]
            }
          }
        }
      }
      // socks，ss 协议参数
      if (sp) {
        cnf["outbounds"][0]["settings"]["servers"][0] = sp[0]
        cnf["outbounds"][0]["streamSettings"] = outbound["streamSettings"]

        this.params.Address = sp[0]["address"]
        this.params.Port = sp[0]["port"]
        if (sp[0]["users"][0]) {
          const user = sp[0]["users"][0]
          this.params.User = user["user"]
          this.params.Passwd = user["pass"]
        }

        if (sp[0]["method"]) {
          this.params.Security = sp[0]["method"]
        }
        if (sp[0]["password"]) {
          this.params.Passwd = sp[0]["password"]
        }
      }

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
