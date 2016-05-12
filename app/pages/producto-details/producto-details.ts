import {Page, NavController, NavParams} from 'ionic-angular';
import {PrestashopService} from '../../providers/prestashop-service/prestashop-service';
import {InAppBrowser} from 'ionic-native';

@Page({
  templateUrl: 'build/pages/producto-details/producto-details.html'
})
export class ProductoDetailsPage {
    producto:any;
    ps:PrestashopService;
  constructor(public nav: NavController, params:NavParams, ps:PrestashopService) {
     this.ps = ps;
     this.producto = params.get("producto");
     this.ps.getStockByProduct(this.producto.id).then((data)=>{this.producto.quantity = data.quantity; console.log(data)});
     this.imgShow = this.producto.id_default_image;
  }


  toCurrency(number:string){
      return  Number.parseFloat(number);
  }

  openProductoInWeb(){
      InAppBrowser.open(this.ps.urlProduct.replace("ProductID", this.producto.id), "_system", "location=yes");
  }

}
