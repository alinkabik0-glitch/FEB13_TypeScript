import './styles.css';
import * as types from './types';
type Todo = types.Todo;

// Получаем элементы DOM и сразу указываем их конкретные типы (HTMLInputElement, HTMLUListElement и т.д.)
const form = document.getElementById('todo-form') as HTMLFormElement;
const input = document.getElementById('todo-input') as HTMLInputElement;
const list = document.getElementById('todo-list') as HTMLUListElement;

// Массив задач с явной типизацией
let todos: Todo[] = [];
let nextId: number = 1;

// Функция рендеринга
function renderTodos(): void {
    list.innerHTML = ''; // Очищаем список
    
    todos.forEach((todo: Todo) => {
        const li = document.createElement('li');
        if (todo.isCompleted) {
            li.classList.add('done');
        }

        const span = document.createElement('span');
        span.textContent = todo.text;
        
        // Обработчик клика по тексту для смены статуса
        span.addEventListener('click', () => toggleTodo(todo.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        li.appendChild(span);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

// Добавление задачи
function addTodo(text: string): void {
    const newTodo: Todo = {
        id: nextId++,
        text: text,
        isCompleted: false
    };
    todos.push(newTodo);
    renderTodos();
}

// Переключение статуса
function toggleTodo(id: number): void {
    todos = todos.map((todo: Todo) => 
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    renderTodos();
}

// Удаление задачи
function deleteTodo(id: number): void {
    todos = todos.filter((todo: Todo) => todo.id !== id);
    renderTodos();
}

// Обработчик отправки формы
// Типизируем событие как SubmitEvent, а target как HTMLFormElement
form.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault();
    const text = input.value.trim();
    
    if (text) {
        addTodo(text);
        input.value = ''; // Очищаем инпут
    }
});

// Первичный рендер
renderTodos();