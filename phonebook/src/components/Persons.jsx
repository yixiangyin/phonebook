const Persons = (props) => {
  return props.personsToShow.map((person) => {
    return (
      <p key={person.name}>
        {person.name} {person.number}{" "}
        <button onClick={() => props.removePerson(person)}>delete</button>
      </p>
    );
  });
};

export default Persons;
