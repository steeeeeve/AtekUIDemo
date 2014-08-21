Template.AlertDescription.helpers({
	AlertDevices: function() {
		return Devices.find({_id : Session.get('selectedDeviceId'),status : {$in :['1','2']}});
	}
})