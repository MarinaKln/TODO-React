var active = document.getElementsByClassName("active"),
    completed = document.getElementsByClassName("completed");

var TodoItem = React.createClass({
    class: function (completed) {
        return completed ? "completed" : "active";
    },

    render: function() {
        var props = this.props;

        return (
            <div className = {"todo_item ".concat(this.class(props.completed))} >
                <input className = "toggle"
                       type = "checkbox"
                       onChange = {props.change}
                       value = {props.index}
                       checked = {props.completed} />
                <label>{props.text}</label>
                <button className = "destroy"
                        onClick = {props.click}
                        value = {props.index} >X</button>
            </div>
        )
    }
});

var TodoList = React.createClass({
    showTodos: function(show) {
        var nowShowing = show;
            return (
                this.props.data.filter(function(todo) {
                switch (nowShowing) {
                    case "active":
                        return !todo.completed;
                    case "completed":
                        return todo.completed;
                    default:
                        return true
                }
            })
            )
    },
    createTodoItem: function(item, index) {
        return (
            <TodoItem
                key = {index}
                index = {index}
                text = {item.text}
                completed = {item.completed}
                click = {this.props.click}
                change = {this.props.change}
            />
        )
    },
    render: function() {
        return (
            <div className = "todo_list" >
                {this.showTodos(this.props.nowShowing).map(this.createTodoItem)}
            </div>
        )
    }
});

var Header = React.createClass({
render: function() {
        var props = this.props;

        return (
            <div className = "header"
                 onKeyDown = {props.press}>
        <input
            className = "toggle_all"
            onChange = {props.toggleAll}
            checked = {props.checked}
            type = "checkbox"
            />
        <input
            className = "todo_input"
            type = "text"
            placeholder = "What needs to be done?"
            onChange = {props.change}
            value = {props.value}
            />
        </div>
        )
    }
});

var Footer = React.createClass({
    render: function() {
        var props = this.props,
            clearButton = null,
            footer = null;
        if(completed.length > 0) {
            clearButton = (
                <button
                    className = "footer__clear"
                    onClick = {props.clearClick}>
                    Clear completed
                </button>
            )}
        if(props.data.length > 0) {
            footer = (
                <div className = "footer">
                    <div className = "footer__counter"> {props.count} items left</div>
                    <div className = "filters">
                        <button className = {classNames("footer__filter", {selected: props.nowShowing == "all"})}
                                value = "all"
                                onClick = {props.click}>
                            All
                        </button>
                        <button className = {classNames("footer__filter", {selected: props.nowShowing == "active"})}
                                value = "active"
                                onClick = {props.click}>
                            Active
                        </button>
                        <button className = {classNames("footer__filter", {selected: props.nowShowing == "completed"})}
                                value = "completed"
                                onClick = {props.click}>
                            Completed
                        </button>
                    </div>
                    <div className = "clear-button_box">
                       {clearButton}
                    </div>
                </div>
            )
        }
        return (
            <div>
                {footer}
            </div>
        )
    }
});

var TodoApp = React.createClass({
    getInitialState: function() {
        return {
            input_value: "",
            count: 0,
            nowShowing: "all",
            checked: false,
            toggleAllChecked: false,
            DATA: []
        };
    },
    onKeyDownNewTodo: function(e) {
        if (e.keyCode == 13) {
            this.setState({
                input_value: "",
                count: active.length+1,
                DATA: this.state.DATA.concat([{
                    text: e.target.value,
                    completed: false
                }]),
                checked: false
            });
        }
    },
    toggleAll: function(e) {
        var data = this.state.DATA,
            findFalse = function(todo) {
            return !todo.completed;
            },
            findTrue = function(todo) {
            return todo.completed;
        },
        setTrue = function() {
            if(data.some(findFalse)) {
                data.map(function(todo) {
                    todo.completed = true;
                })
            }
            return data;
        },
            setFalse = function() {
                if(data.every(findTrue)) {
                    data.map(function(todo) {
                        todo.completed = false;
                    })
                }
                return data;
            };
        if(e.target.checked) {
            this.setState({
                toggleAllChecked: true,
                DATA: setTrue(),
                count: 0
            });
        } else {
            this.setState({
                toggleAllChecked: false,
                DATA: setFalse(),
                count: data.length
            });
        }
    },
    handlerChange: function(e) {
           this.setState({
                input_value: e.target.value
           })
    },
    onCheckChange: function(e) {
        var data = this.state.DATA,
            complete = function() {
                if (data[e.target.value].completed) {
                    return data[e.target.value].completed = false;
                } else {
                    return data[e.target.value].completed = true;
                }
            };
        if(e.target.checked) {
            this.setState({
                checked: true,
                count: active.length-1,
                todo: complete()
            });
            console.log(this.state.todo);
        } else {
            this.setState({
                checked: false,
                count: active.length+1,
                todo: complete()
            });
        }
        if(data.every(function(todo) {
                return todo.completed;
            })) {
            this.setState({
                toggleAllChecked: true
            })
        }
    },
    deleteItem: function(e) {
        var data = this.state.DATA.splice(e.target.value, 1);
        this.setState({
            DATA: this.state.DATA,
            count: active.length-1
        });
    },
    clearCompleted: function() {
        var data = this.state.DATA.filter(function(todo) {
            return !todo.completed;
        });
        this.setState({
            DATA: data,
            toggleAllChecked: false
        })
    },
    tabs: function(e) {
        var value = e.target.value;
    if(value == "active") {
        this.setState({
            nowShowing: "active"
        });
    } else if(value == "completed") {
        this.setState({
            nowShowing: "completed"
        });
    } else {
        this.setState({
            nowShowing: "all"
        });
    }
},
    render: function() {
        return (
            <div className = "todo_app">
                <Header change = {this.handlerChange}
                        press = {this.onKeyDownNewTodo}
                        toggleAll = {this.toggleAll}
                        checked = {this.state.toggleAllChecked}
                        value = {this.state.input_value}
                    />
                <TodoList click = {this.deleteItem}
                          change = {this.onCheckChange}
                          nowShowing = {this.state.nowShowing}
                          data = {this.state.DATA}
                    />
                <Footer count = {this.state.count}
                        click = {this.tabs}
                        clearClick = {this.clearCompleted}
                        nowShowing = {this.state.nowShowing}
                        data = {this.state.DATA}
                    />
            </div>
        )
    }
});

ReactDOM.render(
    <TodoApp />,
    document.getElementsByClassName("todo_box")[0]
);
