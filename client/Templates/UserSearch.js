function filterColumn ( i ) {
    $('#UserSearchTable').DataTable().column( i ).search(
        $('#col'+i+'_filter').val()
    ).draw();
}

Template.UserSearch.events({
	'keyup click .column_filter' : function()
	{
        filterColumn( $(this).parents('tr').attr('data-column') );
	}
});

Template.UserSearch.helpers({
	Users : function() {
		return Meteor.users.find();
	}
});

Template.UserSearch.rendered = function()
{
	if ($.fn.dataTable.isDataTable($('#UserSearchTable'))) {
		$('#UserSearchTable').DataTable();
	}
	else {
        $('#UserSearchTable').DataTable({
          "pagingType": "simple_numbers",
          "bFilter":false,
          "bLengthChange" : false,
          "bPaginate" : false,
          "sDom": '<"top"flp><"clear">'
        });
    }

}