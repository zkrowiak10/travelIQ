

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


