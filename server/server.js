/*
 * Server
 */
CustomFramework = null;
var security;
/*
 * Defines some initial utility functions.
 *
 * These have been getting cut down, and probably will go away.
 */
Meteor.utilFunctions = {

	getUserSettings : function() {
		var data;
		var settings = {};
		data = Assets.getText("user_settings.json");
		settings = JSON.parse(data);
		return settings;
	},
	getInitialData : function() {
		var data;
		var initialData = {};
		data = Assets.getText("initial_data.json");
		initialData = JSON.parse(data);
		return initialData;
	},
}

/*
 * Defines the Publish Callbacks.
 *
 * These are called whenever a client connects to the Server.
 *
 * The decision of what to publish to the user is done here.
 */
Meteor.publishCallbacks = {

	customers : function() {
		if (this.userId) {
			return Customers.find();
		}
		else {
			return null;
		}
	},
	sites : function() {
		if (this.userId) {
			return Sites.find();
		}
		else {
			return null;
		}
	},
	gateways : function() {
		if (this.userId) {
			return Gateways.find();
		}
		else {
			return null;
		}
	},
	devices : function() {
		if (this.userId) {
			return Devices.find();
		}
		else {
			return null;
		}
	},
	channels : function() {
		if (this.userId) {
			return Channels.find();
		}
		else {
			return null;
		}
	},
}

/*
 * Catch a new User Creation...
 */
Accounts.onCreateUser(function(options, user){
	console.log('creating user:'+user.emails[0].toString());
	return user;
});

/*
 * The initial Meteor Startup function.
 */
Meteor.startup(function() {

  // Initialize security service on first touch. To configure service pass in the following 
  // configuration options:
  // - the application roles
  // - the organization templates
  // - the root admin userId
  var rootUserId;
  var rootUser = Meteor.users.findOne({username:'root'});
  if (rootUser == null) {
    rootUserId = Accounts.createUser({username:'root', email:'root@digi.com', password:'root', profile: {name: 'The root user'}});
  } else {
    rootUserId = rootUser._id;
  }
  var securityConfig = {
    roles: [
      {
        name: 'admin',
        description: 'administer many aspects of the application',
        permissions: ['MANAGE_USERS', 'MANAGE_ORGANIZATIONS', 'MANAGE_APPLICATION', 'MANAGE_DEVICES', 'READ_DEVICE_DATA', 'READ_DEVICE_CONFIG', 'WRITE_DEVICE_CONFIG'],
      },
      {
        name: 'readOnly',
        description: 'generally can only view devices and state',
        permissions: ['READ_DEVICE_DATA', 'READ_DEVICE_CONFIG']
      },
      {
        name: 'operator',
        description: 'readOnly plus a few operator actions',
        extendsRole: 'readOnly',
        permissions: ['MANAGE_ALARMS']
      },
    ],
    orgTemplates: [
      {
        orgType: 'customer',
        orgTypeDescription: 'Top level customer'
      },
      {
        orgType: 'region',
        orgTypeDescription: 'Customers primary regions'
      },
      {
        orgType: 'branch',
        orgTypeDescription: 'Branches within each region'
      },
      {
        orgType: 'site',
        orgTypeDescription: 'Sites within a branch'
      },

    ],
    rootUserId: rootUserId
  }
  security = new SecurityService(securityConfig);



	console.log("Starting Meteor Server...");

	/* Get user settings from the file system */
	var userSettings = Meteor.utilFunctions.getUserSettings();

	/* Ensure they gave good Device Cloud data */
	if (!userSettings.hasOwnProperty('device_cloud')) {
		throw new Error("User Settings must include Device Cloud information!");
	}

	CustomFramework = new Framework(this, userSettings.device_cloud);

	/*
	 * The Framework will call this whenever there is new data
	 */
	CustomFramework.on("collection_update", function(type, schema, data, writeCallback) {
		switch (type) {
		case CustomFramework.CollectionType.GATEWAY:
			writeCallback(schema, data);
			break;
		case CustomFramework.CollectionType.CHANNEL:
			writeCallback(schema, data);
			break;
		}
	});

	/*
	 * The Framework will call this whenever it has new data to archive
	 */
	CustomFramework.on("collection_archive", function(type, schema, data, writeCallback) {
		switch (type) {
		case CustomFramework.CollectionType.GATEWAY:
			delete data['_id'];
			writeCallback(schema, data);
			break;
		case CustomFramework.CollectionType.CHANNEL:
			delete data['_id'];
			writeCallback(schema, data);
			break;
		}
	});


	/*
	 * Tell the Framework which Standard Collections we want.
	 */
	Customers = CustomFramework.add_standard_collection(CustomFramework.CollectionType.CUSTOMER,
						"customers", CustomerSchema,
						Meteor.publishCallbacks.customers);

	Sites = CustomFramework.add_standard_collection(CustomFramework.CollectionType.SITE,
						"sites", SiteSchema,
						Meteor.publishCallbacks.sites);

	Gateways = CustomFramework.add_standard_collection(CustomFramework.CollectionType.GATEWAY,
						"gateways", GatewaySchema,
						Meteor.publishCallbacks.gateways);

	GatewaysHistory = CustomFramework.add_standard_collection(CustomFramework.CollectionType.GATEWAY_HISTORY,
						"gateways_history", null, null);

	Devices = CustomFramework.add_standard_collection(CustomFramework.CollectionType.DEVICE,
						"devices", DeviceSchema,
						Meteor.publishCallbacks.devices);

	Channels = CustomFramework.add_standard_collection(CustomFramework.CollectionType.CHANNEL,
						"channels", ChannelSchema,
						Meteor.publishCallbacks.channels);

	ChannelsHistory = CustomFramework.add_standard_collection(CustomFramework.CollectionType.CHANNEL_HISTORY,
						"channels_history", null, null);

	/*
	 * Start the Framework!
	 */
	CustomFramework.start(function() {

		/* Get initial data from the file system */
		var initialData = Meteor.utilFunctions.getInitialData();

		/* Add any/all users first */
		if (initialData.hasOwnProperty('users')) {
			var len = initialData.users.length;
			for (var i = 0; i < len; i++) {
				var user = initialData.users[i];
				CustomFramework.add_user(user);
			}
		}

		/* Add any Event Factories */
		if (initialData.hasOwnProperty('channelEventFactories')) {
			var len = initialData.channelEventFactories.length;
			for (var i = 0; i < len; i++) {
				var factory = initialData.channelEventFactories[i];
				CustomFramework.events.add_channel_event_factory(factory);
			}
		}

		/ Finally populate the Customers -> Sites -> Gateways -> Devices */
		if (initialData.hasOwnProperty('customers')) {
			var len = initialData.customers.length;
			for (var i = 0; i < len; i++) {
				var customer = initialData.customers[i];
				CustomFramework.add_customer(Meteor.users.findOne(),customer, null, function(customer) {
					/* Done */
				});
			}
		}
	});
});


