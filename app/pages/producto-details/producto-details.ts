import {Page, NavController, NavParams, Toast} from 'ionic-angular';
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
    pedido = 1;
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


  addtoCart(){
      let result = $.grep(this.ps.carrito,(e) =>{ return e.id == this.producto.id; });
      if(result.length > 0)
      {
          this.ps.carrito.splice(this.ps.carrito.indexOf(result),1);
          this.nav.present(Toast.create({message:"Producto Actualizado en el Carrito", showCloseButton: true, closeButtonText:"listo" , duration:3000}));
      }
      else{
          this.nav.present(Toast.create({message:"Producto Agregado Al Carrito", showCloseButton: true, closeButtonText:"listo" , duration:3000}));
      }
      this.producto.pedido = this.pedido;
      this.producto.imagen = this.ps.url + 'images/products/' + this.producto.id + '/' + this.producto.id_default_image +'/small_default' + this.ps.append;
      this.ps.pushCarrito(this.producto);
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

  addPed(){
      this.pedido ++;
       if(this.pedido <= 0)
         this.pedido=1;
      if(this.pedido > this.producto.quantity)
        this.pedido = this.producto.quantity;
  }

  susPed(){
      this.pedido--;
     if(this.pedido <0)
       this.pedido=1;
    if(this.pedido > this.producto.quantity)
      this.pedido = this.producto.quantity;
  }
}
