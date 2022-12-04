export function changeFormatDate(day) {
    let changedDay = new Date()
    if (day) {
        changedDay = new Date(day)
    }
    changedDay = changedDay.toLocaleDateString().replace('.', ' ').replace('.', ' ').split(' ').reverse()
    changedDay = changedDay[0] + '-' + changedDay[1] + '-' + changedDay[2]
    return changedDay
}

export const sortByTitle = (a, b) => {
    a = $('h2', a).text().toLowerCase();
    b = $('h2', b).text().toLowerCase();

    if (a < b)
        return -1
    if (a > b)
        return 1
    return 0
}

export const sortByCreatedDate = (a, b) => {
    a = new Date($('.card_date-start span', a).attr('data-creationDate'))
    b = new Date($('.card_date-start span', b).attr('data-creationDate'))

    return a - b
}

export const sortByExpiredDate = (a, b) => {
    a = new Date($('.card_date-end span', a).attr('data-expiredDate'))
    b = new Date($('.card_date-end span', b).attr('data-expiredDate'))
    return a - b
}

export const clearLists = () => {
    $('.cards').children().remove()
    $('.progress_list').children().remove()
}

export const createStage = (stage) => `
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

export const createTask = (task) => {
    const createDate = new Date(task.creationDate).toLocaleDateString('ru', { month: "long", day: "numeric" })
    const expireDate = new Date(task.expiredDate).toLocaleDateString('ru', { month: "long", day: "numeric" })

    let card = `<li class="card" id="${task._id}">
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
                    <i class="fa-solid fa-hourglass-start"></i><span data-creationDate="${task.creationDate}">${createDate}</span>
                </p>
                <p class="card_date-end">
                    <i class="fa-solid fa-hourglass-end"></i><span data-expiredDate="${task.expiredDate}">${expireDate}</span>
                </p>
            </div>
            <div class="card_dot"></div>
        </div>
    </li>`

    return card
}

export const createProgressInfo = (task) => {
    let card = `<li class="progress_item">
        <h2 class="card_title">${task.title}</h2>
        <div class="card_progress">
            <input type="range" min="0" max="${task.numberOfTotal}" value="${task.numberOfComplete}" disabled>
            <div class="values">
                <span class="value">${task.numberOfComplete}</span>/<span>${task.numberOfTotal}</span>
            </div>
        </div>
    </li>`

    return card
}