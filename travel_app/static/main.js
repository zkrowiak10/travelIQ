
import { api } from './modules/utils/api.js'
import * as DestinationsController from './modules/tripBuilder/destinations/destinations.js';
import { hotelsController } from './modules/tripBuilder/hotels/hotels.js';
import { FlightsController} from './modules/tripBuilder/flights/flights.js'
import { RentalsController } from './modules/tripBuilder/rentals/rentals.js';
import {Header} from './modules/header/header.js'
import * as utils from './modules/utils/utilFunctions.js'
    
var hashSwitcher = new HashSwitcher()

$().ready(()=>{
    
    zk.root_model.utils = utils
    var header = new Header()
    header.init()
    hashSwitcher.switch(location.hash)
    
    
    
})
// function viewModel() {
//     let self = this

//     self.destinations =  


//     self.hotels = new hotels()

//     self.flights= new flights()


//     self.rentals = new rentals()
    

// }
window.addEventListener("hashchange", function(){
    
   
    hashSwitcher.switch(location.hash)

})


function HashSwitcher(){
    let that = this
    this.trip
    this.controller

    this.switch = function(hashValue){
        var hashvalueArray = hashValue.split('/')
        // all urls derive from /app/
        
        switch(hashvalueArray.shift()){
            case (''):
                // todo
                break
            case ('#trip'):
                TravelIQGlobal.trip = hashvalueArray.shift()
                DestinationsController.route(hashvalueArray)
         }
    }
    }
   














