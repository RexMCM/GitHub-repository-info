/* eslint-disable import/no-named-as-default */
import React, { Component } from 'react'
import { FaGitAlt, FaPlus, FaSpinner } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Container from '../../components/Container'
import { Form, SubmitButton, List } from './styles'

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  }

  componentDidMount() {
    const repositories = localStorage.getItem('repositories')
    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) })
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories))
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value })
  }

  handleSubmit = async e => {
    e.preventDefault()
    this.setState({ loading: true })
    const { newRepo, repositories } = this.state
    const response = await axios.get(`https://api.github.com/repos/${newRepo}`)
    const data = {
      name: response.data.full_name,
    }

    this.setState({
      newRepo: '',
      repositories: [...repositories, data],
      loading: false,
    })
  }

  render() {
    const { newRepo, repositories, loading } = this.state
    return (
      <Container>
        <h1>
          <FaGitAlt />
          Repositorios
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar nova repositorio"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    )
  }
}
