Template.AlertDetails.helpers({
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
    },
    descriptionOfAlert : function() {
      if(this.status == 1)
      {
        return "Temperature is above "+threshold.temperature.alert;

      }
      else if(this.status == 2)
      {
        return "Temperature is above "+threshold.temperature.error;
      }
    }
})
