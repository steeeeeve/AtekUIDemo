Template.Detail.helpers({
   RowDetail : function() {
    var rowId = Session.get('selectedRowItem');
    return Sites.findOne(rowId);
   },
   Rendered : function() {
       return Session.get('selectedRowItem') != null;
   },
   Devices : function() {
      var rowId = Session.get('selectedRowItem');
        var devices = Devices.find({siteId : rowId},{sort : {status : -1}});
        Session.set('devicesCount', devices.count());
      return devices;
   },
   devicesCount : function() {
      return Session.get('devicesCount');
   }
});

Template.DeviceDetails.helpers({
    statusicon : function() {
      var returnStyle = '';
      if(this.status == '1')
      {
        returnStyle = 'glyphicon glyphicon-warning-sign';
      }
      else if (this.status == '2')
      {
        returnStyle = 'glyphicon glyphicon-remove';
      }
      return returnStyle;
    }
})

Template.Detail.rendered = function() {

    
    Deps.autorun(function() {
        var numDevices = Session.get('devicesCount');
        if(numDevices != null) {
            console.log('Detail rendered');
            if ($.fn.dataTable.isDataTable($('#DeviceTable'))) {
                $('#DeviceTable').DataTable();
            }
            else {
                $('#DeviceTable').DataTable({
                  "pagingType": "simple_numbers",
                  "sDom": '<"top"flp><"clear">'
                });
            }
        }

    });
};

Template.DeviceDetails.events = {
    'click .DeviceRow' : function(e) {
      /*
        e.preventDefault();
        var rowElementId = $(e.target).closest('tr').data('id');
        Session.set("selectedDeviceId",rowElementId);
        UI.render(Template.TankReport);
        var modalWidth = $('#ItemDetailModal').modal({
        keyboard: true,
        backdrop: true,
        show:true
    }).css({'width': '1000px','height' : '700px'}).width();

        $('#ItemDetailModal').css("left", "50%");
        $('#ItemDetailModal').css("width", modalWidth);
        $('#ItemDetailModal').css("margin-left", (modalWidth/2)*-1);
        $('#ItemDetailModal').css("margin-top", "50px" );


        $('.modal-backdrop').addClass('background-backdrop');
      */
      e.preventDefault();
      var rowElementId = $(e.target).closest('tr').data('id');
      window.location.href = '/DeviceDetail/'+rowElementId;
  
    }
};

Template.Detail.events({
   'click #submit' : function(e) {
       e.preventDefault();
       var itemName = Sites.findOne(Session.get('selectedRowItem')).name;
       _.each(gmaps.markers, function(m){
        if(m.title == itemName)
        {
            var newCenter = m.getPosition();
            gmaps.map.setCenter(newCenter);
            gmaps.map.setZoom(13);
        }
       });
   }
});