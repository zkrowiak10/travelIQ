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