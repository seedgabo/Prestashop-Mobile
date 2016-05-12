import {Page} from 'ionic-angular';
import {PrestashopService} from '../../providers/prestashop-service/prestashop-service';
import {InAppBrowser,LaunchNavigator,Contacts} from 'ionic-native';

@Page({
    templateUrl: 'build/pages/page3/page3.html'
})
export class Page3 {
    ps:PrestashopService;
    stores:any;
    constructor(ps:PrestashopService) {
        this.ps = ps;
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
        contact.save((contact) => {console.log("creado " + JSON.stringify(contact))},(error: Error) => {});

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

}
