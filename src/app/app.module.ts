import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PublicModule } from './public/public.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { V2rayComponent } from './v2ray/v2ray.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { ProtocolComponent } from './protocol/protocol.component';
import { VmessComponent } from './vmess/vmess.component';
import { VlessComponent } from './vless/vless.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { SubconfigComponent } from './subconfig/subconfig.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { QRCodeModule } from 'angular2-qrcode';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { UnmarshalComponent } from './unmarshal/unmarshal.component';
import { SocksComponent } from './socks/socks.component';
import { ShadowsocksComponent } from './shadowsocks/shadowsocks.component';
import { ConfigfileComponent } from './configfile/configfile.component';


@NgModule({
  declarations: [
    AppComponent,
    V2rayComponent,
    ProtocolComponent,
    VmessComponent,
    VlessComponent,
    SubscribeComponent,
    SubconfigComponent,
    QrcodeComponent,
    UnmarshalComponent,
    SocksComponent,
    ShadowsocksComponent,
    ConfigfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PublicModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDividerModule,
    MatSidenavModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatSlideToggleModule,
    QRCodeModule,
    ClipboardModule,
    ToasterModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
