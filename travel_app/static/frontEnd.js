
// console.log('fetching', tabContentEndpoint)
GetModules()
.then((modules)=>{
    console.log(modules)
    rentalData= [
        {
            "pickup": "Honolulu",
            "drop_off": "Baisy-Thy",
            "company": "Amet Foundation",
            "pickup_day": "17-04-19",
            "dropoff_day": "09-25-20"
        },
        {
            "pickup": "Goes",
            "drop_off": "Eisleben",
            "company": "Mauris Blandit Incorporated",
            "pickup_day": "10-06-19",
            "dropoff_day": "10-18-19"
        },
        {
            "pickup": "Roubaix",
            "drop_off": "Hofstade",
            "company": "Risus Quisque Libero Industries",
            "pickup_day": "29-04-20",
            "dropoff_day": "08-14-19"
        },
        {
            "pickup": "Pictou",
            "drop_off": "Bayonne",
            "company": "Sagittis Duis Gravida Incorporated",
            "pickup_day": "31-05-19",
            "dropoff_day": "07-08-20"
        },
        {
            "pickup": "Buggenhout",
            "drop_off": "Brucargo",
            "company": "Duis Cursus Diam Institute",
            "pickup_day": "05-05-20",
            "dropoff_day": "10-06-19"
        },]
$().ready(()=>{
    model = new viewModel()
    ko.applyBindings(model);
    model.destinations.get()
})

function logging(...args) {
    console.log(...args)
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
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
        
    }
    $(showTab).show()
}



function viewModel() {
    let self = this

    self.destinations =  destinations


    self.hotels = new hotels()

    self.flights= new flights()


    self.rentals = new rentals()
        
        

    


    restaurants= {

        id : "restaurants",
        title: "A Beautiful Restaurant",
        description: "Plan out your meals!",
        Fields: [{pretty: "rt" }],
        get: function() {
            //get data through fetch

            //hide remove all other children to the info-window 
            tabControl("#restaurants")

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

function rentals(){

    this.title = "Car Rentals"
    this.description ="Reserve your car rentals!"
    this.Fields = [
        {
            key:"pickup",
            pretty: "Pickup Location",
            type: "text"
        },
        {
            key: "drop_off",
            pretty: "Drop Off Location",
            type: "text"
        },
        {
            key: "company",
            pretty: "Rental Company",
            type: "text"
        },
        {
            key: "pickup_day",
            pretty: "Pick Up day",
            type: "date"
        },
        {
            key: 'dropoff_day',
            pretty: "Dropoff Day",
            type:"date"
        }
    
        ],
    this.data = ko.observableArray()
    this.construct = function(obj) {
        for (key in obj){
            this[key] = ko.observable(obj[key])
        }
    }

    this.modal = new modal(this, this.Fields, "Edit Rentals", "","")
    
    logging('in rentals constructor. Modal: ', this.modal)
    this.get= function() {
        model.rentals.data([])
        //api later
        for (let item of rentalData) {
            
            model.rentals.data.push(new construct(item))
        }
        tabControl("#rentals")
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


function hotels(){
    self = this
    this.list = ko.observableArray([]),
    
    this.fields = ['name', 'link', 'check_in', 'check_out', 
        'refundable', 'cancellation_date', 
        'destination_id', 'breakfast_included'],
    this.modal = new modal(self, self.fields, "#hotel-modal-close","#create-hotel-modal-close"),
  
    this.get =  async function() {

            //get data through fetch
            data = await api.get(hotelsEndpoint, "GET")
            
            console.log('in hotels get. data: ', data)
            //call tab control to show this tab
            tabControl('#hotels')

            
            while (self.list().length > 0) {
                self.list.pop()
                
            }
            for (obj of data) {
                console.log(obj)
                self.list.push(new self.construct(obj))
            }

            }
    this.construct = function(obj) {
        for (key in obj) {
            this[key] = ko.observable(obj[key])
        }
    
        this.modal = function(self) {
            self.modal.render(self)
        }
        this.update = async function() {
            data = ko.toJSON(this)
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

function flights(){
    self = this
    this.list = ko.observableArray([]),
    
    this.fields = ['departure_time', 'eta', 'destination', 'departing_from']
    this.modal = new modal(self, self.fields, "#flight-modal-close","#create-flight-modal-close"),
  
    this.get =  async function() {

            //get data through fetch
            data = await api.get(flightsEndpoint, "GET")
            
            
            //call tab control to show this tab
            tabControl('#flights')

            
            while (self.list().length > 0) {
                self.list.pop()
                
            }
            for (obj of data) {
                console.log(obj)
                self.list.push(new self.construct(obj))
            }

            }
    this.construct = function(obj) {
        for (key in obj) {
            this[key] = ko.observable(obj[key])
        }
    
        this.modal = function(self) {
            self.modal.render(self)
        }
        this.update = async function() {
            data = ko.toJSON(this)
            response = await api.patch(flightsEndpoint, data)
            // will need to process potential erros down the road
            if (response.status != 200) {
                alert('something went wrong')
            }
        
        },
    
        //creates new destination on server and returns json of created resource
        // with id attribute
        this.save = async function() {
            data = ko.toJSON(self)
            // try {
            response = await api.post(flightsEndpoint, data)
            console.log(response)
            self.id = response.id
            return response
        }
    
        this.delete = async function() {
            body = ko.toJSON(self)
            console.log('delete request body', body)
            response = await api.delete(flightsEndpoint, body)
            if (response.status != 200) {
                throw Error("Resource not deleted")
            }
        }
    }


}
function modal(parent, fields, title, closeModalId, closeModalCreateId) {
        let self = this
        this.Fields = fields
        
        this.parent = parent
        this.title= title
        self.visible = ko.observable()
        
        for (Field of this.Fields) {
            key = Field.key
            
            this[key] = ko.observable()
            
        }

        this.render = function(obj) {
            logging('testing this:', self)
            for (field of self.Fields) {
                try {
                    key = field.key
                    if (field.type == "date") {
                        date = new Date(obj[key]())
                        date = formatDate(date)
                        self[key](date)
                        logging('date ', date)
                    }
                    self[key](obj[key]())
                    
                }
                catch (e) {
                    logging('render failed for', key, "reason: ", e)
                    continue
                }
            
          
                
            }
            self.show()
            self.obj = obj
        },

      
        this.clear = function() {
           
            for (let i=0; i < self.fields.length; i++) {
                key = self.fields[i]
                self[key](null)
            }
            self.obj = null
        },

        this.showCreate= function(){
            this.clear()
            this.show()
        }

        close = function() {
            self.visible(false)
        }

        this.show= function(){
            self.visible(true)
        }

        this.save = function() {
            for (Field of self.Fields) {
                key = Field.key
                self.obj[key](self[key]())
            }
            self.obj.update()
            
            self.close()
        }
        // this.create = async function() {
        //     parent = self.parent
        //     data = {}

        //     console.log('in modal create')
        //     for (let i=0; i < self.fields.length; i++) {
        //         key = self.fields[i]
        //         val = self[key]
        //         console.log('val ' , val)
        //         data[key] = val()
        //     }
        //     console.log("creating hotel with data: ", data)
        //     obj = new parent.construct(data)
        //     obj.save().then(()=>{
        //             parent.list.push(obj)
        //             $(self.closeModalCreateId).click()
        //         }).catch((e) =>{
        //             alert('something went wrong')
        //             console.log(e)
        //             console.log(self.closeModalCreateId)
        //             $(self.closeModalCreateId).click()
        //         })
        // }

        // this.delete = async function() {
            
        //     list = this.parent.list
        //     this.obj.delete().then(()=>{
        //         console.log("promise succeeded")
        //         list.pop(this.obj)
        //         $(closeModalId).click()
        //     }, (e) => {
        //         console.log(e)
        //         alert("something went wrong. Item not deleted")
        //         $(closeModalId).click()
        //     })
        // }
    

}




ko.components.register('tab-content',{
    viewModel: function(params) {
            this.Model = params.value
            
            
    },
    template: modules.tabContentTemplate
})

ko.components.register('modal-simple', {
    viewModel: function(params) {
        for (key in params.value) {
            this[key] = params.value[key]
            this.model = params.value
        }
        



    },

    template: modules.modalTemplate
})

})
