import React, { useState, useEffect } from 'react';
import api from '../api';
import './PersonList.css';

const Home = () => {
    const [persons, setPersons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editPerson, setEditPerson] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Fetching the list of persons
        api.get('/api/persons/')
            .then(response => setPersons(response.data))
            .catch(error => console.error('Error fetching persons:', error));
    }, []);

    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddPerson = () => {
        setEditPerson({
            name: '',
            email: '',
            phone_number: '',
            contact_type: '',
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEditPerson = (person) => {
        setEditPerson(person);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeletePerson = async (personId) => {
        try {
            await api.delete(`/api/persons/${personId}/`);
            setPersons(prevPersons => prevPersons.filter(person => person.id !== personId));
        } catch (error) {
            console.error('Error deleting person:', error);
        }
    };
    
    const handleCloseModal = () => {
        setEditPerson(null);
        setShowModal(false);
    };

    const handleSaveEdit = async () => {
        try {
            if (isEditing) {
                await api.put(`/api/persons/${editPerson.id}/`, editPerson);
                setPersons(prevPersons => prevPersons.map(person =>
                    person.id === editPerson.id ? editPerson : person
                ));
            } else {
                const response = await api.post('/api/persons/', editPerson);
                setPersons(prevPersons => [...prevPersons, response.data]);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error saving/editing person:', error);
        }
    };
    

    return (
        <div className="person-list-container">
            <h1 className="heading">Contact Management</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search persons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <button className="add-button" onClick={handleAddPerson}>
                Add contact
            </button>
            <ul className="person-list">
                {filteredPersons.map(person => (
                    <li key={person.id} className="person-item">
                        <div className="person-info">
                            <h3 className="person-name">{person.name}</h3>
                            <p className="person-email">Email: {person.email}</p>
                            <p className="person-phone">Phone: {person.phone_number}</p>
                            <p className="person-contact-type">Contact Type: {person.contact_type}</p>
                            <button className="edit-button" onClick={() => handleEditPerson(person)}>
                                Edit
                            </button>
                            <button className="delete-button" onClick={() => handleDeletePerson(person.id)}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Edit Person' : 'Add Person'}</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={editPerson?.name || ''}
                            onChange={(e) => setEditPerson({ ...editPerson, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            value={editPerson?.email || ''}
                            onChange={(e) => setEditPerson({ ...editPerson, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={editPerson?.phone_number || ''}
                            onChange={(e) => setEditPerson({ ...editPerson, phone_number: e.target.value })}
                        />
                        <select
                            value={editPerson?.contact_type || ''}
                            onChange={(e) => setEditPerson({ ...editPerson, contact_type: e.target.value })}
                        >
                            <option value="">Select Contact Type</option>
                            <option value="P">Personal</option>
                            <option value="W">Work</option>
                            <option value="O">Other</option>
                        </select>
                        <button onClick={handleSaveEdit}>
                            {isEditing ? 'Save Changes' : 'Add Person'}
                        </button>
                        <button onClick={handleCloseModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;