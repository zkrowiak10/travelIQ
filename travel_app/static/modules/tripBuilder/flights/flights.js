import { ItemController} from "../itemController/itemController.js";

export class FlightsController extends ItemController {
    constructor(){
        super()
        this.endPoint = flightsEndpoint
        this.containerId = '#flights'
        this.title = "Create Flight"
        
      
        this.template = "flights-template.html"
        this.workdir = "/static/modules/tripBuilder/flights"
        this.fields = [
            { type: "date", key: "departure_time", pretty: "Departure Time" }, //go back to fix date issue
            { type: "date", key: "eta", pretty: "Arrival Time" },
            { type: "text", key: "destination", pretty: "Destination" },
            { type: "text", key: "departing_from", pretty: "Origin" }
        ]
        
    }
}

