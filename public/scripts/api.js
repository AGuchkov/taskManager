export function getTasksRequest(obj) {
    return fetch('/api/v1/tasks', {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then((res) => res.json())
        .then((data) => obj.tasks = data.tasks)
}

export function getStagesRequest(obj) {
    return fetch('/api/v1/stages', {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then((res) => res.json())
        .then((data) => obj.stages = data.stages)
}

export function createTaskRequest(obj) {
    return fetch('/api/v1/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(obj.newTask)
    })
        .then((res) => res.json())
        .then((task) => obj.tasks.push(task))
}

export function updateTaskRequest(obj) {
    return fetch(`/api/v1/tasks/${obj.editID}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(obj.editTask)
    })
        .then((res) => res.json())
        .then((task) => task)
}

export function removeTaskRequest(obj) {
    return fetch(`/api/v1/tasks/${obj.deleteID}`, {
        method: 'DELETE',
    })
}