Template.Login.events({
  "submit #login-form": function(event, template) {
    event.preventDefault();
    Meteor.loginWithPassword(
      template.find("#login-username").value,
      template.find("#login-password").value,
      function(error) {
        if (error) {
          alert(error);
        }
      }
    );
    
  }
});

Template.Login.rendered = function(){
  Deps.autorun(function(){
    var userId = Meteor.userId();
    if(userId != null)
    {
      window.location.href = '/home';
    }
  });
};