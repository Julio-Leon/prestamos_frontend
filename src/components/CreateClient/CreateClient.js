import { useState } from 'react'
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
        <div className="create-client-container modern-bg">
            <form onSubmit={handleSubmit} className="client-form responsive-form">
                <h2 className="form-title">Crear Nuevo Cliente</h2>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="cedula">Cédula</label>
                        <input className="input-field" type="text" name="cedula" onChange={handleChange} value={formState.cedula} placeholder="00000000000"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">Nombre</label>
                        <input className="input-field" type="text" name="firstName" onChange={handleChange} value={formState.firstName} placeholder="Nombre"/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="lastName">Apellido</label>
                        <input className="input-field" type="text" name="lastName" onChange={handleChange} value={formState.lastName} placeholder="Apellido"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="department">Institución</label>
                        <input className="input-field" type="text" name="department" onChange={handleChange} value={formState.department} placeholder="Institución"/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="telephoneNumber">Teléfono</label>
                        <input className="input-field" type="text" name="telephoneNumber" onChange={handleChange} value={formState.telephoneNumber} placeholder="Teléfono"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="celularNumber">Celular</label>
                        <input className="input-field" type="text" name="celularNumber" onChange={handleChange} value={formState.celularNumber} placeholder="Celular"/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="number">No. Calle</label>
                        <input className="input-field" type="text" name="number" onChange={handleChange} value={formState.number} placeholder="No."/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="street">Calle</label>
                        <input className="input-field" type="text" name="street" onChange={handleChange} value={formState.street} placeholder="Calle"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="apartment">Apartamento (Opcional)</label>
                        <input className="input-field" type="text" name="apartment" onChange={handleChange} value={formState.apartment} placeholder="Apt."/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="county">Municipio</label>
                        <input className="input-field" type="text" name="county" onChange={handleChange} value={formState.county} placeholder="Municipio"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="state">Provincia</label>
                        <input className="input-field" type="text" name="state" onChange={handleChange} value={formState.state} placeholder="Provincia"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="zipCode">Código Postal</label>
                        <input className="input-field" type="text" name="zipCode" onChange={handleChange} value={formState.zipCode} placeholder="Código Postal"/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="recommendedBy">Recomendado Por</label>
                        <input className="input-field" type="text" name="recommendedBy" onChange={handleChange} value={formState.recommendedBy} placeholder="Recomendado por"/>
                    </div>
                </div>
                <div className="form-row">
                    <button className="submit-btn" type="submit">Crear</button>
                </div>
            </form>
        </div>
    )
}

export default CreateClient;