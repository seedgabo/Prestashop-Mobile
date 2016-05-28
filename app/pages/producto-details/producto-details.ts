import {Page, NavController, NavParams} from 'ionic-angular';
import {ViewChild} from 'angular2/core';
import {PrestashopService} from '../../providers/prestashop-service/prestashop-service';
import {InAppBrowser} from 'ionic-native';

@Page({
  templateUrl: 'build/pages/producto-details/producto-details.html'
})
export class ProductoDetailsPage {
    @ViewChild('mySlider') slider: Slides;
    producto:any;
    ps:PrestashopService;
  constructor(public nav: NavController, params:NavParams, ps:PrestashopService) {
     this.ps = ps;
     this.producto = params.get("producto");
     this.producto.quantity = 0;
     console.log(this.producto);
     if(this.producto.associations != undefined  && this.producto.associations.stock_availables != undefined){
         for(let i = 0; i< this.producto.associations.stock_availables.length; i++){
             this.ps.getStockByProduct(this.producto.associations.stock_availables[i].id).then((data)=>{this.producto.quantity += parseInt(data.quantity);});
         }
     }
     else{
         this.ps.getStockByProduct(this.producto.id).then((data)=>{this.producto.quantity = data.quantity;});
     }
  }


  toCurrency(number:string){
      return  Number.parseFloat(number);
  }

  openProductoInWeb(){
      InAppBrowser.open(this.ps.urlProduct.replace("ProductID", this.producto.id), "_system", "location=yes");
  }

  goToSlide(index) {
    this.slider.slideTo(index, 500);
  }

}
