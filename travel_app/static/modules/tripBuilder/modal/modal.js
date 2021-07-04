function modal(parent, fields, title, closeModalId, closeModalCreateId) {
    let self = this
    this.Fields = fields
    
    this.parent = parent
    this.title= title
    self.visible = ko.observable()
    
    for (let field of this.Fields) {
        let key = field.key
        
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