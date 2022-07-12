(function(){

    let Array = [];
    let listName = '';

    //создаем и возвращаем заголовок приложения
    function createAppTitle(title){
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // создаем и возвращаем форму для создания дела
    function createTodoItemForm(){
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        button.disabled = !input.value.length;

        input.addEventListener('input', function(){
            if(input.value !== ""){
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = "Введите название нового дела";
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
       
        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);
 
        return {
            form,
            input,
            button,
        };
    }

    //создаем и возвращаем список элементов
    function createTodoList(){
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }
    
   

    function createTodoItem(obj){
        let item =document.createElement('li');
        //кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        

    
        //устанавливаем стили для элемента списка, а также для размещения кнопок
        // в его првой части с помощью flex
    
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;
    
        buttonGroup.classList.add('btn-group','btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        if (obj.done == true) item.classList.add('list-group-item-success')
    

         //добавляем обработчики на кнопки
         doneButton.addEventListener('click', function(){
            item.classList.toggle('list-group-item-success');
            for(const listItem of Array){
                if(listItem.id == obj.id) listItem.done =! listItem.done
            }
            saveList(Array,listName);
        });
        deleteButton.addEventListener('click', function(){
            if (confirm('Вы уверены?')) {
                item.remove();
                for(let i = 0; i < Array.length; i++){
                    if(Array[i].id == obj.id) Array.splice(i,1)
            }
            saveList(Array,listName);
            }
        });
        //Вкладываем кнопки в отдельный элемент, чтобы они обьединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
            buttonGroup,
        };
    }
    
    function getNewId(arr){
        let max = 0;
        for(const item of arr){
            if(item.id > max) max = item.id
        }
        return max + 1;
    }

    function saveList(arr,keyName){
        localStorage.setItem(keyName,JSON.stringify(arr) );
    }

    function createTodoApp(container, title = 'Список дел', keyName, defArray = []){

       

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        listName = keyName;
        Array = defArray;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        let localData = localStorage.getItem(listName);
        if (localData !== null && localData !== '') Array = JSON.parse(localData);

        for (const itemList of Array){
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);
        }

        //браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e){
            //эта строчка необходима, чтобы предотвратить стандартное действие браузера
            // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

             //игнорируем создание элемента, если пользователь ничего не ввел в поле
             if(!todoItemForm.input.value){
                return;
            } 

            let newItem = {
                id: getNewId(Array),
                name:todoItemForm.input.value,
                done:false
            }

            let todoItem = createTodoItem(newItem);

            Array.push(newItem);

            saveList(Array,listName);

            // создаем и добавляем в список дел новое дело с названием поля для ввода
            todoList.append(todoItem.item);
            //обнуляем значение в поле, чтобы не пришлось стирать его в ручную
            todoItemForm.button.disabled = true;
            todoItemForm.input.value = '';
           
        });
    }
    
   window.createTodoApp = createTodoApp;    
})();


