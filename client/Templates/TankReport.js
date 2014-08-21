Template.TankReport.helpers({
    Rendered : function() {
        return Session.get('selectedDeviceId') != null;
    },
    ChannelList : function() {
        return Channels.find({deviceId : Session.get('selectedDeviceId')}).fetch();
    },
    ChannelCount : function() {
        return Session.get('selectedDeviceChannelCount');
    }
});
Template.TankReport.events = {
    'click #hourReport' : function() {
        Session.set('selectedDeviceDetailDateRange', 'hour');
        redrawReport('hour', Session.get('selectedDeviceId'));
    },
    'click #dayReport' : function() {
        Session.set('selectedDeviceDetailDateRange', 'day');
        redrawReport('day', Session.get('selectedDeviceId'));
    },
    'click #weekReport' : function() {
        Session.set('selectedDeviceDetailDateRange', 'week');
        redrawReport('week', Session.get('selectedDeviceId'));
    },
    'click #monthReport' : function() {
        Session.set('selectedDeviceDetailDateRange', 'month');
        redrawReport('month', Session.get('selectedDeviceId'));
    },
    'click #yearReport' : function() {
        Session.set('selectedDeviceDetailDateRange', 'year');
        redrawReport('year', Session.get('selectedDeviceId'));
    }
}
Template.TankReport.rendered = function(){
    //
    console.log('TankReport rendered');
    Deps.autorun(function(){
        var deviceId = Session.get('selectedDeviceId');
        console.log('Device Id in TankReport is '+deviceId);
        if(deviceId != null && deviceId != '')
        {
            var timeRange = Session.get('selectedDeviceDetailDateRange');
            if(timeRange == null)
            {
                redrawReport('day',deviceId);
            }
            else
            {
                redrawReport(timeRange,deviceId);
            }
        }
        $('#dayReport').click(function(){});
    });
    /*

        */
};
Template.ChannelDetail.helpers({
    Timestamp : function() {
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(this.timestamp);
        return d.toString();
    }
});



function convertToRange(value, srcRange, dstRange){
    // value is outside source range return
    if (value < srcRange[0] || value > srcRange[1]){
        return NaN;
    }

    var srcMax = srcRange[1] - srcRange[0],
        dstMax = dstRange[1] - dstRange[0],
        adjValue = value - srcRange[0];

    return (adjValue * dstMax / srcMax) + dstRange[0];

};

function timeValueCalculate(duration) {
    var timeCutoff;
    if(duration == 'hour')
        timeCutoff == Date.now() - (1 * 60 * 60 * 1000);
    if(duration == 'day')
        timeCutoff = Date.now() - (24 * 60 * 60 * 1000);
    if(duration == 'week')
        timeCutoff = Date.now() - (168 * 60 * 60 * 1000);
    if(duration == 'month')
        timeCutoff = Date.now() - (730 * 60 * 60 * 1000);
    if(duration == 'year')
        timeCutoff = Date.now() - (8765 * 60 * 60 * 1000);
    return timeCutoff;
}
function redrawReport(duration, deviceId) {
    if(deviceId != null)
    {
        console.log('Function redrawReport duration '+duration+' deviceId '+deviceId);
        var timeCutoff = timeValueCalculate(duration);
        console.log('timeValue selected for Report '+ timeCutoff);
        var channelData = Channels.find({deviceId : deviceId}).fetch();
        console.log('Channels found for deviceId : '+deviceId + ' : '+channelData.length);
        Session.set('selectedDeviceChannelCount',channelData.length);
        //var tankData = TankData.find({Tank : deviceId,
        //    Time: {$gt: timeCutoff}},{sort :{Time : 1}}).fetch(); // TANKDATA


        options = {
            chart: {
                zoomType: 'x'
            },

            title: {
                text: 'Device Data for '+deviceId
            },
            xAxis: {            type: 'datetime',
                labels: {
                    formatter: function() {
                        return Highcharts.dateFormat('%d %b %H:%M', this.value);
                    }
                }
            },  //end of time x-axis
            yAxis:
                {    //Percentage on left axis
                    title: {
                        text: 'Values'
                    }
                    
                },
            plotOptions: {
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            },

            series: []
        };  //end of plotOptions
 
        var channelDataArray = {};
        _.each(channelData, function (cd) {
            console.log('Loop : Channel DataType : '+cd.dataType + ' Channel Name '+cd.channelName);
            if(cd.dataType != 'STRING' && cd.channelName != null)
            {
                var channelsHistory = ChannelsHistory.find({deviceId : deviceId, channelName : cd.channelName, timestamp : {$gt : timeCutoff }},{sort : {timestamp : 1}}).fetch();
                console.log('For ChannelData : '+cd.channelName + ', '+channelsHistory.length+ ' found');
                var seriesData = [];
                var dataPrevious = 100000;
                _.each( channelsHistory, function (n) {
                    if(n.channelName == cd.channelName) {
                        if(n.timestamp != null && parseFloat(n.data) != null)
                        {
                            if((parseFloat(n.data) == dataPrevious) ||(parseFloat(n.data) > 1.00 * dataPrevious && parseFloat(n.data) > dataPrevious) || (parseFloat(n.data) < 1 * dataPrevious &&  parseFloat(n.data) < dataPrevious))
                            {
                                seriesData.push([n.timestamp,parseFloat(n.data)]);
                                dataPrevious = parseFloat(n.data);
                            }
                        }
                    }
                });
                /*
                if(seriesData[seriesData.length-1][0] < cd.timestamp)
                {
                    seriesData.push([cd.timestamp,parseInt(cd.data)]);
                }
                */
                console.log('Series Data, Name : '+cd.channelName + ' Data : '+seriesData);
                options.series.push({
                    name : cd.channelName,
                    data : seriesData
                });
            }
        });




        var chart = $('#reportContainer').highcharts(options);
        chart = $('#reportContainer').highcharts(options);
    }
}
