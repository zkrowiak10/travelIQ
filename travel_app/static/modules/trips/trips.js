import { ItemController, Item, } from "../tripBuilder/itemController/itemController.js";
import { header } from "../header/header.js";
import * as utils from "../utils/utilFunctions.js";
export class Trip extends Item {
    constructor() {
        super();
        this.endPoint = "/ajax/trip";
    }
}
export class TripsController extends ItemController {
    constructor() {
        super();
        this.endPoint = "/ajax/trips";
        this.containerId = "#tabContent";
        this.title = "Create Trips";
        this.itemClass = Trip;
        this.insertNode = "#tabContent";
        this.template = "trips-template.html";
        this.workdir = "/static/modules/trips";
        this.fields = [
            { type: "text", key: "name", pretty: "Name of Trip" },
            { type: "date", key: "start_date", pretty: "Departure Date" },
            { type: "date", key: "end_date", pretty: "Return Date" },
        ];
    }
    async onListChange() {
        await header.get();
        utils.g.trip.isDefined = false;
        utils.g.trip.name = "";
        utils.g.trip.id = undefined;
    }
}
