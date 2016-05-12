import {Page,NavController} from 'ionic-angular';
import {ProductoDetailsPage} from '../producto-details/producto-details';
import {PrestashopService}  from '../../providers/prestashop-service/prestashop-service';

@Page({
    templateUrl: 'build/pages/page2/page2.html',
})
export class Page2 {
    principal:number = 2;
    order = [];
    actual:number = this.principal;
    cat:any;
    ps: PrestashopService;
    nav:NavController;
    productos:any;

    constructor(ps: PrestashopService, nav:NavController) {
        this.ps = ps;
        this.nav = nav;
        this.cat = this.filtrarCategorias(this.actual);
    }

    filtrarCategorias(categoria_id){
        var results =   $.grep(this.ps.categories, function(e){
            return e.id_parent == categoria_id;
        });
        this.actual = categoria_id;
        this.order.push(categoria_id);
        this.getProductsbyCategory(categoria_id);
        console.log(results);
        return results;
    }

    getCagoriabyId(categoria_id){
        var results =   $.grep(this.ps.categories, function(e){
            return e.id == categoria_id;
        });
        return results[0];
    }

    getProductsbyCategory(categoria_id){
        this.ps.loadProducts("?display=full&limit=25&price[precio][use_tax]=1&filter[id_category_default]="+categoria_id).then((data)=> {this.productos = data;});
    }

    toggleMenuCategory(){
        $('.category-item').toggle('fast');
    }

    toCurrency(number:string){
        return  Number.parseFloat(number);
    }


    verProducto(producto){
        this.nav.push(ProductoDetailsPage, {producto: producto});
    }
}
