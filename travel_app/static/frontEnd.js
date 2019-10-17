

$().ready(()=>{
    ko.applyBindings(new viewModel());
    
})


function viewModel() {

    destinations= {

        getDestinations: function() {
            alert('gettingDestinations')
        }
    }

    

}


