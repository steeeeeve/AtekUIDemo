Template.DeviceDetail.helpers({
    TankTable : function() {
        return TankData.find({Tank : this._id});
    }

});
Template.DeviceDetail.rendered = function() {
    setTimeout(function() {
        _.each($('table[id*="TankTable : "]'), function(t){
            if( $.fn.dataTable.isDataTable(t)) {
                $(t).DataTable();
            }
            else
            {
                $('#DeviceTable').DataTable({
                  "pagingType": "simple_numbers",
                  "sDom": '<"top"flp><"clear">'
                });
            }

        });  //partial equals
    }, 2000);
};
Template.DeviceDetail.events = {
    'click .TankDetailsDiv' : function(e) {
        e.preventDefault();
        $('#ItemDetailModal').modal('show').css({'width': '800px'});
        var rowElementId = $(e.target).data('id');
        console.log('element seleected'+rowElementId);
        Session.set("selectedTank",rowElementId);
        UI.render(Template.TankReport);
    }
};

