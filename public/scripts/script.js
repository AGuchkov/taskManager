import * as apiObj from '../scripts/api.js';
import * as utilsObj from '../scripts/utils.js';

const dataStorage = {
    tasks: [],
    stages: [],
    newTask: {},
    editTask: {},
}

$(document).ready(function () {

    const loadPage = async () => {
        await apiObj.getTasksRequest(dataStorage)
        await apiObj.getStagesRequest(dataStorage)
        fillStagesList(dataStorage.stages)
        fillTasksList(dataStorage.tasks, dataStorage.stages)
        fillProgressList(dataStorage.tasks)

        $('input[type="date"]').attr('min', utilsObj.changeFormatDate())

        $('.cards').each(function () {
            const cardArr = $(this).children().sort(utilsObj.sortByTitle)
            $(this).append(cardArr)
        })
    }

    const fillStagesList = (stages) => {
        stages.forEach((stage) => $('.categories').append(utilsObj.createStage(stage)));
        stages.forEach((stage) => $('#task_stage').append(`<option value="${stage._id}">${stage.name}</option>`));
    }

    const fillTasksList = ((tasks, stages) => {

        const groupedStages = Object.values(stages.reduce((groupedStages, stage) => (stage.name in groupedStages ? groupedStages[stage.name].push(stage) : groupedStages[stage.name] = [stage], groupedStages), {}))

        groupedStages.forEach(stage => {
            stage = stage.find(stage => stage.name)
            const taskArr = tasks.filter(task => task.stage === stage._id)
            taskArr.forEach((task) => $(`.cards[id=${stage._id}]`).append(utilsObj.createTask(task)))
        })
    })

    const fillProgressList = (tasks) => {
        const progressArr = []

        console.log(tasks)

        const groupedTasks = Object.values(tasks.reduce((groupedTasks, task) => (task.title in groupedTasks ? groupedTasks[task.title].push(task) : groupedTasks[task.title] = [task], groupedTasks), {}))

        groupedTasks.forEach(item => {
            const progressObj = {
                title: '',
                numberOfComplete: '',
                numberOfTotal: '',
            }

            progressObj.title = item[0].title
            progressObj.numberOfComplete = item.filter(task => task.completeProgress === 100).length
            progressObj.numberOfTotal = item.length

            progressArr.push(progressObj)
        })

        if (progressArr.length) {
            progressArr.forEach((task) => $('.progress_list').append(utilsObj.createProgressInfo(task)));
        }
    }

    loadPage();

    $('body').on('click', '.card_edit', function () {
        const editTask = dataStorage.tasks.find(task => task._id === $(this).parent().parent().attr('id'))

        dataStorage.editID = $(this).parent().parent().attr('id')

        $('#task_title').val(editTask.title)
        $('#task_desc').val(editTask.value)
        $('#task_range').val(editTask.completeProgress)
        $('.value').text(editTask.completeProgress)
        $('#task_stage').val(editTask.stage)
        $('#task_expired_date').val(utilsObj.changeFormatDate(editTask.expiredDate))

        $('#taskAdd').hide()
        $('#taskDelete').hide()
        $('#taskEdit').show()
        $('.form_container').fadeIn()
        $('html').css('overflow', 'hidden')
    })

    $('body').on('click', '.card_delete', function () {
        dataStorage.deleteID = $(this).parent().parent().attr('id')

        $('#taskAdd').hide()
        $('#taskEdit').hide()
        $('#taskDelete').show()
        $('.form_container').fadeIn()
        $('html').css('overflow', 'hidden')
    })

    let reverse = false

    $('body').on('click', '.sort_title', function () {
        const btn = $(this)
        const cards = $(this).parent().parent().parent().next()

        cards.each(function () {
            let cardArr = Array.from($(this).children().sort(utilsObj.sortByTitle))
            if (reverse) {
                btn.addClass('reverse')
                cardArr.reverse()
                $(this).append(cardArr)
                reverse = false
                return
            }
            btn.removeClass('reverse')
            $(this).append(cardArr)
            reverse = true
        })
    })

    $('body').on('click', '.sort_created', function () {
        const btn = $(this)
        const cards = $(this).parent().parent().parent().next()

        cards.each(function () {
            const cardArr = Array.from($(this).children().sort(utilsObj.sortByCreatedDate))
            if (reverse) {
                btn.addClass('reverse')
                cardArr.reverse()
                $(this).append(cardArr)
                reverse = false
                return
            }
            btn.removeClass('reverse')
            $(this).append(cardArr)
            reverse = true
        })
    })

    $('body').on('click', '.sort_expired', function () {
        const btn = $(this)
        const cards = $(this).parent().parent().parent().next()

        cards.each(function () {
            const cardArr = Array.from($(this).children().sort(utilsObj.sortByExpiredDate))
            if (reverse) {
                btn.addClass('reverse')
                cardArr.reverse()
                $(this).append(cardArr)
                reverse = false
                return
            }
            btn.removeClass('reverse')
            $(this).append(cardArr)
            reverse = true
        })
    })

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

    $('form').on('submit', async function (e) {
        e.preventDefault()
        dataStorage.tasks = []
        if ($(this).attr('id') === 'taskAdd') {
            await apiObj.createTaskRequest(dataStorage);
            await apiObj.getTasksRequest(dataStorage);
            $(this).trigger('reset')
        }
        if ($(this).attr('id') === 'taskEdit') {
            await apiObj.updateTaskRequest(dataStorage);
            await apiObj.getTasksRequest(dataStorage);
        }
        if ($(this).attr('id') === 'taskDelete') {
            await apiObj.removeTaskRequest(dataStorage);
            await apiObj.getTasksRequest(dataStorage);
        }
        utilsObj.clearLists()
        fillTasksList(dataStorage.tasks, dataStorage.stages)
        fillProgressList(dataStorage.tasks)

        $('.cards').each(function () {
            const cardArr = $(this).children().sort(utilsObj.sortByTitle)
            $(this).append(cardArr)
        })

        $(this).parent().parent().fadeOut()
        $('html').css('overflow', 'visible')
    })

    $('#task_range').on('input', function () {
        $(this).next().find('.value').text($(this).val())
    })

    $('.add').on('click', () => {
        $('#taskAdd').show()
        $('#taskEdit').hide()
        $('#taskDelete').hide()
        $('.form_container').fadeIn()
        $('html').css('overflow', 'hidden')
    })

    $('.close').on('click', () => {
        $('.form_container').fadeOut()
        setTimeout(() => {
            $('html').css('overflow', 'visible')
        }, 1000)
    })
});
