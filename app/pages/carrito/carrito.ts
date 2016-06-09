import {NavController,Alert, Loading} from 'ionic-angular';
import {Component} from '@angular/core';
import {PrestashopService} from '../../providers/prestashop-service/prestashop-service';

@Component({
    templateUrl: 'build/pages/carrito/carrito.html',
})
export class CarritoPage {
    nav:NavController;
    ps:PrestashopService;
    constructor(nav: NavController, ps:PrestashopService) {
        this.ps = ps;
        this.nav = nav;
        console.log(this.ps.carrito);
    }

    total (){
        let total = 0;
        for (let i=0; i< this.ps.carrito.length ; i++){
            total += this.ps.carrito[i].precio * this.ps.carrito[i].pedido;
        }
        return total;
    }

    totalNoImp(){
        let total = 0;
        for (let i=0; i< this.ps.carrito.length ; i++){
            total += this.ps.carrito[i].price * this.ps.carrito[i].pedido;
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

    confirmarPedido(){
        let ConfirmarAlert = Alert.create({
            message:"¿Esta Seguro de que desea procesar el Carrito?",
            title:'Confirmar',
            buttons:
            [
                {
                    text: 'Aun No',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Confirmar',
                    handler: () => {
                        this.procesarCarrito();
                    }
                }
            ]
        });

        this.nav.present(ConfirmarAlert);
    }

    procesarCarrito(){
        let loading = Loading.create({duration: 60000, content: 'Procesando Carrito...',delay:1000});
        this.nav.present(loading);
            this.ps.postCart(this.CrearCarritoXml()).then(data => {
                this.ps.postOrder(this.CrearOrdenXml(data.id)).then(data =>{
                    this.ps.postOrderHistory(this.CrearOrdenEstadoXml(18,data.id)).then(data =>{
                        loading.dismiss();
                        this.CarritoProcesado();
                    });
                });
            });
    }

    CarritoProcesado(){
        this.nav.present(Alert.create({title:"Gracias por su Compra", subTitle: "Orden Procesada Exitosamente", message:"En breves minutos recibirá un correo con los detalles de su compra", buttons: ["Listo! :)"]}));
        this.ps.carrito = [];
        this.ps.storage.setJson('carrito',this.ps.carrito);
    }

    CrearCarritoXml(){
        let xml= '<?xml version="1.0" encoding="UTF-8"?>'+
        '<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">'+
        '<cart>'+
        '<id_address_delivery>'+ this.ps.addresses[this.ps.selectedAddress].id+'</id_address_delivery>'+
        '<id_address_invoice>'+ this.ps.addresses[this.ps.selectedAddress].id+'</id_address_invoice>'+
        '<id_currency>'+ this.ps.getConfig('PS_CURRENCY_DEFAULT')+'</id_currency>'+
        '<id_customer>'+ this.ps.user.id +'</id_customer>'+
        '<id_guest>0</id_guest>'+
        '<id_lang>'+ this.ps.getConfig('PS_LANG_DEFAULT')+'</id_lang>'+
        '<id_shop_group>1</id_shop_group>'+
        '<id_shop>1</id_shop>'+
        '<id_carrier>'+ this.ps.getConfig('PS_CARRIER_DEFAULT')+'</id_carrier>'+
        '<recyclable>0</recyclable>'+
        '<gift>0</gift>'+
        '<associations>'+
        '<cart_rows>'+
        '<cart_row>';
        for (var i=0; i < this.ps.carrito.length; i++){
            xml += '<id_product>'+this.ps.carrito[i].id+'</id_product>'+
            '<id_product_attribute>'+this.ps.carrito[i].id_default_combination+'</id_product_attribute>'+
            '<id_address_delivery>'+this.ps.addresses[this.ps.selectedAddress].id+'</id_address_delivery>'+
            '<quantity>'+this.ps.carrito[i].pedido+'</quantity>';
        };
        xml += '</cart_row>'+
        '</cart_rows>'+
        '</associations>'+
        '</cart>'+
        '</prestashop>';
        return xml;
    }

    CrearOrdenXml(carrito_id){
        let xml = '<?xml version="1.0" encoding="UTF-8"?>'+
                    '<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">'+
                    '<order>'+
                    '<id_address_delivery>'+ this.ps.addresses[this.ps.selectedAddress].id+'</id_address_delivery>'+
                    '<id_address_invoice>'+ this.ps.addresses[this.ps.selectedAddress].id+'</id_address_invoice>'+
                    '<id_cart>'+ carrito_id+'</id_cart>'+
                    '<id_currency>'+ this.ps.getConfig('PS_CURRENCY_DEFAULT')+'</id_currency>'+
                    '<id_lang>'+ this.ps.getConfig('PS_LANG_DEFAULT')+'</id_lang>'+
                    '<id_customer>'+ this.ps.user.id +'</id_customer>'+
                    '<module>cheque</module>'+
                    '<valid>0</valid>'+
                    '<payment>Pedido por Aplicacion Android</payment>'+
                    '<id_carrier>'+ this.ps.getConfig('PS_CARRIER_DEFAULT')+'</id_carrier>'+
                    '<conversion_rate>1</conversion_rate>'+
                    '<current_state>18</current_state>'+
                    '<total_paid>'+ this.total()+ '</total_paid>'+
                    '<total_paid_real>'+ this.total()+ '</total_paid_real>'+
                    '<total_products>'+ this.totalNoImp().toFixed(3)+ '</total_products>'+
                    '<total_products_wt>'+ this.total()+ '</total_products_wt>'+
                    '</order>'+
                    '</prestashop>';
                    return xml
    }

    CrearOrdenEstadoXml(estado_id,order_id){
         let xml= '<prestashop>'+
                    '<order_history>'+
                    '    <id_order_state>'+estado_id+'</id_order_state>'+
                    '    <id_order>'+ order_id+'</id_order>'+
                '    </order_history>'+
                '</prestashop>';
        return xml;
    }

}
