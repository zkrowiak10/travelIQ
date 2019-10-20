

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
                        .then((data)=> {resolve(data)})

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
    self.save = async function() {
        data = ko.toJSON(self)
        console.log(data)
        response = await api.patch(destinationsEndpoint, data)
        // will need to process potential erros down the road
        if (response.status != 200) {
            alert('something went wrong')
        }

    }
}


function destinations() {
    let self = this;
    self.destList = ko.observableArray([]);

    self.modal = {
        name : ko.observable("test"),
        notes: ko.observable(""),
        render: function(dest) {
            console.log('rendering modal', this.name())
            this.name(dest.name())
            this.notes(dest.notes())
            this.dest = dest
            console.log('at end of modal', this.name())
        },
        save: function() {
            modal = this.destinations.modal
            console.log("in save", modal.dest)
            modal.dest.name(modal.name())
            modal.dest.notes(modal.notes())
            modal.dest.save()
            
            $("#dest-modal-close").click()
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