import {Injectable} from 'angular2/core';
import {Http,Headers} from 'angular2/http';
import 'rxjs/add/operator/map';


@Injectable()
export class PrestashopService {
    url: string = "http://www.eycproveedores.com/tienda/api/";
    urlProduct = "http://www.eycproveedores.com/tienda/index.php?id_product=ProductID&controller=product";
    urlCategory = "http://www.eycproveedores.com/tienda/index.php?id_category=CategoryID&controller=category";
    _COOKIE_KEY_ = "ZWitXiW4jqb73Ny0x0zGQi0GaU06aAtpRLqFaL2a8myyXA2stwKyQIF4";
    append: string = "&ws_key=KN2FTYHN3H63DKP82WWRHCDNKQZWE5U1&output_format=JSON";

    categories:any;
    shopname:String;
    user:any;

    constructor(public http: Http) {
        this.getCategories().then((data) => {this.categories = data; });
    }


    loadProducts(filter){
        return new Promise(resolve => {
            this.http.get(this.url + "products/"+ filter + this.append)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data.products);
            });
        });
    }


    getCategories(filtro?:string){
        var  filter = "&display=[name,description,id,id_parent]" ;
        if (filtro){
            filter = filtro + filter;
        }
        return new Promise(resolve => {
            this.http.get(this.url + "categories/" + filter + "&filter[active]=1"+ this.append)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data.categories);
            });
        });
    }


    getStockByProduct(product_id){
        return new Promise(resolve => {
            this.http.get(this.url + "stock_availables/"+ product_id + this.append)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data.stock_available);
            });
        });
    }


    encryptPassword(text){
        return md5(this._COOKIE_KEY_+text);
    }


    getConfigShop(){
        var filter= "&display=full&filter[name]=PS_SHOP_NAME";
        return new Promise(resolve => {
            this.http.get(this.url + "configurations/" + filter + this.append)
            .map(res => res.json())
            .subscribe(data => {
                if(data.configurations.length>0)
                this.shopname = data.configurations[0].value;
                resolve(data);
            });
        });
    }


    getStores(){
        return new Promise(resolve => {
            this.http.get(this.url + "stores/?display=full&filter[active]=1"+ this.append)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data.stores);
            });
        });
    }


    login(user,password){
        var filter="?filter[email]="+user+"&filter[passwd]="+this.encryptPassword(password)+"&display=full";
        return new Promise(resolve => {
            this.http.get(this.url + "customers/"+ filter + this.append)
            .map(res => res.json())
            .subscribe(data => {
                if(data.customers != undefined){
                    this.user = data.customers[0];
                }
                resolve(data);
            });
        });
    }

}
