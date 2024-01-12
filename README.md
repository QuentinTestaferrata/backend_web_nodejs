# backend_web_nodejs


GET all tasks
Voorbeeld: GET http://localhost:3000/tasks

GET task based on title
Voorbeeld: http://localhost:3000/tasks?search="TaskTitel"

GET single task by id with corresponding sticky notes
Voorbeeld: GET http://localhost:3000/tasks/65898989097100c7342bd57d

POST new task met data validatie
Voorbeeld: POST http://localhost:3000/tasks
body -> raw 
{
  "title": "new Task",
  "description": "This is a sample task",
  "priority": "High",
  "dueDate": "2023-01-30",
  "status": "Pending"
}

PUT to update a task
Voorbeeld: PUT http://localhost:3000/tasks/65898989097100c7342bd57d
body -> raw
{
  "title": "Updated Task",
  "status": "Completed"
}

DELETE a task
Voorbeeld: DELETE http://localhost:3000/tasks/65898989097100c7342bd57d

DELETE ALL Tasks
voorbeeld : DELETE http://localhost:3000/tasks/del/all

////////////////////////////////////////////////////
You can also add/edit/delete sticky_notes to specific tasks 
////////////////////////////////////////////////////


POST a new Sticky Note for a specific task
Voorbeeld: POST http://localhost:3000/tasks/65898360b57075c6ae776545/stickynotes
body->raw-> 
{
    "content": "StickyNote Voorbeeld"
}

DELETE a Sticky Note by ID
Voorbeeld: DELETE http://localhost:3000/tasks/stickynotes/65898cc4097100c7342bd592

PUT to update a sticky note's content
Voorbeeld: PUT http://localhost:3000/tasks/stickynotes/5f2b88b6ec4d6638c0521f2b
body->raw
{
    "content": "Update van content van stickynote."
}