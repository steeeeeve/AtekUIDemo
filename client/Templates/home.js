Template.home.helpers({
    Rendered : function() {
        return Session.get('selectedDeviceId') != null;
    },
    LoggedIn : function() {
    	return Meteor.userId() != null;
    }
});

Template.home.rendered = function() {
}