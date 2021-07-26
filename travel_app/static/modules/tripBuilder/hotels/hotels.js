import { Item, ItemController } from "../itemController/itemController.js";
import { DetailsComponent } from './hotelDetails.js';
// constructor function for a Hotel object
var workdir = "/static/modules/tripBuilder/hotels";
var getEndpoint;
var putEndpoint;
export class Hotel extends Item {
    constructor() {
        super();
        this.fields = [
            { type: "text", key: "name", pretty: "Name" },
            { type: "text", key: "link", pretty: "Link" },
            { type: "date", key: "check_in", pretty: "Check In Date" },
            { type: "date", key: "check_out", pretty: "Check Out Date" },
            { type: "checkbox", key: "refundable", pretty: "Refundable Reservation?" },
            { type: "date", key: "cancellation_date", pretty: "Last Day to Cancel" },
            { type: "number", key: "rate", pretty: "Nightly Rate" },
            { type: "checkbox", key: "breakfast_included", pretty: "Breakfast Included?" },
            { type: "text", key: "address", pretty: "Address" },
            { type: "text", key: "city", pretty: "City" },
            { type: "tel", key: "phone", pretty: "Phone" },
        ];
        this.endPoint = putEndpoint;
    }
}
// collection handler for current hotels
class HotelsController extends ItemController {
    constructor(destination) {
        super();
        this.detailsTargetElement = "#hotelDetailView";
        this.fields = [
            { type: "text", key: "name", pretty: "Name" },
            { type: "text", key: "link", pretty: "Link" },
            { type: "date", key: "check_in", pretty: "Check In Date" },
            { type: "date", key: "check_out", pretty: "Check Out Date" },
            { type: "checkbox", key: "refundable", pretty: "Refundable Reservation?" },
            { type: "date", key: "cancellation_date", pretty: "Last Day to Cancel" },
            { type: "number", key: "rate", pretty: "Nightly Rate" },
            { type: "checkbox", key: "breakfast_included", pretty: "Breakfast Included?" },
            { type: "text", key: "address", pretty: "Address" },
            { type: "text", key: "city", pretty: "City" },
            { type: "tel", key: "phone", pretty: "Phone" },
        ];
        this.title = "Create Hotel";
        this.containerId = '#hotels';
        this.insertNode = "#tabContent";
        this.template = "hotels-template.html";
        this.workdir = workdir;
        this.endPoint = getEndpoint;
        this.itemClass = Hotel;
        this.destination = destination;
    }
    showDetails(hotel) {
        let detailTitle = `Details for ${hotel.name}`;
        let detail = new DetailsComponent(this, this.fields, detailTitle, hotel, this.detailsTargetElement, "hotelDetails-template.html", false);
        detail.render();
    }
}
export function route(hashArray, destination) {
    getEndpoint = `${destination.endPoint}/${destination.id}/hotels`;
    putEndpoint = `${destination.endPoint}/${destination.id}/hotel`;
    let controller = new HotelsController(destination);
    controller.init();
}
