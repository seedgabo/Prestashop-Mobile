import {Injectable} from 'angular2/core';
import {Http,Headers} from 'angular2/http';
import {Storage,SqlStorage} from 'ionic-angular';
import 'rxjs/add/operator/map';


@Injectable()
export class PrestashopService {
    storage = new Storage(SqlStorage);
    url: string = "http://www.eycproveedores.com/tienda/api/";
    urlProduct = "http://www.eycproveedores.com/tienda/index.php?id_product=ProductID&controller=product";
    urlCategory = "http://www.eycproveedores.com/tienda/index.php?id_category=CategoryID&controller=category";
    _COOKIE_KEY_ = "ZWitXiW4jqb73Ny0x0zGQi0GaU06aAtpRLqFaL2a8myyXA2stwKyQIF4";
    append: string = "&ws_key=KN2FTYHN3H63DKP82WWRHCDNKQZWE5U1&output_format=JSON";

    categories:any;
    shopname:String;
    user:any;
    carrito:Array<any>= [];
    addresses:any;
    selectedAddress:number = null;
    constructor(public http: Http) {
        this.storage.get('selectedAddress').then(data => { this.selectedAddress = data });

        this.getCategories().then((data) => {this.categories = data; });

        this.storage.getJson('user').then(data => {
            if (data.email != undefined) {
                this.user = data;
                this.getAdresssByUser(this.user);
            }

        });

        this.storage.getJson('carrito').then(data => { if(data.length>0) this.carrito = data});
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
            }, error => {console.log(error)});
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

    pushCarrito(producto){
        this.carrito.push(producto);
        this.storage.setJson('carrito',this.carrito);
    }

    getConfigShop(){
        var filter= "?display=full&filter[name]=PS_SHOP_NAME";
        return new Promise(resolve => {
            this.http.get(this.url + "configurations" + filter + this.append)
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

    getAdresses(filtro?:string){
        var  filter = "&display=full" ;
        if (filtro){
            filter = filtro + filter;
        }
        return new Promise(resolve => {
            this.http.get(this.url + "addresses" + filter + this.append)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data.addresses);
            }, error => {console.log(error)});
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
                    this.storage.setJson('user', this.user);
                }
                resolve(data);
            });
        });
    }

    getAdresssByUser(user){
        let filtro ="?filter[id_customer]=" + user.id;
        this.getAdresses(filtro).then(data => {
            this.addresses = data;
            if(this.selectedAddress == null || this.selectedAddress > this.addresses.length){
                this.selectedAddress = 0;
                this.storage.set('selectedAddress',0);
            }
        })
    }

    encryptPassword(text){
        return md5(this._COOKIE_KEY_+text);
    }
}
