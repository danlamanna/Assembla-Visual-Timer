(function($) {
    
    var SampleTasks = [
	{ id: 1,
	  ticket_id: 'A262S_QAWE!',
	  title: "Sample Ticket 1" },
        { id: 2,
	  ticket_id: '__ZSK6#11SA',
	  title: "Sample Ticket 2" }];

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

    var TimeEntryList = Backbone.Collection.extend({
	model: TimeEntry
    });

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

    var TaskList = Backbone.Collection.extend({
	model: Task
    });
    
    var TaskView = Backbone.View.extend({
	tagName: 'div',
	className: 'single-task',
	template: $('#task-template').html(),

	render: function() {	   	    
	    var tmpl = _.template("<%= title %>");

	    // Narsty, has to be a way to do this with attributes {}
	    $(this.el).attr('data-task-id', this.model.get('id'));

	    $(this.el).html(tmpl(this.model.toJSON()));
	    
	    return this;
	}
    });

    var TaskListView = Backbone.View.extend({
	el: $('#task-list'),

	initialize: function() {
	    this.collection = new TaskList(SampleTasks);
	    this.render();
	},

	render: function() {
	    var that = this;
	    _.each(this.collection.models, function(item) {
		that.renderTask(item);
	    }, this);
	},

	renderTask: function(item) {
	    var taskView = new TaskView({
		model: item
	    });
	    
	    this.$el.append(taskView.render().el);
	}
    });

    var tasks = new TaskListView();

    $('.single-task').draggable({
	containment: 'body',
	revert: 'invalid',

	start: function() {
	    $('.ui-droppable').css('border', '2px solid black');
	},

	stop: function() {
	    $('.ui-droppable').css('border', '1px solid #ccc');
	}
    });

    $('#currently-doing-inner').droppable({
	// Dropping a task into the "What am I doing" box
	drop: function(event, ui) {
	    $(ui.draggable).startTask();
	}
    });

    $('#task-list').droppable({
	drop: function(event, ui) {
	    $(ui.draggable).endTask();
	}
    });

    /**
      * Adds the start_time attribute of the current time (unix timestamp format),
      * then moves the div into the div.#currently-doing-inner.
      * @calledon div.single-task
      **/
    $.fn.startTask = function() {
	var $this     = $(this);
	var taskModel = tasks.collection.get($this.data('task-id'));
	var timeEntry = taskModel.get('time_entry');
	
	// Model Attrs
	timeEntry.set('start_time', getUnixTimestamp());

	return this;
    };

    /**
      * Sets the end_time on the task model, gets the task duration,
      * moves the div back to its proper place on the task list.
      * @calledon div.single-task
      **/
    $.fn.endTask = function(taskModel) {
	var $this = $(this);
	var taskModel = tasks.collection.get($this.data('task-id'));
	var timeEntry = taskModel.get('time_entry');

	// Model Attrs
	timeEntry.set('end_time', getUnixTimestamp());

	// POST TO ASSEMBLA F'REALSIES
	taskModel.logEntryInfo();

	return this;
    };

} (jQuery));