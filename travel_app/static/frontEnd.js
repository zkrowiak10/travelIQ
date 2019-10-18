

$().ready(()=>{
    ko.applyBindings(new viewModel());
    
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



function viewModel() {

    destinations= {

        get: async function() {

            data = await api.get(destinationsEndpoint, "GET")
            console.log(data)
            //get data through fetch
            // fetch (destinationsEndpoint, {
            //     method: "GET",
            //     headers: {
            //         "Content-Type" : "application/json"
            //     }

            // }).then((res)=>{
            //         res.json()
            //         .then((data)=>{
            //         //hide remove all other children to the info-window 
            //         tabs = $('.contentArea')
            //         for (tab of tabs) {
            //             $(tab).hide()
            //         }


            //         //show destinations window (with creation form)
            //         $('#destinations').show()


            //         //populate data
                    
            //         console.log(data)

            //         //client tests

                        
                        
            //         })
            //     })

            
            },
        post: function() {

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
    

    hotels= {

        get: function() {
            //get data through fetch

            //hide remove all other children to the info-window 
             tabs = $('.contentArea')
             for (tab of tabs) {
                 $(tab).hide()
             }
             $('#hotels').show()

            //show destinations window (with creation form)

            //populate data
        }
    }

    flights= {

        get: function() {
            //get data through fetch

            //hide remove all other children to the info-window 
             tabs = $('.contentArea')
             for (tab of tabs) {
                 $(tab).hide()
             }
             $('#flights').show()

            //show destinations window (with creation form)

            //populate data
        }
    }
    rentals= {

        get: function() {
            //get data through fetch

            //hide remove all other children to the info-window 
             tabs = $('.contentArea')
             for (tab of tabs) {
                 $(tab).hide()
             }
             $('#rentals').show()

            //show destinations window (with creation form)

            //populate data
        }
    }

    restaurants= {

        get: function() {
            //get data through fetch

            //hide remove all other children to the info-window 
             tabs = $('.contentArea')
             for (tab of tabs) {
                 $(tab).hide()
             }
             $('#restaurants').show()

            //show destinations window (with creation form)

            //populate data
        }
    }
    

}


