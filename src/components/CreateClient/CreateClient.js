import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateClient.css'
import API_CONFIG from '../../config/api'

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
    recommendation: "" // Changed from recommendedBy to match backend
}

const CreateClient = ({ onDataChange, NEW_CLIENT_PATH, NEW_PRESTAMO_PATH }) => {
    const [formState, setFormState] = useState(defaultFormState)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        e.preventDefault()
        setError('') // Clear error when user starts typing
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        })
    }

    const validateForm = () => {
        const requiredFields = ['cedula', 'firstName', 'lastName']
        for (let field of requiredFields) {
            if (!formState[field].trim()) {
                return `El campo ${field === 'cedula' ? 'Cédula' : field === 'firstName' ? 'Nombre' : 'Apellido'} es obligatorio`
            }
        }
        
        // Validate cedula format (basic validation)
        if (formState.cedula.length < 8) {
            return 'La cédula debe tener al menos 8 caracteres'
        }
        
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validate form
        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }

        setLoading(true)
        setError('')
        
        const CREATE_CLIENT_ENDPOINT = API_CONFIG.CLIENTS_URL // Use centralized API config
        
        // Prepare data to match backend expectations
        const clientData = {
            ...formState,
            recommendedBy: formState.recommendation // Map recommendation to recommendedBy
        }
        
        try {
            const response = await fetch(CREATE_CLIENT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clientData)
            })
            
            if (response.ok) {
                const createdClient = await response.json()
                console.log('Cliente creado exitosamente:', createdClient)
                setSuccess(true)
                setFormState(defaultFormState)
                
                // Notify parent component to update sidebars
                if (onDataChange && typeof onDataChange === 'function') {
                    console.log('Notifying parent component of new client creation...');
                    onDataChange();
                }
                
                // Show success message for 2 seconds then redirect
                setTimeout(() => {
                    navigate('/clients')
                }, 2000)
            } else {
                const errorData = await response.json()
                setError(errorData.message || 'Error al crear el cliente')
            }
        } catch (error) {
            console.error('Error creating client:', error)
            setError('Error de conexión. Por favor, verifica que el servidor esté funcionando.')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setFormState(defaultFormState)
        setError('')
        setSuccess(false)
    }

    const handleViewClients = () => {
        navigate('/clients')
    }

    return (
        <div className="create-client-container modern-bg">
            {success ? (
                <div className="success-container">
                    <div className="success-icon">✅</div>
                    <h2 className="success-title">¡Cliente Creado Exitosamente!</h2>
                    <p className="success-message">
                        El cliente <strong>{formState.firstName} {formState.lastName}</strong> ha sido agregado al sistema.
                    </p>
                    <div className="success-actions">
                        <button onClick={handleViewClients} className="view-clients-btn">
                            Ver Todos los Clientes
                        </button>
                        <button onClick={() => setSuccess(false)} className="create-another-btn">
                            Crear Otro Cliente
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="client-form responsive-form">
                    <div className="form-header">
                        <h2 className="form-title">Crear Nuevo Cliente</h2>
                        <p className="form-subtitle">Complete la información del cliente</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    {/* Required fields section */}
                    <div className="form-section">
                        <h3 className="section-title">Información Personal <span className="required-indicator">*Requerido</span></h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cedula">Cédula *</label>
                                <input 
                                    className={`input-field ${error && !formState.cedula ? 'input-error' : ''}`}
                                    type="text" 
                                    name="cedula" 
                                    onChange={handleChange} 
                                    value={formState.cedula} 
                                    placeholder="00000000000"
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstName">Nombre *</label>
                                <input 
                                    className={`input-field ${error && !formState.firstName ? 'input-error' : ''}`}
                                    type="text" 
                                    name="firstName" 
                                    onChange={handleChange} 
                                    value={formState.firstName} 
                                    placeholder="Nombre"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="lastName">Apellido *</label>
                                <input 
                                    className={`input-field ${error && !formState.lastName ? 'input-error' : ''}`}
                                    type="text" 
                                    name="lastName" 
                                    onChange={handleChange} 
                                    value={formState.lastName} 
                                    placeholder="Apellido"
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="department">Institución</label>
                                <input 
                                    className="input-field" 
                                    type="text" 
                                    name="department" 
                                    onChange={handleChange} 
                                    value={formState.department} 
                                    placeholder="Lugar de trabajo"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="form-section">
                        <h3 className="section-title">Información de Contacto</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="telephoneNumber">Teléfono</label>
                                <input 
                                    className="input-field" 
                                    type="tel" 
                                    name="telephoneNumber" 
                                    onChange={handleChange} 
                                    value={formState.telephoneNumber} 
                                    placeholder="809-000-0000"
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="celularNumber">Celular</label>
                                <input 
                                    className="input-field" 
                                    type="tel" 
                                    name="celularNumber" 
                                    onChange={handleChange} 
                                    value={formState.celularNumber} 
                                    placeholder="829-000-0000"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="form-section">
                        <h3 className="section-title">Información de Dirección</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="street">Calle</label>
                                <input 
                                    className="input-field" 
                                    type="text" 
                                    name="street" 
                                    onChange={handleChange} 
                                    value={formState.street} 
                                    placeholder="Nombre de la calle"
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="number">Número</label>
                                <input 
                                    className="input-field" 
                                    type="text" 
                                    name="number" 
                                    onChange={handleChange} 
                                    value={formState.number} 
                                    placeholder="No."
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apartment">Apartamento</label>
                                <input 
                                    className="input-field" 
                                    type="text" 
                                    name="apartment" 
                                    onChange={handleChange} 
                                    value={formState.apartment} 
                                    placeholder="Apt. (Opcional)"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="county">Municipio</label>
                                <input 
                                    className="input-field" 
                                    type="text" 
                                    name="county" 
                                    onChange={handleChange} 
                                    value={formState.county} 
                                    placeholder="Municipio"
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="state">Provincia</label>
                                <input 
                                    className="input-field" 
                                    type="text" 
                                    name="state" 
                                    onChange={handleChange} 
                                    value={formState.state} 
                                    placeholder="Provincia"
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="zipCode">Código Postal</label>
                                <input 
                                    className="input-field" 
                                    type="text" 
                                    name="zipCode" 
                                    onChange={handleChange} 
                                    value={formState.zipCode} 
                                    placeholder="00000"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="form-section">
                        <h3 className="section-title">Información Adicional</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="recommendation">Recomendación</label>
                                <textarea 
                                    className="input-field textarea-field" 
                                    name="recommendation" 
                                    onChange={handleChange} 
                                    value={formState.recommendation} 
                                    placeholder="Recomendado por o notas adicionales..."
                                    rows="3"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={handleCancel} 
                            className="cancel-btn"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    Creando...
                                </>
                            ) : (
                                'Crear Cliente'
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default CreateClient;