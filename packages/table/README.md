# @ieremeev/table

@ieremeev/table provides you with a table react component


### Props

* **className** - (type: string, default: "ui compact table")<br>
Class name

* **columns** - (type: array, default: [])<br>
Array of columns. For example:
    ```js
    [
        { name: 'id', label: 'ID' },
        { name: 'name', label: 'Name', sort: true, filter: true },
        { name: 'email', label: 'Email', sort: true, filter: true },
    ]
    ```

* **data** - (type: array, default: [])<br>
Array of data. For example:
    ```js
    [
        { id: 1, name: 'Mike', email: 'mike@gmail.com' },
        { id: 2, name: 'Helen', email: 'helen@gmail.com' },
        { id: 3, name: 'Bob', email: 'bob@gmail.com' },
    ]
    ```
* **showRowNumber** - (type: bool, default: false)<br>
Show row number or not?

* **perPage** - (type: number, default: 50)<br>
Default number of rows per one page

* **hideBottomPaginator** - (type: bool, default: false)<br>
Show bottom paginator or not?
