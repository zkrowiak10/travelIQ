import { ItemController} from "../tripBuilder/itemController/itemController.js";



export class TripsController extends ItemController {
    constructor(){
        super()
        this.endPoint = "/ajax/trips"
        this.containerId = '#tabContent'
        this.title = "Create Trips"
        
        this.insertNode = '#tabContent'
        this.template = "trips-template.html"
        this.workdir = "/static/modules/trips"
        this.fields = [
            { type: "text", key: "name", pretty: "Name of Trip" }, //go back to fix date issue
            { type: "date", key: "start_date", pretty: "Departure Date" },
            { type: "date", key: "end_date", pretty: "Return Date" },
        
        ]
        
    }
}

