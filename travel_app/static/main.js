

import { api } from './modules/utils/api.js'
import * as DestinationsController from './modules/tripBuilder/destinations/destinations.js';
// import { * } from './modules/tripBuilder/hotels/hotels.js';
import { FlightsController} from './modules/tripBuilder/flights/flights.js'
import { RentalsController } from './modules/tripBuilder/rentals/rentals.js';
import {Header} from './modules/header/header.js'
import * as utils from './modules/utils/utilFunctions.js'
    
var hashSwitcher = new HashSwitcher()
var header
header = new Header()
header.init()
zk.root_model.utils = utils
$().ready(()=>{
    
    
    
    
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
    wipe()
   
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
                DestinationsController.wipe()
                break
            case ('#trip'):
                utils.g.trip.id = hashvalueArray.shift()
                utils.g.trip.isDefined = true
                header.updateTripName() 
                DestinationsController.route(hashvalueArray)
                
         }
    }
    }

function wipe(){
    // document.querySelector("#left-sidebar").innerHTML=""
    document.querySelector("#tabContent").innerHTML=""

    document.querySelector("#hotelDetailView").innerHTML=""

}