Meteor.methods({

	createableUserRoles: function(user) {
		return [{name :'Customer Admin'},{name :'Customer'}];
	},
	createSecurityUser: function(user) {
		createUser(user.role, user.username, user.email, user.password);
	}
});


function createUser(role, username, email, password) {
  var subUserId = Accounts.createUser({username: username, email:email, password:password, profile: {name: 'The '+role+' user'}});
  security.assignUser(subUserId, [role], Organizations.findOne()._id, {username:username, email:email});
  return subUserId;
}

function createSubOrgs(parentOrgId, subOrgNames) {
  var rootOrg = security.getRootOrganization();
  for (var i = subOrgNames.length - 1; i >= 0; i--) {
    var newOrg = {
      orgType: 0,
      orgName: subOrgNames[i],
      orgDescription: 'org for '+subOrgNames[i]
    };
    var newOrgId = security.createOrganization(parentOrgId, newOrg);
    console.log(' created sub org for '+subOrgNames[i]+'. id='+newOrgId);
    var fullOrg = Organizations.findOne({_id:newOrgId});
    console.log('newOrg:'+EJSON.stringify(newOrg)+',   fullorg:'+EJSON.stringify(fullOrg));
    // Create some devices for each sub organization - test org association helpers
    for (var j = Math.floor(Math.random()*10); j >= 0; j--) {
      var device = {
        orgId: newOrgId,
        orgPath: fullOrg.orgPath,
        name: subOrgNames[i]+' pump'+j,
        description: 'irrigation pump model XR'+Math.random()*500
      };
      var deviceId = Devices.insert(device);
      console.log('inserting new device='+EJSON.stringify(device)+', deviceId='+deviceId);
    };
  }
}