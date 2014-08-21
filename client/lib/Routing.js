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
        /*
        action : function() {
            if(this.ready())
                this.render();
        },
        */
    });
    this.route('CreateUser',{
        path:'/CreateUser',
        waitOn : function() {
            return IRLibLoader.load('https://raw.githubusercontent.com/digitalBush/jquery.maskedinput/1.3.1/dist/jquery.maskedinput.js');

        }
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
        /*onBeforeAction : function(pause) {
            if(!Meteor.user())
            {
                this.render('Login');
            }
            else
            {
                Meteor.subscribe('channels').wait()
            }
        }*/
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
    this.route('Login', {path:'/'});

});