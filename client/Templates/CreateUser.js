Template.CreateUser.events({
	'click #SubmitUser' : function(e){
		var user = {username : $('#CreateUserName').val(), password : $('#CreatePassword').val()};
		framework.add_user(user);
	}
})

Template.CreateUser.helpers({
	CreateUserOptions : function(){
		var result = Meteor.call('createableUserRoles',Meteor.user());
		console.log(result);
		return [{name :'Customer Admin'},{name :'Customer'}];
	}
});

Template.CreateUser.rendered = function() {
	$('#CreateMobilePhone').mask("(999) 999-9999");
}