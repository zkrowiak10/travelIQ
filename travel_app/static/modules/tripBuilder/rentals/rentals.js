import { ItemController } from "../itemController/itemController.js";
export class RentalsController extends ItemController {
    constructor() {
        super();
        this.endPoint = "TODO";
        this.containerId = '#rentals';
        this.title = "Create Rentals";
        this.template = "rentals-template.html";
        this.workdir = "/static/modules/tripBuilder/rentals";
        this.fields = [
            {
                key: "pickup",
                pretty: "Pickup Location",
                type: "text",
            },
            {
                key: "dropoff",
                pretty: "Drop Off Location",
                type: "text",
            },
            {
                key: "company",
                pretty: "Rental Company",
                type: "text"
            },
            {
                key: "pickup_day",
                pretty: "Pick Up day",
                type: "date"
            },
            {
                key: 'dropoff_day',
                pretty: "Dropoff Day",
                type: "date"
            }
        ];
    }
}
