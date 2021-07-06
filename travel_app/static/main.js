import { api } from './modules/utils/api.js'
import { destinationsController } from './modules/tripBuilder/destinations/destinations.js';
import { hotelsController } from './modules/tripBuilder/hotels/hotels.js';

    
$().ready(()=>{
    hashSwitcher(location.hash)
    
})
// function viewModel() {
//     let self = this

//     self.destinations =  


//     self.hotels = new hotels()

//     self.flights= new flights()


//     self.rentals = new rentals()
    

// }
window.addEventListener("hashchange", function(){
    
   hashSwitcher(location.hash)

})

function hashSwitcher(hashValue){
    switch(hashValue){
        case ("#destinations"):
             destinationsController.init()
             break
        case ('#hotels'):
            hotelsController.init()
            
     }
}














