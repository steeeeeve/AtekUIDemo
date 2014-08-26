Template.CreateUser.events({
	'click #SubmitUser' : function(e){
		var user = {
			username : $('#CreateUserName').val(), 
			password : $('#CreatePassword').val(), 
			email : $('#CreateEmail').val(),
			role : $('#CreateRole').val()
		};
		Meteor.call('createSecurityUser',user);
	}
})

Template.CreateUser.helpers({
	users : function() {
		return UserSecurity.find();
	},
	CreateUserOptions : function(){
		var result = Meteor.call('createableUserRoles',Meteor.user());
		console.log(result);
		return [{name :'admin'},{name :'readOnly'},{name:'operator'}];
	}
});

Template.CreateUser.rendered = function() {
	$('#CreateMobilePhone').mask("(999) 999-9999");
}