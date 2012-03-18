    var Task = Backbone.Model.extend({
	initialize: function() {
	    this.set('time_entry', new TimeEntry({
		ticket_id: this.get('ticket_id')
	    }));
	},

	// This is to simulate that we're able to get a line where
	// we can get the proper set of data that needs to be POSTed to
	// assembla.
	logEntryInfo: function() {
	    console.log('Assembla Ticket ID: ' + this.get('ticket_id'));
	    console.log('Time Entry Obj:');
	    console.log(this.get('time_entry').attributes);
	}
    });

    var TimeEntry = Backbone.Model.extend({
	defaults: {
	    comment: '',
	},

	// Returns the difference of end_time and start_time attrs,
	// unsets start_time and end_time.
	duration: function() {
	    if (this.has('end_time') && this.has('start_time')) {		
		var duration = (this.get('end_time') - this.get('start_time'));

		this.unsetTimeAttributes();

		return duration;
	    }
	},

	// Unsets start_time and end_time
	unsetTimeAttributes: function() {
	    this.unset('start_time');
	    this.unset('end_time');
	    
	    return this;
	}
    });
