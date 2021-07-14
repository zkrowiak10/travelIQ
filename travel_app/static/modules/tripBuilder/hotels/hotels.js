
import {api} from "../../utils/api.js"
import { Item, ItemController } from "../itemController/itemController.js"
import {Modal} from "../modal/modal.js"
import { Destination } from "../destinations/destinations.js"
// constructor function for a Hotel object

var workdir =  "/static/modules/tripBuilder/hotels"
var getEndpoint
var putEndpoint
export class Hotel extends Item {
    fields = [
        { type: "text", key: "name", pretty: "Name" },
        { type: "text", key: "link", pretty: "Link" },
        { type: "date", key: "check_in", pretty: "Check In Date" },
        { type: "date", key: "check_out", pretty: "Check Out Date" },
        { type: "checkbox", key: "refundable", pretty: "Refundable Reservation?" },
        { type: "date", key: "cancellation_date", pretty: "Last Day to Cancel" },
        { type: "checkbox", key: "breakfast_included", pretty: "Breakfast Included?" },
    ]
    constructor() {
        super()
        this.endPoint = putEndpoint

    }
}

// collection handler for current hotels
class HotelsController extends ItemController{
    
    constructor(destination) {

        let fields = [
            { type: "text", key: "name", pretty: "Name" },
            { type: "text", key: "link", pretty: "Link" },
            { type: "date", key: "check_in", pretty: "Check In Date" },
            { type: "date", key: "check_out", pretty: "Check Out Date" },
            { type: "checkbox", key: "refundable", pretty: "Refundable Reservation?" },
            { type: "date", key: "cancellation_date", pretty: "Last Day to Cancel" },
            { type: "checkbox", key: "breakfast_included", pretty: "Breakfast Included?" },
        ]
        
        console.log(destination)
        
        let title = "Create Hotel"
        let containerId = '#hotels'
        let insertNode = "#tabContent"
        let templateFile = "hotels-template.html"
        
        super(Hotel,getEndpoint,fields,title,containerId,templateFile,workdir, insertNode)
        this.destination = destination
        
  
    }
}

export function route(hashArray, destination) {
    
    getEndpoint = `${destination.endPoint}/${destination.id}/hotels`
    putEndpoint = `${destination.endPoint}/${destination.id}/hotel`
    let controller = new HotelsController(destination)
    controller.init()

}

// function hotels(){
//     self = this
//     this.list = ko.observableArray([]),
    
//     this.
  
//     this.get =  async function() {

//             //get data through fetch
//             data = await api.get(hotelsEndpoint, "GET")
            
//             console.log('in hotels get. data: ', data)
//             //call tab control to show this tab
//             tabControl('#hotels')

            
//             while (self.list().length > 0) {
//                 self.list.pop()
                
//             }
//             for (obj of data) {
//                 console.log(obj)
//                 self.list.push(new self.construct(obj))
//             }

//             }
//     this.construct = function(obj) {
//         for (key in obj) {
//             this[key] = ko.observable(obj[key])
//         }
    
//         this.modal = function(self) {
//             self.modal.render(self)
//         }
//         this.update = async function() {
//             data = ko.toJSON(this)
//             response = await api.patch(hotelsEndpoint, data)
//             // will need to process potential erros down the road
//             if (response.status != 200) {
//                 alert('something went wrong')
//             }
        
//         },
    
//         //creates new destination on server and returns json of created resource
//         // with id attribute
//         self.save = async function() {
//             data = ko.toJSON(self)
//             // try {
//             response = await api.post(hotelsEndpoint, data)
//             console.log(response)
//             self.id = response.id
//             return response
//         }
    
//         self.delete = async function() {
//             body = ko.toJSON(self)
//             console.log('delete request body', body)
//             response = await api.delete(hotelsEndpoint, body)
//             if (response.status != 200) {
//                 throw Error("Resource not deleted")
//             }
//         }
//     }


// }