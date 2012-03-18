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