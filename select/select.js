const getTemplate = (placeholder, data = [], selectedId) => {

    let placeholder_text = placeholder ?? 'Выберите элемент'

    const data_html = data.map((item) => {
        let selected = ''
        if (item.id === selectedId) {
            placeholder_text = item.value
            selected = 'selected'
        }

        return `<li class="select__item ${selected}" data-type="item" data-id="${item.id}">${item.value}</li>`
    }).join('')


    return `
         <div class="select__backdrop" data-type="backdrop"></div>
         <div class="select__input" data-type="input">
                <span class="text" data-type="placeholder_span">${placeholder_text}</span>
                <i class="fa fa-chevron-down" aria-hidden="true" data-type="icon_arrow"></i>
            </div>
            <div class="select__dropdown">
                <ul class="select__list">
                    ${data_html}                    
                </ul>
            </div>
    `
}

export class Select {


    constructor(dom, options) {
        // Элемент DOM
        this.$el = document.querySelector(dom)
        this.options = options
        this.#render()
        this.#setup()
    }

    // открытие элемента
    open() {
        this.$el.classList.add("open")
        if (this.$arrow.classList.contains("fa-chevron-down"))
            this.$arrow.classList.remove("fa-chevron-down")
        this.$arrow.classList.add("fa-chevron-up")
        this.$backdrop.style.display = 'block'
    }

    // закрытие элемента
    close() {
        this.$el.classList.remove("open")
        if (this.$arrow.classList.contains("fa-chevron-up"))
            this.$arrow.classList.remove("fa-chevron-up")
        this.$arrow.classList.add("fa-chevron-down")
        this.$backdrop.style.display = 'none'
    }

    destroy() {
        this.$el.removeEventListener('click', this.clickHandler)
        this.$el.innerHTML = ''
    }

    clickHandler(event) {
        // Взависимости от data-type элемента производим ветвление
        const {type} = event.target.dataset
        if (type === 'input') {
            this.toggle()
        } else if (type === 'item') {
            const id = event.target.dataset.id
            this.select(id)
            this.toggle()
        } else if (type === 'backdrop')
            this.toggle()
    }

    // проверка на открытие
    get isOpen() {
        return this.$el.classList.contains('open')
    }

    // Получаем элемент по selectedId
    get current() {
        return this.options.data.find(item => item.id === this.selectedId)
    }

    // функция добавляет выделение на выбранный пункт
    select(id) {
        this.selectedId = id
        this.$placeholder_span.textContent = this.current.value
        this.$el.querySelectorAll(`[data-type="item"]`).forEach(el => el.classList.remove('selected'))
        this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected')

        // Колбэк функционал
        this.options.onSelect ? this.options.onSelect(this.current) : null
    }

    toggle() {
        this.isOpen ? this.close() : this.open()
    }

    #render() {
        // Получаем переданные параметры
        const {placeholder, selectedId, data} = this.options
        this.$el.classList.add('select')
        // Заливаем HTML нашим шаблоном
        this.$el.innerHTML = getTemplate(placeholder, data, selectedId)
    }

    #setup() {
        // Чтобы не терять контекст + повзволяет удалить событие
        this.clickHandler = this.clickHandler.bind(this)
        this.$el.addEventListener('click', this.clickHandler)
        this.$arrow = this.$el.querySelector('[data-type="icon_arrow"]')
        this.$placeholder_span = this.$el.querySelector('[data-type="placeholder_span"')
        // fixed fullscreen block для отмены выпадания списка
        this.$backdrop = this.$el.querySelector('[data-type="backdrop"')
    }


}

