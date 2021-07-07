import { api } from './modules/utils/api.js'
import { destinationsController } from './modules/tripBuilder/destinations/destinations.js';
import { hotelsController } from './modules/tripBuilder/hotels/hotels.js';
import { FlightsController} from './modules/tripBuilder/flights/flights.js'
import { RentalsController } from './modules/tripBuilder/rentals/rentals.js';
import * as utils from './modules/utils/utilFunctions.js'
    
$().ready(()=>{
    zk.root_model.utils = utils
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
    var controller
    switch(hashValue){
        case ("#destinations"):
             destinationsController.init()
             break
        case ('#hotels'):
            hotelsController.init()
            break
        case ('#flights'):
            controller = new FlightsController()
            controller.init()
            break
        case ('#rentals'):
            controller = new RentalsController()
            controller.init()
     }
}














