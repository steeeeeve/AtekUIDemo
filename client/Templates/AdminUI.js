Template.AdminUI.helpers({
	Customers : function() {
		return Customers.find();
	},
	Gateways : function() { 
		if(Session.get('AdminShowGateways') == 'open')
		{
			console.log(Session.get('AdminShowGateways'));
			return Gateways.find({customerId : null});
		}
		else
		{
			Session.get('AdminShowGateways');
			return Gateways.find({customerId : {$exists : true}});	
		}
	},
	SiteProvisionDevices : function() {
		return Devices.find({siteId : Session.get('AdminSiteProvisioningSiteFrom')});
	},
	TankProvisionDevices : function() {
		return Devices.find({siteId : Session.get('AdminTankProvisioningSite')});
	},
	TankProvisionChosen : function() {
		return Session.get('AdminTankProvisioningDeviceId') != null
	},
	GatewayProvisionSites : function() {
		return Sites.find({customerId : Session.get('AdminSelectedCustomerId')});
	},
	Sites : function() {
		return Sites.find();
	},
	SelectedCustomer : function() {
		return Session.get('AdminSelectedCustomerName');
	},
	SelectedSite : function() {
		return Session.get('AdminSelectedSiteName');
	}
});

Template.AdminUI.events({
    'click .GatewayRow' : function(e) {
        e.preventDefault();
    	$('#adminGatewayTable').find('tr.info').removeClass('info');
    	$(e.target).closest('tr').addClass('info');
        var rowElementId = $(e.target).closest('tr').data('id');
        Session.set('AdminSelectedGatewayId');
        $('#gatewayInput').val(rowElementId);
    },
    'click .CustomerRow' : function(e) {
        e.preventDefault();
    	$('#adminCustomerTable').find('tr.info').removeClass('info');
    	$(e.target).closest('tr').addClass('info');
        var rowElementName = $(e.target).closest('tr').data('name');
        var rowElementId = $(e.target).closest('tr').data('id');
        Session.set('AdminSelectedCustomerName',rowElementName);
        Session.set('AdminSelectedCustomerId',rowElementId);
    },
   'click .SiteRow' : function(e) {
        e.preventDefault();
    	$('#adminSitesTable').find('tr.info').removeClass('info');
    	$(e.target).closest('tr').addClass('info');
        var rowElementName = $(e.target).closest('tr').data('name');
        var rowElementId = $(e.target).closest('tr').data('id');
        Session.set('AdminSelectedSiteName',rowElementName);
        Session.set('AdminSelectedSiteId',rowElementId);
    },
    'click .SiteProvisioningSiteFromRow' : function(e) {
    	e.preventDefault();
    	$('#adminSitesProvisioningFrom').find('tr.info').removeClass('info');
    	$(e.target).closest('tr').addClass('info');
        var rowElementId = $(e.target).closest('tr').data('id');
        Session.set('AdminSiteProvisioningSiteFrom',rowElementId);
    },
    'click .SiteProvisioningDeviceRow' : function(e) {
    	e.preventDefault();
    	$('#adminSitesProvisioningDevices').find('tr.info').removeClass('info');
    	$(e.target).closest('tr').addClass('info');
        var rowElementId = $(e.target).closest('tr').data('id');
        Session.set('AdminSiteProvisioningDeviceId',rowElementId);
    },
    'click .SiteProvisioningSiteToRow' : function(e) {
    	e.preventDefault();
    	$('#adminSitesProvisioningTo').find('tr.info').removeClass('info');
    	$(e.target).closest('tr').addClass('info');
        var rowElementId = $(e.target).closest('tr').data('id');
        Session.set('AdminSiteProvisioningSiteTo',rowElementId);
    },
    'click .TankProvisioningSiteRow' : function(e) {
    	e.preventDefault();
    	$('#adminTankProvisioningSites').find('tr.info').removeClass('info');
    	$(e.target).closest('tr').addClass('info');
        var rowElementId = $(e.target).closest('tr').data('id');
        Session.set('AdminTankProvisioningSite',rowElementId);
    },
    'click .TankProvisioningDeviceRow' : function(e) {
    	e.preventDefault();
    	$('#adminTankProvisioningDevices').find('tr.info').removeClass('info');
    	$(e.target).closest('tr').addClass('info');
        var rowElementId = $(e.target).closest('tr').data('id');
        Session.set('AdminTankProvisioningDeviceId',rowElementId);
    },

	'click #openGateways' : function(e){
		e.preventDefault();
		Session.set('AdminShowGateways','open');
	},
	'click #allGateways' :function(e) {
		e.preventDefault();
		Session.set('AdminShowGateways','all');
	},
	'click #SubmitGateway' : function(e) {
		e.preventDefault();
		var gatewayReturn = Meteor.call('add_gateway',
			Session.get('AdminSelectedCustomerId'),
			Session.get('AdminSelectedSiteId'),
			Gateways.findOne({devConnectwareId : $('#gatewayInput').val()}),[]);
		alert(gatewayReturn);
	}

})