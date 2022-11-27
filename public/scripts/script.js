$(document).ready(function () {

    const loadPage = async () => {
        await getTasksRequest()
        await getStagesRequest()
        fillStagesList(dataStorage.stages)
        fillTasksList(dataStorage.tasks, dataStorage.stages)

        $('input[type="date"]').attr('min', changeFormatDate())

        $('.cards').each(function () {
            const cardArr = $(this).children().sort(sortByTitle)
            $(this).append(cardArr)
        })
    }

    function changeFormatDate(day) {
        let changedDay = new Date()
        if (day) {
            changedDay = new Date(day)
        }
        changedDay = changedDay.toLocaleDateString().replace('.', ' ').replace('.', ' ').split(' ').reverse()
        changedDay = changedDay[0] + '-' + changedDay[1] + '-' + changedDay[2]
        return changedDay
    }

    loadPage();

    const dataStorage = {
        tasks: [],
        stages: [],
        newTask: {},
        editTask: {},
    }

    $('body').on('click', '.card_edit', function () {
        const editTask = dataStorage.tasks.find(task => task._id === $(this).parent().parent().attr('id'))

        dataStorage.editID = $(this).parent().parent().attr('id')

        $('#task_title').val(editTask.title)
        $('#task_desc').val(editTask.value)
        $('#task_range').val(editTask.completeProgress)
        $('.value').text(editTask.completeProgress)
        $('#task_stage').val(editTask.stage)
        $('#task_expired_date').val(changeFormatDate(editTask.expiredDate))

        $('#taskAdd').hide()
        $('#taskDelete').hide()
        $('#taskEdit').show()
        $('.form_container').fadeIn()
    })

    $('body').on('click', '.card_delete', function () {
        dataStorage.deleteID = $(this).parent().parent().attr('id')

        $('#taskAdd').hide()
        $('#taskEdit').hide()
        $('#taskDelete').show()
        $('.form_container').fadeIn()
    })

    $('body').on('click', '.sort_title', function () {
        const cards = $(this).parent().parent().parent().next()
        const card = $(this).parent().parent().parent().next().children()

        card.sort(sortByTitle)

        cards.append(card)
    })

    $('body').on('click', '.sort_created', function () {
        const cards = $(this).parent().parent().parent().next()
        const card = $(this).parent().parent().parent().next().children()

        card.sort(sortByCreatedDate)

        cards.append(card)
    })

    $('body').on('click', '.sort_expired', function () {
        const cards = $(this).parent().parent().parent().next()
        const card = $(this).parent().parent().parent().next().children()

        card.sort(sortByExpiredDate)

        cards.append(card)
    })

    function getTasksRequest() {
        return fetch('/api/v1/tasks', {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
            .then((res) => res.json())
            .then((data) => dataStorage.tasks = dataStorage.tasks.concat(data.tasks))
    }

    function getStagesRequest() {
        return fetch('/api/v1/stages', {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
            .then((res) => res.json())
            .then((data) => dataStorage.stages = dataStorage.stages.concat(data.stages))
    }

    function createTaskRequest() {
        return fetch('/api/v1/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(dataStorage.newTask)
        })
            .then((res) => res.json())
            .then((task) => dataStorage.tasks.push(task))
    }

    function updateTaskRequest() {
        return fetch(`/api/v1/tasks/${dataStorage.editID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(dataStorage.editTask)
        })
            .then((res) => res.json())
            .then((data) => data)
    }

    function removeTaskRequest() {
        return fetch(`/api/v1/tasks/${dataStorage.deleteID}`, {
            method: 'DELETE',
        })
    }

    const createStage = (stage) => `
    <li class="category">
        <div class="category_info">
            <h2 class="category_title">${stage.name}</h2>
            <div class="dropdown">
                <button class="dropbtn category_btn fa-solid fa-ellipsis"></button>
                <div class="dropdown-content">
                    <button class="sort_title">по имени</button>
                    <button class="sort_created">по дате создания</button>
                    <button class="sort_expired">по дате сдачи</button>
                </div>
            </div>
        </div>
        <ul class="cards" id=${stage._id}>
        </ul>
    </li>`

    const createTask = (task) => {
        createDate = new Date(task.creationDate).toLocaleDateString('ru', { month: "long", day: "numeric" })
        expireDate = new Date(task.expiredDate).toLocaleDateString('ru', { month: "long", day: "numeric" })

        card = `
        <li class="card" id="${task._id}">
            <div class="card_top">
                <h2 class="card_title">${task.title}</h2>
                <button class="card_btn card_edit fa-solid fa-pen-to-square"></button>
                <button class="card_btn card_delete fa-solid fa-trash-can"></button>
            </div>
            <div class="card_desc">${task.value}</div>
            <div class="card_progress">
                  <input type="range" min="0" max="100" value="${task.completeProgress}" disabled>
                  <div class="values">
                    <span class="value">${task.completeProgress}</span>/<span>100</span>
                  </div>
                </div>
            <div class="card_bot">
                <div class="card_dates">
                    <p class="card_date-start">
                        <i class="fa-solid fa-hourglass-start"></i><span>${createDate}</span>
                    </p>
                    <p class="card_date-end">
                        <i class="fa-solid fa-hourglass-end"></i><span>${expireDate}</span>
                    </p>
                </div>
                <div class="card_dot"></div>
            </div>
        </li>`

        return card
    }

    const sortByTitle = (a, b) => {
        a = $('.card_title', a).text().toLowerCase();
        b = $('.card_title', b).text().toLowerCase();
        if (a < b)
            return -1
        if (a > b)
            return 1
        return 0
    }

    const sortByCreatedDate = (a, b) => {
        a = new Date($('.card_date-start', a))
        b = new Date($('.card_date-start', b))
        return a - b
    }

    const sortByExpiredDate = (a, b) => {
        a = new Date($('.card_date-end', a))
        b = new Date($('.card_date-end', b))
        return a - b
    }

    const fillStagesList = (stages) => {
        stages.forEach((stage) => $('.categories').append(createStage(stage)));
    }

    const fillTasksList = ((tasks, stages) => {
        const readyStage = stages.find(stage => stage.name === 'ready')
        const readyTasks = tasks.filter(task => task.stage === readyStage._id)
        readyTasks.forEach((task) => $(`.cards[id=${readyStage._id}]`).append(createTask(task)))

        const progressStage = stages.find(stage => stage.name === 'progress')
        const progressTasks = tasks.filter(task => task.stage === progressStage._id)
        progressTasks.forEach((task) => $(`.cards[id=${progressStage._id}]`).append(createTask(task)))

        const reviewStage = stages.find(stage => stage.name === 'review')
        const reviewTasks = tasks.filter(task => task.stage === reviewStage._id)
        reviewTasks.forEach((task) => $(`.cards[id=${reviewStage._id}]`).append(createTask(task)))

        const doneStage = stages.find(stage => stage.name === 'done')
        const doneTasks = tasks.filter(task => task.stage === doneStage._id)
        doneTasks.forEach((task) => $(`.cards[id=${doneStage._id}]`).append(createTask(task)))
    })

    const clearTasksList = () => {
        $('.cards').children().remove()
    }

    $('#taskAdd').on('change', () => {
        $('#taskAdd').serializeArray().forEach((e) => {
            dataStorage.newTask[e.name] = e.value
        })

        dataStorage.newTask.expiredDate = Math.floor((new Date(dataStorage.newTask.expiredDate) / 1000) * 1000).toString()

        return dataStorage.newTask
    });

    $('#taskEdit').on('change', () => {

        let expDate = new Date($('#task_expired_date').val())

        dataStorage.editTask.title = $('#task_title').val()
        dataStorage.editTask.value = $('#task_desc').val()
        dataStorage.editTask.completeProgress = $('#task_range').val()
        dataStorage.editTask.stage = $('#task_stage').val()
        dataStorage.editTask.expiredDate = expDate.toISOString()
    });

    $('body').on('click', 'input[type="submit"]', async function (e) {
        e.preventDefault()
        dataStorage.tasks = []
        if ($(this).parent().attr('id') === 'taskAdd') {
            await createTaskRequest();
            await getTasksRequest();
        }
        if ($(this).parent().attr('id') === 'taskEdit') {
            await updateTaskRequest();
            await getTasksRequest();
        }
        if ($(this).parent().attr('id') === 'taskDelete') {
            await removeTaskRequest();
            await getTasksRequest();
        }
        clearTasksList()
        fillTasksList(dataStorage.tasks, dataStorage.stages);
        $(this).parent().parent().parent().fadeOut()
        setTimeout(() => {
            $(this).parent().trigger('reset')
        }, 1000)
    })

    $('#task_range').on('input', function () {
        $(this).next().find('.value').text($(this).val())
    })

    $('.add').on('click', () => {
        $('#taskAdd').show()
        $('#taskEdit').hide()
        $('#taskDelete').hide()
        $('.form_container').fadeIn()
    })

    $('.close').on('click', () => {
        $('.form_container').fadeOut()
    })
});