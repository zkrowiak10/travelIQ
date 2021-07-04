

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