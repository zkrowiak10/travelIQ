

$().ready(()=>{
    ko.applyBindings(new viewModel());
    
})


function viewModel() {

    destinations= {

        get: function() {
            //get data through fetch

            //hide remove all other children to the info-window 
             tabs = $('.contentArea')
             for (tab of tabs) {
                 $(tab).hide()
             }
             $('#destinations').show()

            //show destinations window (with creation form)

            //populate data
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

    

}


