import {Page, NavController} from 'ionic-angular';
import {PrestashopService} from '../../providers/prestashop-service/prestashop-service';

@Page({
  templateUrl: 'build/pages/carrito/carrito.html',
})
export class CarritoPage {
    nav:NavController;
    ps:PrestashopService;
  constructor(nav: NavController, ps:PrestashopService) {
      this.ps = ps;
      this.nav = nav;

  }
  total (){
      let total = 0;
      for (let i=0; i< this.ps.carrito.length ; i++){
          total += this.ps.carrito[i].price * this.ps.carrito[i].quantity;
      }
      return total;
  }

}
