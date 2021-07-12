import { ItemController, Item} from "../itemController/itemController.js";
import * as hotels from "../hotels/hotels.js";
import * as utils from '../../utils/utilFunctions.js'
export class Destination extends Item {
    fields = [
        { type: "text", key: "name", pretty: "Name" },
        { type: "number", key: "days_there", pretty: "Days There" },
        { type: "textarea", key: "notes", pretty: "Notes" }
    ]
    focused = false
    
    constructor(trip_id){
        super()
        this.trip_id = trip_id
        this.fields = Destination.fields
        this.endPoint = `/ajax/trip/${utils.g.trip.id}/destination`
        var linkPaths = `#trip/${utils.g.trip.id}/destination/${this.id}`

    
        
    }
    toggleFocus(item) {
        item.focused = !item.focused
    }
    get links() {
        var linkPaths = `#trip/${utils.g.trip.id}/destination/${this.id}`
        var links = {
            hotels: `${linkPaths}/hotels`,
            restaurants: `${linkPaths}/restaurants`,
            activities: `${linkPaths}/activities`
        }
        return links
    }
    async save() {
        var data = this.stringify()
        // try {
        var response = await api.post(this.endPoint, data)
        this.id = response.id
        this.makeLinks()
        return response
    }
   
}
export class DestinationsController extends ItemController {
    fields = [
        { type: "text", key: "name", pretty: "Name" },
        { type: "number", key: "days_there", pretty: "Days There" },
        { type: "textarea", key: "notes", pretty: "Notes" }
    ]
    constructor(){
        super()
        this.endPoint = "/ajax/trip/" + utils.g.trip.id  + "/destinations"
        this.containerId = '#destinations'
        this.title = "Destinations"
        this.template = "destinations-template.html"
        this.workdir = "/static/modules/tripBuilder/destinations"
        this.insertNode = "#left-sidebar"
        this.itemClass= Destination
        
    }
    findDestinationByID(destID) {
        return this.itemList.find(dest => dest.id == destID)
    }
}

export function route(hashArray) {
    if (hashArray.length ==0 ) {location.hash = location.hash + '/destinations'}
    var destinationsController = new DestinationsController()
    destinationsController.init()

    let next = hashArray.shift()
    // if (next != "destination") {
    //     console.error("bad hash route at: ", location.hash)
    // }
    let destination = hashArray.shift()
    destination = destinationsController.findDestinationByID(destination)

    // hotels.route(hashArray, destination)

}




