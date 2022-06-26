import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  categories: Category[] = [
    {
      name: 'Web design',
    },
    {
      name: 'Backend Development',
    },
    {
      name: 'Front end development',
    },
    {
      name: 'Dev ops',
    },
  ];
  private readonly LOCAL_STORAGE_KEY = 'todoList';
  private todoArr = this.getLocalStorageList();
  private todoList$ = new BehaviorSubject<Todo[]>(this.todoArr);

  constructor() {
    this.todoList$.subscribe(this._listChanged.bind(this));
  }

  public getToDoList = () => this.todoList$;

  public addItem = (newItem: Todo) => {
    const newTodo: Todo = {
      ...newItem,
      status: 'todo',
      id: Date.now().toString(),
    };
    return this.todoArr.unshift(newTodo) && this.todoList$.next(this.todoArr);
  };


  _listChanged(): void {
    if (this.todoArr.length) {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.todoArr));
    }
  }

  public removeItem(itemToRemove: Todo) {
    const itemToRemoveIndex = this.todoArr.findIndex(item => item.id === itemToRemove.id);
    if (itemToRemoveIndex > -1) {
      this.todoArr.splice(itemToRemoveIndex, 1);
      if (!this.todoArr.length) {
        this.todoList$.next([]);
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
      } else {
        this.todoList$.next(this.todoArr);
      }
    }
  }

  getCategories(): Category[] {
    return this.categories;
  }

  updateTodo(item: Todo) {
    const itemToRemoveIndex = this.todoArr.findIndex(i => i.id === item.id);
    if (itemToRemoveIndex > -1) {
      this.todoArr[itemToRemoveIndex] = item;
      this.todoList$.next(this.todoArr);
    }
  }

  completeTodo(item: Todo) {
    const itemToRemoveIndex = this.todoArr.findIndex(i => i.id === item.id);
    if (itemToRemoveIndex > -1) {
      this.todoArr[itemToRemoveIndex].status = this.todoArr[itemToRemoveIndex].status === 'done' ? 'todo' : 'done';
      this.todoList$.next(this.todoArr);
    }
  }

  private getLocalStorageList(): Todo[] {
    let todos: Todo[] = [];
    const localStorageStr = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (localStorageStr) {
      todos = JSON.parse(localStorageStr);
      todos = todos.sort((a: Todo, b: Todo) => a.creationDate > b.creationDate ? -1 : 1);
    }
    return todos;
  }
}


export interface Todo {
  name: string;
  description: string;
  creationDate: string;
  category: string;
  status?: 'todo' | 'done';
  id: string;
}

export interface Category {
  name: string;
}
