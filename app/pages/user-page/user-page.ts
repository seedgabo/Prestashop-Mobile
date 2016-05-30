import {Page, NavController, Loading,Alert} from 'ionic-angular';
import {PrestashopService} from '../../providers/prestashop-service/prestashop-service';
@Page({
  templateUrl: 'build/pages/user-page/user-page.html',
})
export class UserPage {
    ps:PrestashopService;
    nav: NavController;
  constructor(nav: NavController, ps:PrestashopService) {
      this.ps= ps;
      this.nav = nav;
  }
  login(user,password){
      let loading = Loading.create({content:"Iniciando", duration: "10000"});
      this.nav.present(loading)
      this.ps.login(user, password).then(data =>{
          if(this.ps.user != null){
              this.getAdresssByUser(this.ps.user);
          }
          else
          {
              this.nav.present(Alert.create({title:'Error', message:'Usuario o Contraseña Invalidos',buttons:['Ok']}));
          }
          loading.dismiss();
      })
  }

  getAdresssByUser(user){
      let filtro ="?filter[id_customer]=" + user.id;
      this.ps.getAdresses(filtro).then(data => {
          this.ps.addresses = data;
          console.log(data);
      })
  }

  addressChange(newValue){
      this.ps.selectedAddress = newValue;
      this.ps.storage.set('selectedAddress', newValue);
  }
}
