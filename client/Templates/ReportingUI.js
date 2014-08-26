Template.ReportingUI.helpers({
	Customers : function() {
		return Customers.find().fetch();
	},
	reportOptions : function(){
		var list = [
			{name : 'Customer List'},
			{name : 'Locations List'},
			{name : 'Tank Reading List (%Full, Full)'},
			{name : 'History List (%Full, Full)'},
			{name : 'History List (Temp, Batt.)'},
			{name : 'History Chart'}
		];
		return list;
	},
	locationsOptions : function() {
		return Sites.find();
	},
	assetOptions : function() {
		var list = [
			{name : '5W-30'},
			{name : '5W-20'},
			{name : 'Waste Oil'},
			{name : 'ATF Fluid'}
		];
		return list;
	}
});

Template.ReportingUI.events({
	'click #showReport' : function(e) {
		e.preventDefault();
		var reportOptions = $('#reportOption').val();
		if(reportOptions == 'Customer List')
		{
			$('#customerTableData').removeClass('hide');
		}
	},
	'click #downloadReport' : function(event) {
		//ExcellentExport.csv($('#customerTableData'),'')
		/*
		var reportOptions = $('#reportOption').val();
		var json;
		if(reportOptions == 'Locations List')
			json = Sites.find().fetch();
		if(reportOptions == 'Customer List')
			json = Customers.find().fetch();
		var csv = JSON2CSV(json);
    	window.open("data:text/csv;charset=utf-8," + escape(csv))
    	*/
	}
})

Template.ReportingUI.rendered = function() {
	$('#datepicker').datepicker();
}


function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    var str = '';
    var line = '';

    if ($("#labels").is(':checked')) {
        var head = array[0];
        if ($("#quote").is(':checked')) {
            for (var index in array[0]) {
                var value = index + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[0]) {
                line += index + ',';
            }
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }

    for (var i = 0; i < array.length; i++) {
        var line = '';

        if ($("#quote").is(':checked')) {
            for (var index in array[i]) {
                var value = array[i][index] + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[i]) {
                line += array[i][index] + ',';
            }
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    return str;
    
}
    
$("#download").click(function() {
    var json = $.parseJSON($("#json").val());
    var csv = JSON2CSV(json);
    window.open("data:text/csv;charset=utf-8," + escape(csv))
});