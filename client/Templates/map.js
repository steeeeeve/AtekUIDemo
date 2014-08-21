Template.map.rendered = function() {
    if (! Session.get('map'))
        gmaps.initialize();


    Deps.autorun(function() {
        var siteSelected = Session.get('selectedRowItem');
        console.log('site Selected'+siteSelected);
        var itemlist = Devices.find({siteId : siteSelected, loc_lat : {$exists : true}}).fetch();
        console.log('itemList '+itemlist);
        _.each(itemlist, function(item) {
            if (typeof item.loc_lat !== 'undefined' &&
                typeof item.loc_long !== 'undefined') {

                var objMarker = {
                    id: item._id,
                    lat: item.loc_lat,
                    lng: item.loc_long,
                    title: item.name
                };

                // check if marker already exists
                if (!gmaps.markerExists('id', objMarker.id))
                    gmaps.addMarker(objMarker);
                if(gmaps.map != null)
                    gmaps.calcBounds();
                }
        });
    });
}

Template.map.destroyed = function() {
    Session.set('map', false);
}