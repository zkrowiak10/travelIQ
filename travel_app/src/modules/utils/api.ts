export {api} 

var api = {
    get: async function(endpoint) {
            var response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json"
                }
                })
            var data = await response.json()
            return data

            
       
    },
    post: async function(endpoint, body) {

            var response = await fetch (endpoint, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                "body":  body 
            })
            if (!response.ok) {
                throw new Error("Something went wrong: " + response.status + response.statusText)
            }
            var json = await response.json()        
            return json
    },
    patch: async function(endpoint, body) {
        
            var response = await fetch (endpoint, {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json"
                },
                "body":  body 
    
                })
            return response
        
        
    },
    delete: async function(endpoint, body) {

            var response = await fetch(endpoint, {
                method: "DELETE",
                headers: {
                    "Content-Type" : "application/json"
                },
                "body":  body 
    
                })
            return response
            

        
        
    }

        

    
}