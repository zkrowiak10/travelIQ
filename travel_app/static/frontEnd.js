

$().ready(()=>{
    model = new viewModel()
    ko.applyBindings(model);
    model.destinations.get()
})

// flesh this out for more sophistocated methods
api = {
    get: function(endpoint, method, body) {
        return new Promise((resolve, reject)=>{
            fetch (endpoint, {
                method: method,
                headers: {
                    "Content-Type" : "application/json"
                }
    
                }).then((res)=>{
                        res.json()
                        .then((data)=> {resolve(data)})

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


function destinations() {
    let self = this;
    self.destList = ko.observableArray([]);

    this.get =  async function() {

            //get data through fetch
            data = await api.get(destinationsEndpoint, "GET")
            
            
            //call tab control to show this tab
            tabControl('#destinations')

            console.log(self.destList().length)
            while (self.destList().length > 0) {
                self.destList.pop()
                
            }
            for (dest of data) {
                self.destList.push(dest)
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