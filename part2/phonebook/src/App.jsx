import React, { useState, useEffect } from 'react'
import personsService from './services/persons'
import Notification from './components/Notification'
import './App.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => console.error('Error fetching persons:', error))
  }, [])

  const showNotification = (message) => {
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(
      p => p.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      if (window.confirm(
        `${existingPerson.name} is already added to the phonebook. Replace the old number with a new one?`
      )) {
        const changedPerson = { ...existingPerson, number: newNumber }
        personsService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            showNotification(`Updated ${returnedPerson.name}`)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.error('Error updating person:', error)
          })
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          showNotification(`Added ${returnedPerson.name}`)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.error('Error creating person:', error)
        })
    }
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .removePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          showNotification(`Deleted ${name}`)
        })
        .catch(error => {
          console.error(`Failed to delete ${name}`, error)
        })
    }
  }

  const personsToShow = filter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} />

      <div>
        Filter shown with{' '}
        <input 
          value={filter} 
          onChange={e => setFilter(e.target.value)} 
          placeholder="Enter name to filter" 
        />
      </div>

      <h3>Add a new</h3>
      <form onSubmit={addPerson}>
        <div>
          Name: <input 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)} 
                />
        </div>
        <div>
          Number: <input 
                    value={newNumber} 
                    onChange={e => setNewNumber(e.target.value)} 
                  />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h3>Numbers</h3>
      {personsToShow.map(person => (
        <div key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => handleDelete(person.id, person.name)}>
            delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default App
