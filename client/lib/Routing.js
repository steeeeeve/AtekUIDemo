    Router.configure({
    layoutTemplate: 'layout'
});
Router.map(function() {

    this.route('TankReport', {
        path: '/DeviceDetail/:id',
        waitOn : function() {
            return Meteor.subscribe('channels_history',this.params.id);
        },
        loadingTemplate : 'loading',
        onRun : function() {
            Session.set('selectedDeviceId',this.params.id);
            console.log('Session deviceId set!');
        }
    });
    this.route('CreateUser',{
        path:'/CreateUser'
    });
    this.route('UserSearch',{
        path:'/UserSearch'
    });
    this.route('home',{
        path: '/home',
        waitOn : function() {
            return [Meteor.subscribe('channels'),Meteor.subscribe('devices'),Meteor.subscribe('sites')];
        },
        loadingTemplate : 'loading'
    });

    this.route('Provisioning',{
        path: '/provisioning',
        waitOn : function() {
            return Meteor.subscribe('channels_history',this.params.id);
        },
        loadingTemplate : 'loading',
        onRun : function() {
            Session.set('selectedDeviceId',this.params.id);
            console.log('Session deviceId set!');
        }
    });
    this.route('AdminUI', {
        path : '/AdminUI',
        waitOn : function() {
            return Meteor.subscribe('gateways');
        }
    });
    this.route('ReportingUI', {
        path: 'ReportingUI',
        waitOn: function() {
            return IRLibLoader.load('//code.jquery.com/ui/1.11.1/jquery-ui.js');
        }
    });
    this.route('Login', {path:'/'});

});