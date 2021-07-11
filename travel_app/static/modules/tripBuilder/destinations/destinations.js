import { ItemController, Item} from "../itemController/itemController.js";
import * as utils from '../../utils/utilFunctions.js'
class Destination extends Item {
    static fields = [
        { type: "text", key: "name", pretty: "Name" },
        { type: "number", key: "days_there", pretty: "Days There" },
        { type: "textarea", key: "notes", pretty: "Notes" }
    ]
    
    constructor(trip_id){
        super()
        this.trip_id = trip_id
        this.fields = Destination.fields
        this.endPoint = `/ajax/trip/${TravelIQGlobal.trip}/destination`
    }
}
export class DestinationsController extends ItemController {
    constructor(){
        super()
        this.endPoint = "/ajax/trip/" + TravelIQGlobal.trip + "/destinations"
        this.containerId = '#destinations'
        this.title = "Destinations"
        this.template = "destinations-template.html"
        this.workdir = "/static/modules/tripBuilder/destinations"
        this.insertNode = "#left-sidebar"
        this.fields = Destination.fields
        this.itemClass= Destination
        
    }
}

export function route(hashArray) {
    if (hashArray.length ==0 ) {location.hash = location.hash + '/destinations'}
    var destinationController = new DestinationsController()
    destinationController.init()
    

}




