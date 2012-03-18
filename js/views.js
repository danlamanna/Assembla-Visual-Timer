    
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
