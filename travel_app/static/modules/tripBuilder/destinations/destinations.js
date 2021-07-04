import {api} from "../../utils/api.js"

// constructor function for a Destination object
export function Destination (dest) {
    let self = this;
    for (key in dest) {
        self[key] = ko.observable(dest[key])
    }

    self.modal = function(self) {
        model.destinations.modal.render(self)
    }
    self.update = async function() {
        data = ko.toJSON(self)
        response = await api.patch(destinationsEndpoint, data)
        // will need to process potential erros down the road
        if (response.status != 200) {
            alert('something went wrong')
        }

    },

    //creates new destination on server and returns json of created resource
    // with id attribute
    self.save = async function() {
        data = ko.toJSON(self)
        // try {
        response = await api.post(destinationsEndpoint, data)
        console.log(response)
        self.id = response.id
        return response
    }

    self.delete = async function() {
        body = ko.toJSON(self)
        console.log('delete request body', body)
        response = await api.delete(destinationsEndpoint, body)
        if (response.status != 200) {
            throw Error("Resource not deleted")
        }
    }
}

export function DestinationsController()
    let self = this,
    self.destList = ko.observableArray([])

    modal : {
        name : ko.observable(""),
        notes: ko.observable(""),
        trip_order: ko.observable(0),
        days_there: ko.observable(0),
        render: function(dest) {
            console.log('rendering modal', this.name())
            this.name(dest.name())
            this.notes(dest.notes())
            this.trip_order(dest.trip_order())
            this.days_there(dest.days_there())
            this.dest = dest
            console.log('at end of modal', this.name())
        },
        clear: function() {
            modal = this.destinations.modal
            modal.name("")
            modal.notes("")
            modal.trip_order("")
            modal.days_there("")
        },
        save: function() {
            modal = this.destinations.modal
            console.log("in save", modal.dest)
            modal.dest.name(modal.name())
            modal.dest.notes(modal.notes())
            modal.dest.days_there(modal.days_there())
            modal.dest.trip_order(modal.trip_order())
            modal.dest.update()
            
            $(closeModalId).click()
        },
        create: async function() {
            modal = this.destinations.modal
            destList = this.destinations.destList
            dest = new destination({name: modal.name(), notes: modal.notes(), trip_order: modal.trip_order(), 
                days_there: modal.days_there()})
            dest.save().then(()=>{
                    destList.push(dest)
                    $("#destCreate-modal-close").click()
                }).catch((e) =>{
                    alert('something went wrong')
                    console.log(e)
                    $("#destCreate-modal-close").click()
                })
        },

        delete: async function() {
            modal = this.destinations.modal
            destList = this.destinations.destList
            modal.dest.delete().then(()=>{
                console.log("promise succeeded")
                destList.pop(model.dest)
                $(closeModalId).click()
            }, (e) => {
                console.log(e)
                alert("something went wrong. Item not deleted")
                $(closeModalId).click()
            })
        }
    },

    get :  async function() {

            //get data through fetch
            data = await api.get(destinationsEndpoint, "GET")
            
            
            //call tab control to show this tab
            tabControl('#destinations')

            console.log(destinations.destList().length)
            while (destinations.destList().length > 0) {
                self.destList.pop()
                
            }
            for (dest of data) {
                destinations.destList.push(new destination(dest))
            }

            }


}
