import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Filter component
const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with{' '}
    <input value={filter} onChange={handleFilterChange} />
  </div>
)

// PersonForm component
const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange
}) => (
  <form onSubmit={addPerson}>
    <div>
      name:{' '}
      <input
        value={newName}
        onChange={handleNameChange}
      />
    </div>
    <div>
      number:{' '}
      <input
        value={newNumber}
        onChange={handleNumberChange}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

// Persons component
const Persons = ({ personsToShow }) => (
  <div>
    {personsToShow.map(person => (
      <p key={person.id}>
        {person.name} {person.number}
      </p>
    ))}
  </div>
)

// App (root) component
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  // Fetch data from server when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        // response.data is the array of persons from db.json
        setPersons(response.data)
      })
  }, [])

  // Handler for adding a new person
  const addPerson = (event) => {
    event.preventDefault()

    // Check if the name already exists
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber,
      // The server will generate an id automatically if you use a POST request later,
      // but for now we can just keep this as a placeholder if needed.
    }

    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  // Handlers for controlled inputs
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  // Filter the persons based on the filter string
  const personsToShow = filter === ''
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App
