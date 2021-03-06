import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';

import PageHeader from '../template/pageHeader'
import TodoForm from './todoForm';
import TodoList from './todoList';

const URL = 'http://localhost:3003/api/todos';

export default class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = { description: '', list: [] }
        this.handleAdd = this.handleAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleMarkAsDone = this.handleMarkAsDone.bind(this);
        this.handleMarkAsPending = this.handleMarkAsPending.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleClear = this.handleClear.bind(this);
    }

    componentWillMount() {
        this.refresh();
    }

    refresh(description = '') {
        const search = description ? `&description__regex=/${description}/` : '';
        axios.get(`${URL}?sort=-createdAt${search}`).then((resp => {
            this.setState({ description, list: resp.data });
        }));
    }

    handleAdd() {
        const description = this.state.description;
        axios.post(URL, { description }).then(() => {
            this.refresh();
        });
    }

    handleChange(e) {
        this.setState({description: e.target.value });
    }

    handleRemove(todo) {
        axios.delete(`${URL}/${todo._id}`).then(() => {
            this.refresh(this.state.description);
        })
    }

    handleMarkAsDone(todo) {
        axios.put(`${URL}/${todo._id}`, { ...todo, done: true }).then(() => { this.refresh(this.state.description) })
    }

    handleMarkAsPending(todo) {
        axios.put(`${URL}/${todo._id}`, { ...todo, done: false }).then(() => { this.refresh(this.state.description) })
    }

    handleSearch() {
        this.refresh(this.state.description);
    }

    handleClear() {
        this.refresh();
    }

    render() {
        return (
            <div>
                <PageHeader name='Tarefas' small='Cadastro'></PageHeader>
                <TodoForm />
                <TodoList />
            </div>
        )
    }
}
