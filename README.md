# backend_web_nodejs

Here's an example of how u might want to order the API calls: 

1) use: POST http://localhost:3000/tasks
   in here, Body -> raw
{
  "title": "Task High",
  "description": "This is a sample task",
  "priority": "High",
  "dueDate": "2023-01-30",
  "status": "Pending"
}

Add 3 of these one with "High" priority, one "Medium" and one "Low"
Also change the names to Task High, Task Medium and Low for each of them.

2) then use GET http://localhost:3000/tasks to see the three newly created tasks and their id's
   copy any of the id's

3) Use http://localhost:3000/tasks?search=Task To search all of the tasks that have "task" in their title.
   Use http://localhost:3000/tasks?search=Medium To look for those with only medium in the title.

4) now use GET http://localhost:3000/tasks/<id>
   id will look something like this : 65a15fff860311926793b6bb

5) You can also use this GET http://localhost:3000/tasks/priority
   To see all of the tasks in their respective order

6) update a task use PUT http://localhost:3000/tasks/<id>
   in the body -> raw window give in the changes for that task
{
  "title": "Updated Task",
  "status": "Completed",
  "priority": "Low"
}
You can also choose which fields to edit, you don't have to edit all of them, only one or two is possible too.

7) add notes to a specific task you can use POST http://localhost:3000/tasks/<id>/stickynotes
body->raw:
{
  "content": "StickyNote Voorbeeld"
}

8) You can use the GET from step 2 to see the notes 
   Or you can use GET http://localhost:3000/tasks/<id>/stickynotes to get all of the Sticky notes for a specific task and their ID or creation time.

9) Update a sticky note using PUT http://localhost:3000/tasks/stickynotes/<Sticky_Note_id>
   The sticky Note id is can be found following step 7

10) Use DELETE http://localhost:3000/tasks/stickynotes/<Sticky_note_id> to delete a specific sticky note
11) Or use DELETE http://localhost:3000/tasks/<Task_id>/stickynotes/all to delete all of the sticky notes for one task.

12) Use DELETE http://localhost:3000/tasks/<Task_id> to delete a specific task.
13) Or use DELETE http://localhost:3000/tasks/del/all to delete ALL tasks.