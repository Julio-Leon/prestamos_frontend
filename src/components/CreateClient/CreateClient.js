import { useState } from 'react'
import Navbar from '../Navbar/Navbar'

import './CreateClient.css'

const defaultFormState = {
    cedula: "",
    firstName: "",
    lastName: "",
    department: "",
    telephoneNumber: "",
    celularNumber: "",
    number: "",
    street: "",
    apartment: "",
    county: "",
    state: "",
    zipCode: "",
    recommendedBy: ""
}
const CreateClient = ({ NEW_CLIENT_PATH, NEW_PRESTAMO_PATH }) => {

    const [formState, setFormState] = useState(defaultFormState)

    const handleChange = (e) => {
        e.preventDefault()
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        })
        console.log(formState)
    }    

    const handleSubmit = async (e) => {
        e.preventDefault()
        const CREATE_CLIENT_ENDPOINT = (process.env.BACKEND_STRING || 'http://localhost:4000/') + 'clients'
        try {
            const response = await fetch(CREATE_CLIENT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formState)
            })
            console.log(response)
        } catch (error) {
            console.error(error)
        }
        setFormState(defaultFormState)
    }

    return (
        <div className="create-client-container">
            <form onSubmit={handleSubmit} className='client-form flex-container'>
                <div>
                    <label htmlFor="cedula">Cedula: </label>
                    <input type="text" name="cedula" onChange={handleChange} value={formState.cedula}/>
                </div>
                <div>
                    <label htmlFor="firstName">First Name: </label>
                    <input type="text" name="firstName" onChange={handleChange} value={formState.firstName}/>
                </div>
                <div>
                    <label htmlFor="lastName">Last Name: </label>
                    <input type="text" name="lastName" onChange={handleChange} value={formState.lastName}/>
                </div>
                <div>
                    <label htmlFor="department">Institucion: </label>
                    <input type="text" name="department" onChange={handleChange} value={formState.department}/>
                </div>
                <div>
                    <label htmlFor="telephoneNumber">Telephone Number: </label>
                    <input type="text" name="telephoneNumber" onChange={handleChange} value={formState.telephoneNumber}/>
                </div>
                <div>
                    <label htmlFor="celularNumber">Celular Number: </label>
                    <input type="text" name="celularNumber" onChange={handleChange} value={formState.celularNumber}/>
                </div>
                <div className="form-address flex-container">
                    <label htmlFor="number">Street Number: </label>
                    <input type="text" name="number" onChange={handleChange} value={formState.number}/>
                    <label htmlFor="street">Street Name: </label>
                    <input type="text" name="street" onChange={handleChange} value={formState.street}/>
                    <label htmlFor="apartment">Apartment(Optional): </label>
                    <input type="text" name="apartment" onChange={handleChange} value={formState.apartment}/>
                </div>
                <div className="form-address flex-container">
                    <label htmlFor="county">County: </label>
                    <input type="text" name="county" onChange={handleChange} value={formState.county}/>
                    <label htmlFor="state">State: </label>
                    <input type="text" name="state" onChange={handleChange} value={formState.state}/>
                    <label htmlFor="zipCode">ZIPCODE: </label>
                    <input type="text" name="zipCode" onChange={handleChange} value={formState.zipCode}/>
                </div>
                <div>
                    <label htmlFor="recommendedBy">Recommended By: </label>
                    <input type="text" name="recommendedBy" onChange={handleChange} value={formState.recommendedBy}/>
                </div>
                <input type="submit" value="Create" />
            </form>
        </div>
    )
}

export default CreateClient