import {api} from "../../utils/api.js"
export {destinationsController}
// constructor function for a Destination object

var workdir =  "/static/modules/tripBuilder/destinations"
export function Destination () {
    
    
    
    this.update = async function() {
        var data = JSON.stringify(this)
        response = await api.patch(destinationsEndpoint, data)
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
        var body = JSON.stringify(this)
        var response = await api.delete(destinationsEndpoint, body)
        if (response.status != 200) {
            throw Error("Resource not deleted")
        }
    }
}

// collection handler for current destination
function DestinationsController(){
    
    var dataModel = {
        destList: []
    }
    this.dataModel = new zk.ObservableObject(dataModel)
    this.init = async function() {
        
        var template = await fetch(`${workdir}/destinationstemplate.html`, { headers: {"Content-Type" : "text/html"}})
        var text = await template.text()
        document.querySelector("#tabContent").innerHTML = text
        let html = document.querySelector('#destinations')
        zk.initiateModel(this, html)
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
}

var destinationsController = new DestinationsController()

