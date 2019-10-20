

$().ready(()=>{
    model = new viewModel()
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

    self.destinations = new destinations()


    hotels= {

        get: function() {
            //get data through fetch

            //hide remove all other children to the info-window 
            tabControl("#hotels")

            //show destinations window (with creation form)

            //populate data
        }
    }

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
        // }
        // catch (e) {
        //     console.log(e)
        // }
        // if (!response.id) {
        //     throw "error creating destination"
        // }
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


function destinations() {
    let self = this;
    self.destList = ko.observableArray([]);

    self.modal = {
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
            }
            )
        }

 
    }


    
    self.get =  async function() {

            //get data through fetch
            data = await api.get(destinationsEndpoint, "GET")
            
            
            //call tab control to show this tab
            tabControl('#destinations')

            console.log(self.destList().length)
            while (self.destList().length > 0) {
                self.destList.pop()
                
            }
            for (dest of data) {
                self.destList.push(new destination(dest))
            }
            



            
            



                        

            
            },
        post = function() {

            //need to fill this out
            fetch(destinationsEndpoint, {
                method:'POST',
                headers: {
                    "Content-type": 'application/json',
                },
                body: JSON.stringify({
                    name: "testDest"
                })
            })
        }

}