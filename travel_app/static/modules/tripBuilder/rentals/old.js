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
let rentalData= [
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