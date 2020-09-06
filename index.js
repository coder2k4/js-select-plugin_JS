import {Select} from "./select/select";
import './select/styles.scss'

const select = new Select("#select", {
    placeholder: 'Выберите framework',
    selectedId: '2',
    data: [
        {id: '1', value: 'React'},
        {id: '2', value: 'Vue'},
        {id: '3', value: 'Angular'},
    ],
    onSelect(item) {
        console.log('Selected Item', item)
    }
})

window.s = select