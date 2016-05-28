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
