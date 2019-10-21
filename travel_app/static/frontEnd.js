

$().ready(()=>{
    model = new viewModel()
    // model.destList.subscribe(function() {

    // })
    ko.applyBindings(model);
    model.destinations.get()
})

// flesh this out for more sophistocated methods
api = {
    get: function(endpoint) {
        return new Promise((resolve, reject)=>{
            fetch (endpoint, {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json"
                }
    
                }).then((res)=>{
                        res.json()
                        .then((data)=> {resolve(data)})

            })
        })
    },
    post: function(endpoint, body) {
        return new Promise((resolve, reject)=>{
            fetch (endpoint, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                "body":  body 
    
            }).then((res)=>{        
                res.json()
                .then((data)=> {resolve(data)},(e) => {
                    console.log("in catch of api POST")
                    reject(e)
                })

            })
                  
        })
        
    },
    patch: function(endpoint, body) {
        return new Promise((resolve, reject)=>{
            fetch (endpoint, {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json"
                },
                "body":  body 
    
                }).then((res)=>{
                        resolve(res)
                    })

        })
        
    },
    delete: function(endpoint, body) {

            return fetch(endpoint, {
                method: "DELETE",
                headers: {
                    "Content-Type" : "application/json"
                },
                "body":  body 
    
                })

        
        
    }

        

    
}

function tabControl(showTab) {
    tabs = $('.contentArea')
    for (tab of tabs) {
        $(tab).hide()
        $(showTab).show()
    }
}



function viewModel() {
    let self = this

    self.destinations =  destinations


    self.hotels = hotels

    flights= {

        get: function() {
            //get data through fetch

            //hide remove all other children to the info-window 
            tabControl("#flights")

            //show destinations window (with creation form)

            //populate data
        }
    }
    rentals= {

        get: function() {
            //get data through fetch

            //hide remove all other children to the info-window 
            tabControl("#rentals")

            //show destinations window (with creation form)

            //populate data
        }
    }

    restaurants= {

        get: function() {
            //get data through fetch

            //hide remove all other children to the info-window 
            tabControl("#retaurants")

            //show destinations window (with creation form)

            //populate data
        }
    }
    

}

// constructor function for destinations
function destination (dest) {
    let self = this
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


destinations = {
    self : this,
    destList : ko.observableArray([]),

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
            
            $("#dest-modal-close").click()
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
                $("#dest-modal-close").click()
            }, (e) => {
                console.log(e)
                alert("something went wrong. Item not deleted")
                $("#dest-modal-close").click()
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


hotels = {
    self : this,
    list : ko.observableArray([]),
    
    modal : {
        name : ko.observable(""),
        check_in: ko.observable(""),
        check_out: ko.observable(),
        refundable: ko.observable(),
        cancellation_date: ko.observable(),
        breakfast_included: ko.observable(),

        render: function(obj) {
            console.log('rendering modal', this.name())
            hotels.modal.name(obj.name())
            hotels.modal.check_in(obj.check_in())
            hotels.modal.check_out(obj.check_out())
            hotels.modal.refundable(obj.refundable())
            hotels.modal.cancellation_date(obj.cancellation_date())
            hotels.modal.obj = obj
            console.log('at end of modal', this.name())
        },
        clear: function() {
            hotels.modal.name('')
            hotels.modal.check_in('')
            hotels.modal.check_out('')
            hotels.modal.refundable('')
            hotels.modal.cancellation_date('')
            hotels.modal.breakfast_included('')
        },
        save: function() {
            modal = hotels.modal
            console.log("in save", modal.obj)
            modal.obj.name(modal.name())
            modal.obj.check_in(modal.check_in())
            modal.obj.check_out(modal.check_out())
            modal.obj.refundable(modal.refundable())
            modal.obj.cancellation_date(modal.cancellation_date())
            modal.obj.update()
            
            $("#hotel-modal-close").click()
        },
        create: async function() {
            modal = hotels.modal
            list = hotels.list
            data = {}
            
            for (key in modal.obj) {
                modal.obj[key](modal[key]())
            }
            console.log("creating hotel with data: ", data)
            obj = new hotels.hotel(modal)
            obj.save().then(()=>{
                    list.push(obj)
                    $("#hotelCreate-modal-close").click()
                }).catch((e) =>{
                    alert('something went wrong')
                    console.log(e)
                    $("#hotelCreate-modal-close").click()
                })
        },

        delete: async function() {
            modal = this.destinations.modal
            destList = this.destinations.destList
            modal.dest.delete().then(()=>{
                console.log("promise succeeded")
                destList.pop(model.dest)
                $("#dest-modal-close").click()
            }, (e) => {
                console.log(e)
                alert("something went wrong. Item not deleted")
                $("#dest-modal-close").click()
            })
        }
    },

    get :  async function() {

            //get data through fetch
            data = await api.get(hotelsEndpoint, "GET")
            
            console.log('in hotels get')
            //call tab control to show this tab
            tabControl('#hotels')

            
            while (hotels.list().length > 0) {
                hotels.list.pop()
                
            }
            for (obj of data) {
                hotels.list.push(new hotel(dest))
            }

            },
    hotel: function(obj) {
        let self = this
        for (key in obj) {
            self[key] = ko.observable(obj[key])
        }
    
        self.modal = function(self) {
            model.hotels.modal.render(self)
        }
        self.update = async function() {
            data = ko.toJSON(self)
            response = await api.patch(hotelsEndpoint, data)
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
            response = await api.post(hotelsEndpoint, data)
            console.log(response)
            self.id = response.id
            return response
        }
    
        self.delete = async function() {
            body = ko.toJSON(self)
            console.log('delete request body', body)
            response = await api.delete(hotelsEndpoint, body)
            if (response.status != 200) {
                throw Error("Resource not deleted")
            }
        }
    }


}


