
import {api} from "../../utils/api.js"
import {Modal} from "../modal/modal.js"

// constructor function for a Hotel object

var workdir =  "/static/modules/tripBuilder/hotels"
export function Hotel () {
    
    var that = this
    
    this.update = async function() {
        var data = JSON.stringify(that)
        var response = await api.patch(hotelsEndpoint, data)
        // will need to process potential erros down the road
        if (response.status != 200) {
            alert('something went wrong')
        }

    },

    //creates new destination on server and returns json of created resource
    // with id attribute
    this.save = async function() {
        var data = JSON.stringify(this)
        console.log(data)
        var response = await api.post(hotelsEndpoint, data)
        that.id = response.id
        return response
    }

    this.delete = async function() {
        var body = JSON.stringify(that)
        var response = await api.delete(hotelsEndpoint, body)
        if (response.status != 200) {
            throw Error("Resource not deleted")
        }
        hotelsController.deleteItem(that.id)
    }
}

// collection handler for current hotels
function HotelsController(){
    var that = this
    
    var dataModel = {
        hotelsList: []
    }
    
    var fields = [
        {type: "text", key: "name", pretty: "Name"},
        {type: "text", key: "link", pretty: "Link"},
        {type: "date", key: "check_in", pretty: "Check In Date"},
        {type: "date", key: "check_out", pretty: "Check Out Date"},
        {type: "checkbox", key: "refundable", pretty: "Refundable Reservation?"},
        {type: "date", key: "cancellation_date", pretty: "Last Day to Cancel"},
        {type: "checkbox", key: "breakfast_included", pretty: "Breakfast Included?"},
        

    ]
    var title = "Create Hotel"
    this.containerId ='#hotels'
    this.html
    this.dataModel = new zk.ObservableObject(dataModel)
    this.init = async function() {
        
        var template = await fetch(`${workdir}/hotels-template.html`, { headers: {"Content-Type" : "text/html"}})
        var text = await template.text()
        document.querySelector("#tabContent").innerHTML = text
        this.html = document.querySelector(this.containerId)
        zk.initiateModel(this, this.html)
        this.get()
    }
    this.get =  async function() {

            //get data through fetch
            var data = await api.get(hotelsEndpoint, "GET")
            
            this.reset()
            for (let hotel of data) {
                Hotel.apply(hotel)
                this.dataModel.hotelsList.push(hotel)
            }
        }
    this.reset = function() {
        // Remove current destinations from list
        while (this.dataModel.hotelsList.length > 0) {
            this.dataModel.hotelsList.pop()
        }
    }
    this.createHotel = function() {
        
        var modal = new Modal(that, fields,title)
        modal.render()
    }
    this.editItem = function(destination) {
        var modal = new Modal(that, fields, title, destination,true)
        modal.render()
    }
    this.appendItem =  async function(dest) {
        Hotel.apply(dest)
        try {
            var response = await dest.save()
            if (!response.ok) {
                throw Error('something went wrong when saving object', response.statusText)
            }
        }
        catch (err) {
            console.log(err.message)
        };
        that.dataModel.hotelsList.push(dest)
    }
    this.deleteItem = async function(id) {
        let index = dataModel.hotelsList.findIndex(x => x.id == id)
        dataModel.hotelsList.shift(index,1)
    }
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