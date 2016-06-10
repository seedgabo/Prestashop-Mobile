import {NavController, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import {PrestashopService} from '../../providers/prestashop-service/prestashop-service';

@Component({
    templateUrl: 'build/pages/registrar-usuario/registrar-usuario.html',
})

export class RegistrarUsuarioPage {
    nav:NavController;
    viewCtrl:ViewController;
    ps:PrestashopService;
    user:any = {gender: 1};
    constructor(nav: NavController, viewCtrl:ViewController, ps:PrestashopService) {
        this.nav = nav;
        this.viewCtrl = viewCtrl;
        this.ps = ps;
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }

    CrearUsuario(){
        this.ps.postCustomer(this.crearUsuarioXml()).then(data =>{
            console.log(data);
            this.dismiss();
        });
    }

    crearUsuarioXml(){
        let xml ='<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">'+
                        '<customer>'+
                            '<id_lang>'+ this.ps.getConfig('PS_LANG_DEFAULT')+'</id_lang>'+
                            '<passwd>'+ this.user.passwd+'</passwd>'+
                            '<lastname>'+ this.user.lastname+'</lastname>'+
                            '<firstname>'+ this.user.firstname+'</firstname>'+
                            '<email>'+this.user.email+'</email>'+
                            '<active>1</active>'+
                            '<id_gender>'+this.user.gender+'</id_gender>'+
                            '<birthday>'+this.user.birthday+'</birthday>'+
                            '<newsletter>1</newsletter>'+
                            '</customer>'+
                        '</prestashop>';
                        return xml;
    }

    formValid(){
        return ( this.user.email  && (this.user.email.indexOf('@') > -1)) &&
        ( this.user.passwd  && this.user.passwd.length > 6) &&
        ( this.user.firstname  && this.user.firstname.length >= 3) &&
        ( this.user.lastname  && this.user.lastname.length >= 3) &&
        (this.user.birthday) &&
        (this.user.gender);
    }
}
