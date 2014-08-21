Meteor.publish('channels_history' , function(deviceId){
	if(this.userId)
	{
		console.log('Device Id in publish: '+deviceId);
		console.log('count of publish '+ChannelsHistory.find({deviceId : deviceId},{sort : {timestamp : 1}},{fields : {'deviceId' : 1, 'channelName' : 1 ,'timestamp' : 1, 'data' : 1}}).count());
		return ChannelsHistory.find({deviceId : deviceId},{fields : {'deviceId' : 1, 'channelName' : 1 ,'timestamp' : 1, 'data' : 1}});
	}
});

Meteor.publish('allusers',function() {
	return Meteor.users.find();
});