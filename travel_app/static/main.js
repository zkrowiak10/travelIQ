import { api } from './modules/utils/api.js'
import { destinationsController } from './modules/tripBuilder/destinations/destinations.js';

    
$().ready(()=>{
    destinationsController.init()
    
})
// function viewModel() {
//     let self = this

//     self.destinations =  


//     self.hotels = new hotels()

//     self.flights= new flights()


//     self.rentals = new rentals()
    

// }
window.addEventListener("hashchange", function(){
    
    switch(location.hash){
       case ("#destinations"):
            destinationsController.init()
           
    }

})














