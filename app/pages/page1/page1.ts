import {Page,NavController} from 'ionic-angular';
import {PrestashopService} from '../../providers/prestashop-service/prestashop-service';
import {ProductoDetailsPage} from '../producto-details/producto-details';

@Page({
    templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 {
    queryTxt:string="";
    ps:PrestashopService;
    productos:any;
    nav:NavController;
    constructor(ps:PrestashopService, nav:NavController) {
        this.ps = ps;
        this.nav = nav;
        this.ps.getConfigShop();
    }

    verProducto(producto){
        this.nav.push(ProductoDetailsPage, {producto: producto});
    }

    getProducts(event){
        if(this.queryTxt == ""){
            this.productos = undefined;
            return false;
        }
        var query ="?filter[name]=%[" + encodeURI(this.queryTxt) +"]%&display=full&price[precio][use_tax]=1&limit=15";
        this.ps.loadProducts(query).then((data)=>{
            this.productos = data;
        });
    }



    toCurrency(number:string){
        return  Number.parseFloat(number);
    }

}
