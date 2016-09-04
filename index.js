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
        var props = this.props;

        return (
            <div className = {props.data.length > 0 ? "footer visible":"footer disable"}>
            <div className = "footer__counter"> {props.count} items left</div>
            <div className = "filters">
                <button className = "footer__filter" onClick = {props.click}>All</button>
                <button className = "footer__filter filter--active" onClick = {props.click}>Active</button>
                <button className = "footer__filter filter--completed" onClick = {props.click}>Complete</button>
            </div>
            <button className = {completed.length > 0 ? "footer__clear":"footer__clear footer__clear--none"}>Clear completed</button>
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
        } else {
            this.setState({
                checked: false,
                count: active.length+1,
                todo: complete()
            });
        }
    },
    deleteItem: function(e) {
        var data = this.state.DATA.splice(e.target.value, 1);
        this.setState({
            DATA: this.state.DATA,
            count: active.length-1
        });
    },
    tabs: function(e) {
    if(e.target.className == "footer__filter filter--active") {
        this.setState({
            nowShowing: "active"
        });
    } else if(e.target.className == "footer__filter filter--completed") {
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
                        value = {this.state.input_value}
                    />
                <TodoList click = {this.deleteItem}
                          change = {this.onCheckChange}
                          nowShowing = {this.state.nowShowing}
                          data = {this.state.DATA}
                    />
                <Footer count = {this.state.count}
                        click = {this.tabs}
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
