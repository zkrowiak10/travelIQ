

import { api } from './utils/api.js'
import * as DestinationsController from './tripBuilder/destinations/destinations.js';
// import { * } from './modules/tripBuilder/hotels/hotels.js';
import { FlightsController} from './tripBuilder/flights/flights.js'
import { RentalsController } from './tripBuilder/rentals/rentals.js';
import {header} from './header/header.js'
import * as utils from './utils/utilFunctions.js'
import {TripsController} from './trips/trips.js'



header.init()
zk.root_model.utils = utils
function wipe(){
    // document.querySelector("#left-sidebar").innerHTML=""
    document.querySelector("#tabContent").innerHTML=""

    document.querySelector("#hotelDetailView").innerHTML=""

}
$().ready(()=>{
    
    
    
    
    hashSwitcher.switch(location.hash) 
})

window.addEventListener("hashchange", function(){
    wipe()
   
    hashSwitcher.switch(location.hash)

})


export class HashSwitcher {
    constructor() {
        this.trip;
        this.controller;

        this.switch = function (hashValue) {
            header.get()
            var hashvalueArray = hashValue.split('/');
            // all urls derive from /app/
            switch (hashvalueArray.shift()) {
                case (''):
                    break;
                case ('#trips'):
                    document.querySelector('#noTrips').hidden = true
                    document.querySelector('#selectTrip').hidden = true
                    document.querySelector("#left-sidebar").innerHTML = "";
                    let tripController = new TripsController();
                    tripController.init();
                    break;
                case ('#trip'):
                    utils.g.trip.id = hashvalueArray.shift();
                    utils.g.trip.isDefined = true;
                    header.updateTripName();
                    DestinationsController.route(hashvalueArray);

            }
        };
    }
}


export var hashSwitcher = new HashSwitcher()


console.log(header)












