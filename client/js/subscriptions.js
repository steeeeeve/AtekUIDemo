Customers = new Meteor.Collection("customers");
Meteor.subscribe('customers');

Sites = new Meteor.Collection("sites");
Meteor.subscribe('sites');


Gateways = new Meteor.Collection("gateways");
Meteor.subscribe('gateways');

Devices = new Meteor.Collection("devices");
Meteor.subscribe('devices');

Channels = new Meteor.Collection("channels");
Meteor.subscribe('channels');

ChannelsHistory = new Meteor.Collection('channels_history');

Users = new Meteor.Collection('allusers');
Meteor.subscribe('allusers');



//ChannelsHistoryDevice = new Meteor.Collection("channel_history_device");
 
/*
DataStream = new Meteor.Collection("data_stream");
Meteor.subscribe('data_stream');

DataPoint = new Meteor.Collection("data_point");
Meteor.subscribe('data_point');

DataPointHistory = new Meteor.Collection("data_point_history");
Meteor.subscribe('data_point_history');
*/