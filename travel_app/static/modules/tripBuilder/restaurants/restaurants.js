let restaurants= {

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