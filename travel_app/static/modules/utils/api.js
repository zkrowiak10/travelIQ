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
    post: function(endpoint, body) {
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