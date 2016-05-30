import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {PrestashopService}  from './providers/prestashop-service/prestashop-service';
@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {tabbarPlacement: 'top'}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [PrestashopService],
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
Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
