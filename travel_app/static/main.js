

import { api } from './modules/utils/api.js'
import * as DestinationsController from './modules/tripBuilder/destinations/destinations.js';
import {header} from './modules/header/header.js'
import * as utils from './modules/utils/utilFunctions.js'
import {TripsController} from './modules/trips/trips.js'


// Initialize the header navbar
header.init()

// zk binding library exposes a global root_model object so any element in the application
// can access its functions/properties 
zk.root_model.utils = utils

// clear child views when rerouting 
function wipe(){
    document.querySelector("#tabContent").innerHTML=""
    document.querySelector("#hotelDetailView").innerHTML=""

}
window.onload = ()=>{
    hashSwitcher.switch(location.hash) 
}

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















