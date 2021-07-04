import { api } from './modules/utils/api.js.js'
// console.log('fetching', tabContentEndpoint)

    
$().ready(()=>{
    model = new viewModel()
    ko.applyBindings(model);
    
})
function viewModel() {
    let self = this

    self.destinations =  destinations


    self.hotels = new hotels()

    self.flights= new flights()


    self.rentals = new rentals()
        

}














