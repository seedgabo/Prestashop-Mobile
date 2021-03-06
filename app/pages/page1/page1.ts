import {NavController, Content, Modal} from 'ionic-angular';
import {Component,ViewChild} from '@angular/core';
import {PrestashopService} from '../../providers/prestashop-service/prestashop-service';
import {ProductoDetailsPage} from '../producto-details/producto-details';
import {UserPage} from '../user-page/user-page';
import {CarritoPage} from '../carrito/carrito';
import {Toast} from 'ionic-native';

@Component({
    templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 {
    queryTxt:string="";
    buscar:boolean = true;
    ps:PrestashopService;
    @ViewChild(Content) content: Content;
    productos:any;
    nav:NavController;
    page:number=1;
    more:boolean = true;
    features:any;
    nuevos:any;
    constructor(ps:PrestashopService, nav:NavController) {
        this.ps = ps;
        this.nav = nav;
        this.ps.getConfigShop();
        this.getFeatureProducts();
    }

    verProducto(producto){
        this.nav.push(ProductoDetailsPage, {producto: producto});
    }

    getProducts(event){
        if(this.queryTxt == ""){
            this.more = false;
            this.productos = undefined;
            return false;
        }
        if(this.queryTxt.length < 3){
            Toast.showShortBottom("ingrese por lo menos 3 letras").subscribe();
            this.more = false;
            return false;
        }

        this.more= true;
        this.page = 1;

        var query ="?filter[name]=%[" + encodeURI(this.queryTxt) +"]%&display=full&price[precio][use_tax]=1&limit=15";
        this.ps.loadProducts(query).then((data:Array<any>)=>{
            if(data!=undefined &&  data.length <15)
                this.more = false;
            this.productos = data;
        });
    }

    loadMoreProducts(infiniteScroll){
        if(this.queryTxt == ""){
            this.productos = undefined;
            this.more= false;
            return false;
        }
        var query ="?filter[name]=%[" + encodeURI(this.queryTxt) +"]%&display=full&price[precio][use_tax]=1&limit="+(this.page*15)+","+15;
        this.page++;
        this.ps.loadProducts(query).then((data:Array<any>)=>{
            if (data!=undefined && data.length != 0){
                this.productos = this.productos.concat(data);
            }
            if(data!=undefined && data.length < 15){
                this.more= false;
                infiniteScroll.enable(false);
            }

            infiniteScroll.complete();
        });
    }

    toCurrency(number:string){
        let numero=  Number.parseFloat(number);
        return   numero.format(2, 3, '.', ',') + " $";
    }

    toTop() {
        this.content.scrollToTop();
    }

    navToUser(){
        this.nav.push(UserPage);
    }

    navToCarrito(){
        this.nav.push(CarritoPage);
    }

    getFeatureProducts(){
        var query = "?display=full&filter[description]=%[**]%&price[precio][use_tax]=1&limit=15";
        this.ps.loadProducts(query).then((data:Array<any>)=>{
            this.features = data;
        });
    }

}
