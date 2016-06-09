import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
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
    configurations:any;
    categories:any;
    shopname:String;
    user:any;
    carrito:Array<any>= [];
    addresses:any;
    selectedAddress:number= null;
    constructor(public http: Http) {
        this.storage.get('selectedAddress').then(data => { this.selectedAddress = Number.parseInt(data) });

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
        var filter= "?display=[name,value]";
        return new Promise(resolve => {
            this.http.get(this.url + "configurations" + filter + this.append)
            .map(res => res.json())
            .subscribe(data => {
                if(data.configurations.length>0)
                {
                    this.configurations = data.configurations;
                    this.shopname = this.getConfig('PS_SHOP_NAME');
                }
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

    getcountries(filter:string = '?filter[active]=1&display=full'){
        return new Promise(resolve => {
            this.http.get(this.url + "countries" + filter + this.append)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data.countries);
            }, error => {console.log(error)});
        });
    }

    getStates(filter?:string){
        return new Promise(resolve => {
            this.http.get(this.url + "states" + filter + this.append)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data.states);
            }, error => {console.log(error)});
        });
    }

    postAddress(xml){
        return new Promise(resolve => {
            this.http.post(this.url + "addresses" + this.append,xml)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, error => {console.log(error)});
        });
    }

    postCart(xml){
        return new Promise(resolve => {
            this.http.post(this.url + "carts" + this.append,xml)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data.cart);
            }, error => {console.log(error)});
        });
    }

    postOrder(xml){
        return new Promise(resolve => {
            this.http.post(this.url + "orders" + this.append,xml)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data.order);
            }, error => {console.log(error)});
        });
    }

    postOrderHistory(xml){
        return new Promise(resolve => {
            this.http.post(this.url + "order_histories" + this.append,xml)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, error => {console.log(error)});
        });
    }

    putAddress(xml){
        return new Promise(resolve => {
            this.http.post(this.url + "addresses?ps_method=PUT" + this.append,xml)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
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


    getConfig(valor){
        return this.configurations.filter(function(a){ return a.name == valor })[0].value;
    }

    encryptPassword(text){
        return md5(this._COOKIE_KEY_+text);
    }
}
