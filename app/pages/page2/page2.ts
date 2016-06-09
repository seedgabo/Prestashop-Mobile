import {Page,NavController,Content} from 'ionic-angular';
import {Component,ViewChild} from '@angular/core';
import {ProductoDetailsPage} from '../producto-details/producto-details';
import {PrestashopService}  from '../../providers/prestashop-service/prestashop-service';
import {UserPage} from '../user-page/user-page';
import {CarritoPage} from '../carrito/carrito';

@Component({
    templateUrl: 'build/pages/page2/page2.html',
})
export class Page2 {
    ps: PrestashopService;
    nav:NavController;
    @ViewChild(Content) content: Content;
    productos:any;
    more= true;
    page=1;
    order = [];
    cat:any;
    toggleMenu= false;
    principal:number = 2;
    actual:number = this.principal;

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
        this.more= true;
        this.page =1 ;
        this.ps.loadProducts("?display=full&limit=25&price[precio][use_tax]=1&filter[id_category_default]="+categoria_id).then((data:Array<any>)=> {
            this.productos = data;
            if(data!=undefined && data.length < 25){
                this.more= false;
            }
        });
    }

    loadMoreProducts(infiniteScroll){
        var query ="?display=full&price[precio][use_tax]=1&limit="+(this.page*25)+","+25+ "&filter[id_category_default]="+this.order[this.order.length-1];
        this.page++;
        this.ps.loadProducts(query).then((data:Array<any>)=>{
            if (data!=undefined && data.length != 0 && this.productos!=undefined){
                this.productos = this.productos.concat(data);
            }
            if(data!=undefined && data.length < 25){
                this.more= false;
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

    verProducto(producto){
        this.nav.push(ProductoDetailsPage, {producto: producto});
    }

    navToUser(){
        this.nav.push(UserPage);
    }

    navToCarrito(){
        this.nav.push(CarritoPage);
    }
}
