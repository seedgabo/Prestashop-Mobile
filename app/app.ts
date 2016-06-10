import {ionicBootstrap,App, Platform} from 'ionic-angular';
import {Component} from '@angular/core';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {PrestashopService}  from './providers/prestashop-service/prestashop-service';
@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  rootPage: any = TabsPage;
  platform:any;
  nav:any;
  constructor(platform: Platform, ps: PrestashopService) {
    platform.ready().then(() => {
        this.platform = platform;
        StatusBar.styleDefault();
    });
  }

}

ionicBootstrap(MyApp, [PrestashopService], {
  tabbarPlacement: 'top',
  prodMode : false,
  monthNames: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
  monthShortNames: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
});
Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
