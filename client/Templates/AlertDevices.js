Template.AlertDevices.helpers({
	AlertDevices: function() {
		return Devices.find({status : {$in :['1','2']}},{sort : {status : -1}});
	}
})