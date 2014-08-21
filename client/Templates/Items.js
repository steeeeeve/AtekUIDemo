Template.Item.events = {
    'click .ItemRow': function(e) {
        e.preventDefault();
        var rowElementId = $(e.target).closest('tr').data('id');
        Session.set("selectedRowItem",rowElementId);
    }
};
Template.Items.helpers({
    ItemList: function() {
        return Sites.find();
    }
});

Template.Item.customerName = function() {
    return Customers.findOne({_id : this.customerId}).info.name;
}


Template.Item.rendered = function() { 
            console.log($.fn.dataTable.isDataTable($('#ItemTable')));
            if ($.fn.dataTable.isDataTable($('#ItemTable'))) {
            }
            else {
                    var yItemTable2 = $('#ItemTable').DataTable({
                      "sDom": '<"top"fl><"clear">',
                            "JQueryUI": true,
                            "StateSave": true,
                            //"bLengthChange": true
                    })
            }
};
