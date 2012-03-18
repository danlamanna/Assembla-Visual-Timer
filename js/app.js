var SampleTasks = [
    { id: 1,
      ticket_id: 'A262S_QAWE!',
      title: "Sample Ticket 1" },
    { id: 2,
      ticket_id: '__ZSK6#11SA',
      title: "Sample Ticket 2" }];

jQuery(document).ready(function() {
    window.tasks = new TaskListView();
    
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
});