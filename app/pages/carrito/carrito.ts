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
            total += this.ps.carrito[i].precio * this.ps.carrito[i].pedido;
        }
        return total;
    }

    addPed(producto){
        producto.pedido ++;
        if(producto.pedido > producto.quantity)
        producto.pedido = producto.quantity;
        if(producto.pedido <= 0)
        producto.pedido = 1;
        this.ps.storage.setJson('carrito',this.ps.carrito);
    }

    susPed(producto){
        producto.pedido --;
        if(producto.pedido > producto.quantity)
        producto.pedido = producto.quantity;
        if(producto.pedido <= 0)
        producto.pedido = 1;
        this.ps.storage.setJson('carrito',this.ps.carrito);
    }

    deleteFromCarrito(index){
        this.ps.carrito.splice(index,1);
        this.ps.storage.setJson('carrito',this.ps.carrito);

    }

    toCurrency(number:string){
        let numero=  Number.parseFloat(number);
        return   numero.format(2, 3, '.', ',') + " $";
    }

}
