import * as DestinationsController from "./modules/tripBuilder/destinations/destinations";
import { header } from "./modules/header/header";
import * as utils from "./modules/utils/utilFunctions";
import { Trip, TripsController } from "./modules/trips/trips";
import { zk } from "./lib/zk";
import "./styles.css";
import { ItemController } from "./modules/tripBuilder/itemController/itemController";

header.init();
// @ts-ignore
zk.root_model.utils = utils;
function wipe() {
  // document.querySelector("#left-sidebar").innerHTML=""
  document.querySelector("#tabContent").innerHTML = "";

  document.querySelector("#hotelDetailView").innerHTML = "";
}
window.onload = () => {
  hashSwitcher.switch(location.hash);
};

window.addEventListener("hashchange", function () {
  wipe();

  hashSwitcher.switch(location.hash);
});

export class HashSwitcher {
  controller: ItemController;
  trip: Trip;

  switch(hashValue) {
    header.get();
    var hashvalueArray = hashValue.split("/");
    // all urls derive from /app/
    switch (hashvalueArray.shift()) {
      case "":
        break;
      case "#trips":
        var element = document.querySelector("#noTrips");
        if (element instanceof HTMLElement) {
          element.hidden = true;
        }
        element = document.querySelector("#selectTrip");
        if (element instanceof HTMLElement) {
          element.hidden = true;
        }
        document.querySelector("#left-sidebar").innerHTML = "";
        let tripController = new TripsController();
        tripController.init();
        break;
      case "#trip":
        utils.g.trip.id = hashvalueArray.shift();
        utils.g.trip.isDefined = true;
        header.updateTripName();
        DestinationsController.route(hashvalueArray);
    }
  }
}

export var hashSwitcher = new HashSwitcher();
