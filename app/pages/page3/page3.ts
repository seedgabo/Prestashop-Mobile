import {NavController,Alert} from 'ionic-angular';
import {Component} from '@angular/core';
import {PrestashopService} from '../../providers/prestashop-service/prestashop-service';
import {InAppBrowser,LaunchNavigator,Contacts} from 'ionic-native';
import {UserPage} from '../user-page/user-page';
import {CarritoPage} from '../carrito/carrito';

@Component({
    templateUrl: 'build/pages/page3/page3.html'
})
export class Page3 {
    ps:PrestashopService;
    nav:NavController;
    stores:any;
    constructor(ps:PrestashopService, nav:NavController) {
        this.ps = ps;
        this.nav = nav;
        this.ps.getStores().then((data) => {
            this.stores = data
            window.setTimeout( ()=>{
                for(var i = 0 ; i< this.stores.length; i++){

                    var map = new GMaps({
                        div: '#map' + i,
                        lat: data[0].latitude,
                        lng: data[0].longitude
                    });

                    map.addMarker({
                        lat: data[0].latitude,
                        lng: data[0].longitude,
                        title: data[0].name,
                        icon: "img/map-icon.png",
                    });

                }
            },300);
        })


    }

    addContact(store){
        var contact = Contacts.create({
            displayName: store.name,
            nickname: store.name,
            phoneNumbers: [{type: "work", value:store.phone}],
            emails: [{type: "work", value:store.email}]
        });
        contact.birthday = new Date();
        contact.save((contact) => { this.nav.present(Alert.create({ title:"Contacto Guardado", message: JSON.stringify(contact) , buttons: ["ok"]}))},(error: Error) => {});

    }
    call(number){
        InAppBrowser.open("tel:"+number, "_system", "");
    }
    sms(number){
        InAppBrowser.open("sms:"+number, "_system", "");
    }
    mail(mail){
        InAppBrowser.open("mailto:"+mail, "_system", "");
    }
    map(lat,lon){
        InAppBrowser.open("geo:"+lat+","+lon, "_system", "");
    }
    navigate(lat,lon){
        LaunchNavigator.navigate([lat, lon]);
    }

    navToUser(){
        this.nav.push(UserPage);
    }

    navToCarrito(){
        this.nav.push(CarritoPage);
    }
}
