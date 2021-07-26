import { ItemController, Item } from "../itemController/itemController.js";
import * as hotels from "../hotels/hotels.js";
import * as utils from '../../utils/utilFunctions.js';
import * as restaurants from "../restaurants/restaurant.js";
import { api } from "../../utils/api.js";
export class Destination extends Item {
    constructor() {
        super();
        this.fields = [
            { type: "text", key: "name", pretty: "Name" },
            { type: "number", key: "days_there", pretty: "Days There" },
            { type: "textarea", key: "notes", pretty: "Notes" },
            { type: "number", key: "trip_order", pretty: "Order in Trip" },
        ];
        this.focused = false;
        this.trip_id = utils.g.trip.id;
        this.endPoint = `/ajax/trip/${this.trip_id}/destination`;
    }
    toggleFocus(item) {
        item.focused = !item.focused;
    }
    get links() {
        var linkPaths = `#trip/${utils.g.trip.id}/destination/${this.id}`;
        var links = {
            hotels: `${linkPaths}/hotels`,
            restaurants: `${linkPaths}/restaurants`,
            activities: `${linkPaths}/activities`
        };
        return links;
    }
    async save() {
        var data = JSON.stringify(this);
        // try {
        var response = await api.post(this.endPoint, data);
        this.id = response.id;
        return response;
    }
}
export class DestinationsController extends ItemController {
    constructor() {
        super();
        this.fields = [
            { type: "text", key: "name", pretty: "Name" },
            { type: "number", key: "days_there", pretty: "Days There" },
            { type: "textarea", key: "notes", pretty: "Notes" },
            { type: "number", key: "trip_order", pretty: "Order in Trip" }
        ];
        this.endPoint = "/ajax/trip/" + utils.g.trip.id + "/destinations";
        this.containerId = '#destinations';
        this.title = "Destinations";
        this.template = "destinations-template.html";
        this.workdir = "/static/modules/tripBuilder/destinations";
        this.insertNode = "#left-sidebar";
        this.itemClass = Destination;
    }
    findDestinationByID(destID) {
        return this.itemList.find(dest => dest.id == destID);
    }
}
// receives /destinations or /destination/<id>/etc...
export async function route(hashArray) {
    let next = hashArray.shift();
    if (!next) {
        location.hash = location.hash + '/destinations';
        return;
    }
    var destinationsController = new DestinationsController();
    await destinationsController.init();
    if ((next == "destinations")) {
        return 200;
    }
    if (next == "destination") {
        next = hashArray.shift();
    }
    else {
        console.log(next);
    }
    let destination = destinationsController.findDestinationByID(next);
    if (!destination) {
        console.log('no destination at current hash');
    }
    destination.focused = true;
    next = hashArray.shift();
    if (!next) {
        return 200;
    }
    switch (next) {
        case "hotels":
        case "hotel":
            hotels.route(hashArray, destination);
            break;
        case "restaurants":
        case "restaurant":
            restaurants.route(hashArray, destination);
            break;
    }
}
