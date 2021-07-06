import {api} from "../../utils/api.js"
import {Modal} from "../modal/modal.js"
export {destinationsController}
// constructor function for a Destination object

var workdir =  "/static/modules/tripBuilder/destinations"
export function Destination () {
    
    var that = this
    
    this.update = async function() {
        var data = JSON.stringify(that)
        var response = await api.patch(destinationsEndpoint, data)
        // will need to process potential erros down the road
        if (response.status != 200) {
            alert('something went wrong')
        }

    },

    //creates new destination on server and returns json of created resource
    // with id attribute
    this.save = async function() {
        var data = JSON.stringify(this)
        // try {
        var response = await api.post(destinationsEndpoint, data)
        that.id = response.id
        return response
    }

    this.delete = async function() {
        var body = JSON.stringify(that)
        var response = await api.delete(destinationsEndpoint, body)
        if (response.status != 200) {
            throw Error("Resource not deleted")
        }
        destinationsController.deleteItem(that.id)
    }
}

// collection handler for current destination
function DestinationsController(){
    var that = this
    
    var dataModel = {
        destList: []
    }
    var fields = [
        {type: "text", key: "name", pretty: "Name"},
        {type: "number", key: "trip_order", pretty: "Trip Order"},
        {type: "number", key: "days_there", pretty: "Days There"},
        {type: "textarea", key: "notes", pretty: "Notes"}
    ]
    var title = "Create Destination"
    this.containerId ='#destinations'
    this.html
    this.dataModel = new zk.ObservableObject(dataModel)
    this.init = async function() {
        
        var template = await fetch(`${workdir}/destinations-template.html`, { headers: {"Content-Type" : "text/html"}})
        var text = await template.text()
        document.querySelector("#tabContent").innerHTML = text
        this.html = document.querySelector(this.containerId)
        zk.initiateModel(this, this.html)
        this.get()
    }
    this.get =  async function() {

            //get data through fetch
            var data = await api.get(destinationsEndpoint , "GET")
            
            this.reset()
            for (let dest of data) {
                Destination.apply(dest)
                this.dataModel.destList.push(dest)
            }
        }
    this.reset = function() {
        // Remove current destinations from list
        while (this.dataModel.destList.length > 0) {
            this.dataModel.destList.pop()
        }
    }
    this.createDestination = function() {
        
        var modal = new Modal(that, fields,title)
        modal.render()
    }
    this.editItem = function(destination) {
        var modal = new Modal(that, fields, title, destination,true)
        modal.render()
    }
    this.appendItem =  async function(dest) {
        Destination.apply(dest)
        try {
            var response = await dest.save()
            if (!response.ok) {
                throw Error('something went wrong when saving object', response.statusText)
            }
        }
        catch (err) {
            console.log(err.message)
        };
        that.dataModel.destList.push(dest)
    }
    this.deleteItem = async function(id) {
        let index = dataModel.destList.findIndex(x => x.id == id)
        dataModel.destList.shift(index,1)
    }
}

var destinationsController = new DestinationsController()

