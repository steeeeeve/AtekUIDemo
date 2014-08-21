if (Meteor.isClient) {
  Template.navItems.helpers({
    activeIfTemplateIs: function (template) {
      var currentRoute = Router.current();
      return currentRoute &&
        template === currentRoute.lookupTemplate() ? 'active' : '';
    }
  });
}

Template.layout.events = {
    'click #TankSearchSubmit' : function(e) {
        e.preventDefault();
        var queryTerms = $('#TankSearchText').val();
        console.log('Query Terms :'+queryTerms);
        window.location.href = '/TankDetail/'+queryTerms;
    },
    'click #logoutButton' : function(e) {
        e.preventDefault();
        Meteor.logout(function(error) {
            console.log(error);
            window.location.href = '/';
        });
    }
};

Template.layout.rendered = function () {
    /*
        Deps.autorun(function() {
    console.log('in deps autorun');
    var deviceIds = [];
    var channels = Channels.find({channelName : 'temperature'}).fetch();
    console.log('channels found'+channels.length);
    _.each(channels, function(e) {
        if(parseFloat(e.data) > threshold.temperature.alert && parseFloat(e.data) <= threshold.temperature.error)
        {
            deviceIds.push(e.deviceId);
            Devices.update({_id : e.deviceId},{$set : {status : 1}});
        }
        else if (parseFloat(e.data) > threshold.temperature.error)
        {
            Devices.update({_id : e.deviceId},{$set : {status : 2}});
        }
        else
        {
            Devices.update({_id : e.deviceId},{$set : {status : 0}});
        }
    });
    console.log('channels found above threshold'+ deviceIds.length);
    console.log('device ids '+deviceIds);
    console.log('devices found' +Devices.find({_id : {$in : deviceIds}}).count());
    if(deviceIds.length > 0)
    {
    //  Devices.update({_id : {$in : deviceIds}},{$set : {status : 2}});
    }

});
*/
}