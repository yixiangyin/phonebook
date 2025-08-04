import { useState } from "react"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import { useEffect } from "react"
import personService from "./services/persons"
import Notification from "./components/Notification"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")
  const [notification, setNotification] = useState({ message: null })

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const removePerson = (person) => {
    const ok = window.confirm(`Delete ${person.name} ?`)
    if (ok) {
      personService.remove(person.id).then(() => {
        setPersons(persons.filter((p) => p.id !== person.id))
        notifyWith(`Deleted ${person.name}`)
      })
    }
  }

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const clearForm = () => {
    setNewName("")
    setNewNumber("")
  }

  const updatePerson = (person) => {
    const ok = window.confirm(
      `${newName} is already added to phonebook, replace the old number with a new one?`
    )
    if (ok) {
      personService
        .update({ ...person, number: newNumber })
        .then((updatedPerson) => {
          setPersons(
            persons.map((p) => (person.id === p.id ? updatedPerson : p))
          )
          notifyWith(`Changed ${person.name}'s number`)
          clearForm()
        })
        .catch((error) => {
          if (error.status === 400) {
            notifyWith(error.response.data.error, true)
          } else if (error.status === 404) {
            notifyWith(
              `Information of ${person.name} has already been removed from server`,
              true
            )
            setPersons(persons.filter((p) => p.name !== person.name))
          }
        })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson) {
      updatePerson(existingPerson)
      return
    }
    const personObject = {
      name: newName,
      number: newNumber,
    }
    personService
      .create(personObject)
      .then((createdPerson) => {
        setPersons(persons.concat(createdPerson))
        notifyWith(`Added ${createdPerson.name}`)
        clearForm()
      })
      .catch((error) => {
        notifyWith(error.response.data.error, true)
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notification.message}
        isError={notification.isError}
      />
      <Filter filter={filter} setFilter={setFilter} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />
      <h2>Numbers</h2>
      {personsToShow.length === 0 && <p>No matching entries</p>}
      <Persons personsToShow={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App
