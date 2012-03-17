(function($) {
    
    var SampleTasks = [
	{ id: 1,
	  ticket_id: 'A262S_QAWE!',
	  title: "Sample Ticket 1" },
        { id: 2,
	  ticket_id: '__ZSK6#11SA',
	  title: "Sample Ticket 2" }];

    var Task = Backbone.Model.extend({
	// Returns the difference of end_time and start_time attrs,
	// also calls unsetTimeAttributes
	taskDuration: function() {
	    if (this.has('end_time') && this.has('start_time')) {		
		var taskDuration = (this.get('end_time') - this.get('start_time'));

		this.unsetTimeAttributes();

		return taskDuration;
	    }
	},

	// Unsets start_time and end_time
	unsetTimeAttributes: function() {
	    this.unset('start_time');
	    this.unset('end_time');
	    
	    return this;
	},

	logAssemblaInfo: function() {
	    var assemblaInfo = 'Time entry to Assembla needs to be posted for Ticket ID';

	    assemblaInfo += ' ' + this.get('ticket_id') + ' - duration of ' + secondsToHourlyDecimal(this.taskDuration());

	    console.log(assemblaInfo);
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
	    var tmpl = _.template("<%= title %> - <a href='#' class='do-task' data-ticket-id='<%= ticket_id %>' data-model-id='<%= id %>'>Do</a>");

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
    
    // Clicking "Done" on an active task
    $('#currently-doing a.do-task').live('click', function() {
	var task = tasks.collection.get($(this).data('model-id'));

	$(this).parent().endTask(task);
    });
    
    // Clicking "Do" on a task in the list
    $('#task-list a.do-task').live('click', function() {
	var task = tasks.collection.get($(this).data('model-id'));

	$(this).parent().startTask(task);
    });

    /**
      * Takes a taskModel, and adds the start_time attribute of the current time (unix timestamp format),
      * then moves the div into the div.#currently-doing-inner.
      * @calledon div.single-task
      * @param {Backbone.Model} taskModel
      **/
    $.fn.startTask = function(taskModel) {
	var $this = $(this);
	
	// Model Attrs
	taskModel.set('start_time', getUnixTimestamp());
	
	// Aesthetics
	$this.find('a').text('Done');
	$('#currently-doing-inner').append('<div class="single-task">' + $this.html() + '</div>');

	$this.remove();

	return this;
    };

    /**
      * Sets the end_time on the task model, gets the task duration,
      * moves the div back to its proper place on the task list.
      * @calledon div.single-task
      * @param {Backbone.Model} taskModel
      **/
    $.fn.endTask = function(taskModel) {
	var $this = $(this);

	// Model Attrs
	taskModel.set('end_time', getUnixTimestamp());

	// POST TO ASSEMBLA F'REALSIES
	taskModel.logAssemblaInfo();	
	
	// Aesthetics	
	$this.find('a').text('Do');
	$('#task-list').append('<div class="single-task">' + $this.html() + '</div>');

	$this.remove();

	return this;
    };

} (jQuery));