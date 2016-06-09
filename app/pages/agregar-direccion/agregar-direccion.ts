import {NavController,ViewController ,NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {PrestashopService} from '../../providers/prestashop-service/prestashop-service';

@Component({
    templateUrl: 'build/pages/agregar-direccion/agregar-direccion.html',
})
export class AgregarDireccionPage {
    nav: NavController;
    ps: PrestashopService;
    viewCtrl: ViewController;
    direccion:any= {};
    countries:any;
    states:any;

    constructor(nav: NavController, ps:PrestashopService, viewCtrl: ViewController, params: NavParams) {
        this.ps = ps;
        this.nav = nav;
        this.viewCtrl = viewCtrl;
        let address = params.get('direccion');
        if (address)
            this.direccion = address;

        this.ps.getcountries().then(data => {
            this.countries = data;
            if (this.direccion.id_country)
                this.direccion.id_country = this.countries[0].id;
            this.getStates(this.direccion.id_country);
        });

    }

    getStates(id_country){
        this.states = [];
        let filtro = '?filter[active]=1&filter[id_country]='+ this.direccion.id_country+'&display=full';
        this.ps.getStates(filtro).then( data => {
            this.states = data;
        });
    }

    agregarDireccion(){
        let xml = '<?xml version="1.0" encoding="UTF-8"?>'+
        '<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">'+
            '<address>'+
                '<id_customer>'+this.ps.user.id +'</id_customer>'+
                '<id_country>'+ this.direccion.id_country+'</id_country>'+
                '<id_state>'+ this.direccion.id_state+'</id_state>'+
                '<alias>'+ this.direccion.alias+'</alias>'+
                '<lastname>'+ this.ps.user.lastname+'</lastname>'+
                '<firstname>'+ this.ps.user.firstname+'</firstname>'+
                '<vat_number></vat_number>'+
                '<address1>'+ this.direccion.address1+'</address1>'+
                '<other>'+ this.direccion.other+'</other>'+
                '<phone>'+ this.direccion.phone+'</phone>'+
                '<phone_mobile></phone_mobile>'+
                '<dni></dni>'+
            '</address>'+
        '</prestashop>';
        this.ps.postAddress(xml).then(data =>{
            console.log(data);
            this.dismiss();
        });

    }

    editarDireccion(){
        let xml = '<?xml version="1.0" encoding="UTF-8"?>'+
        '<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">'+
            '<address>'+
                '<id>'+this.direccion.id +'</id>'+
                '<id_customer>'+this.ps.user.id +'</id_customer>'+
                '<id_country>'+ this.direccion.id_country+'</id_country>'+
                '<id_state>'+ this.direccion.id_state+'</id_state>'+
                '<alias>'+ this.direccion.alias+'</alias>'+
                '<lastname>'+ this.ps.user.lastname+'</lastname>'+
                '<firstname>'+ this.ps.user.firstname+'</firstname>'+
                '<vat_number></vat_number>'+
                '<address1>'+ this.direccion.address1+'</address1>'+
                '<city>'+ this.direccion.city+'</city>'+
                '<phone>'+ this.direccion.phone+'</phone>'+
                '<phone_mobile></phone_mobile>'+
                '<dni></dni>'+
            '</address>'+
        '</prestashop>';
        this.ps.putAddress(xml).then(data =>{
            console.log(data);
            this.dismiss();
        });
    }

    direccionRellena(){
        return (this.direccion.alias && this.direccion.alias.length>3) &&
               (this.direccion.city && this.direccion.city.length>3) &&
               (this.direccion.address1 && this.direccion.address1.length>3) &&
               (this.direccion.phone) &&
               (this.direccion.id_country) &&
               (this.direccion.id_state);

    }

    dismiss(){
        this.viewCtrl.dismiss();
    }
}
