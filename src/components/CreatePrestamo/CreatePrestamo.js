import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreatePrestamo.css'
import API_CONFIG from '../../config/api'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const defaultFormState = {
    cedula: "",
    paymentSchedule: "",
    prestamoAmount: "",
    startDate: "",
    endDate: "",
    totalToPay: "",
    interestEarn: "",
    amountOfPayments: "",
    amountPerPayment: "",
    paymentDates: []
}

// Interest rates (annual rates)
const INTEREST_RATES = {
    'Quincenal': 0.10,   // 10% annual for bi-weekly payments (quincenal)
    'Semanal': 0.05      // 5% annual for weekly payments (semanal)
}


const CreatePrestamo = ({ onDataChange }) => {
    const navigate = useNavigate()
    
    // Form state management
    const [formState, setFormState] = useState(defaultFormState)
    const [allClientsInfo, setAllClientsInfo] = useState([])
    const [clientInfo, setClientInfo] = useState(null)
    const [startDate, setStartDate] = useState(new Date())
    const [paymentDatesFull, setPaymentDatesFull] = useState([])
    
    // UI state management
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [calculating, setCalculating] = useState(false)
    const [show, setShow] = useState(false)
    
    // Form validation
    const [validationErrors, setValidationErrors] = useState({})
    
    // Modern loan calculation using amortization formula
    const calculateLoanDetails = useCallback((principal, annualRate, totalPayments, paymentFrequency) => {
        if (!principal || !annualRate || !totalPayments) return null
        
        // Convert annual rate to payment period rate
        const paymentsPerYear = paymentFrequency === 'Quincenal' ? 26 : 52 // 26 for bi-weekly, 52 for weekly
        const periodRate = annualRate / paymentsPerYear
        
        // Calculate monthly payment using amortization formula
        // PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
        const numerator = periodRate * Math.pow(1 + periodRate, totalPayments)
        const denominator = Math.pow(1 + periodRate, totalPayments) - 1
        const paymentAmount = principal * (numerator / denominator)
        
        // Calculate totals
        const totalToPay = paymentAmount * totalPayments
        const totalInterest = totalToPay - principal
        
        return {
            amountPerPayment: Math.round(paymentAmount * 100) / 100, // Round to 2 decimals
            totalToPay: Math.round(totalToPay * 100) / 100,
            interestEarn: Math.round(totalInterest * 100) / 100,
            effectiveRate: periodRate,
            paymentsPerYear
        }
    }, [])

    // Calculate payment dates with proper date handling
    const calculatePaymentDates = useCallback((numOfPayments, paymentSchedule, startDate) => {
        if (!numOfPayments || !paymentSchedule || !startDate) return []
        
        const dates = []
        const currentDate = new Date(startDate)
        
        for (let i = 0; i < numOfPayments; i++) {
            if (paymentSchedule === 'Quincenal') {
                currentDate.setDate(currentDate.getDate() + 14) // Every 14 days
            } else if (paymentSchedule === 'Semanal') {
                currentDate.setDate(currentDate.getDate() + 7)  // Every 7 days
            }
            
            dates.push(new Date(currentDate))
        }
        
        return dates
    }, [])

    // Validate form fields
    const validateForm = () => {
        const errors = {}
        
        if (!formState.cedula?.trim()) {
            errors.cedula = 'Cédula es requerida'
        }
        
        if (!formState.paymentSchedule) {
            errors.paymentSchedule = 'Seleccione frecuencia de pago'
        }
        
        const amount = parseFloat(formState.prestamoAmount)
        if (!amount || amount <= 0) {
            errors.prestamoAmount = 'Ingrese un monto válido mayor a 0'
        }
        
        const payments = parseInt(formState.amountOfPayments)
        if (!payments || payments <= 0 || payments > 60) {
            errors.amountOfPayments = 'Ingrese número de pagos entre 1 y 60'
        }
        
        if (!clientInfo) {
            errors.cedula = 'Cliente no encontrado con esta cédula'
        }
        
        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Recalculate loan details function
    const recalculateDetails = useCallback(() => {
        const principal = parseFloat(formState.prestamoAmount)
        const payments = parseInt(formState.amountOfPayments)
        
        // Check if we have all required values and they're valid
        if (!formState.prestamoAmount || !formState.paymentSchedule || !formState.amountOfPayments || 
            isNaN(principal) || principal <= 0 || isNaN(payments) || payments <= 0) {
            // Clear calculations
            setFormState(prev => ({
                ...prev,
                amountPerPayment: "",
                totalToPay: "",
                interestEarn: "",
                endDate: "",
                paymentDates: []
            }))
            setPaymentDatesFull([])
            console.log('Cleared calculations - invalid inputs')
            return
        }

        console.log('Starting recalculation with:', {
            principal,
            payments,
            paymentSchedule: formState.paymentSchedule,
            currentState: {
                amountPerPayment: formState.amountPerPayment,
                totalToPay: formState.totalToPay,
                interestEarn: formState.interestEarn
            }
        })

        const annualRate = INTEREST_RATES[formState.paymentSchedule]
        const calculation = calculateLoanDetails(principal, annualRate, payments, formState.paymentSchedule)
        
        if (calculation) {
            // Calculate payment dates
            const dates = calculatePaymentDates(payments, formState.paymentSchedule, startDate)
            setPaymentDatesFull(dates)
            
            const endDate = dates.length > 0 ? dates[dates.length - 1] : null
            
            console.log('Updating formState with new calculation:', {
                oldValues: {
                    amountPerPayment: formState.amountPerPayment,
                    totalToPay: formState.totalToPay,
                    interestEarn: formState.interestEarn
                },
                newValues: {
                    amountPerPayment: calculation.amountPerPayment,
                    totalToPay: calculation.totalToPay,
                    interestEarn: calculation.interestEarn
                }
            })
            
            // Force update using functional setState to ensure re-render
            setFormState(prev => {
                const newState = {
                    ...prev,
                    amountPerPayment: calculation.amountPerPayment,
                    totalToPay: calculation.totalToPay,
                    interestEarn: calculation.interestEarn,
                    endDate: endDate ? endDate.toISOString().split('T')[0] : "",
                    paymentDates: dates.map(date => date.toISOString().split('T')[0])
                }
                console.log('New formState will be:', newState)
                return newState
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formState.prestamoAmount, formState.paymentSchedule, formState.amountOfPayments, startDate, calculateLoanDetails, calculatePaymentDates])

    // Auto-calculate loan details when key fields change
    useEffect(() => {
        setCalculating(true)
        
        // Small delay to batch rapid changes
        const timeoutId = setTimeout(() => {
            recalculateDetails()
            setCalculating(false)
        }, 100)
        
        return () => clearTimeout(timeoutId)
    }, [recalculateDetails])

    // Update start date in form state
    useEffect(() => {
        const newStartDateString = startDate.toISOString().split('T')[0]
        setFormState(prev => {
            if (prev.startDate !== newStartDateString) {
                return {
                    ...prev,
                    startDate: newStartDateString
                }
            }
            return prev
        })
    }, [startDate])

    // Fetch all clients
    const getAllClientsInfo = async () => {
        try {
            const response = await fetch(API_CONFIG.CLIENTS_URL)
            if (!response.ok) throw new Error('Failed to fetch clients')
            const data = await response.json()
            setAllClientsInfo(data)
        } catch (error) {
            console.error('Error fetching clients:', error)
            setError('Error al cargar clientes')
        }
    }

    useEffect(() => {
        getAllClientsInfo()
    }, [])

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) return
        
        setLoading(true)
        setError('')
        
        try {
            const prestamoData = {
                cedula: formState.cedula,
                paymentSchedule: formState.paymentSchedule,
                prestamoAmount: parseFloat(formState.prestamoAmount),
                startDate: formState.startDate,
                endDate: formState.endDate,
                totalToPay: formState.totalToPay,
                interestEarn: formState.interestEarn,
                amountOfPayments: parseInt(formState.amountOfPayments),
                amountPerPayment: formState.amountPerPayment
            }
            
            const response = await fetch(API_CONFIG.PRESTAMOS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(prestamoData)
            })
            
            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(errorData || 'Error al crear préstamo')
            }
            
            const createdPrestamo = await response.json()
            console.log('Préstamo creado exitosamente:', createdPrestamo)
            setSuccess(true)
            
            // Notify parent component to update sidebars
            if (onDataChange && typeof onDataChange === 'function') {
                console.log('Notifying parent component of new prestamo creation...');
                onDataChange();
            }
        } catch (error) {
            console.error('Error creating prestamo:', error)
            setError(error.message || 'Error al crear el préstamo')
        } finally {
            setLoading(false)
        }
    }

    // Form field handlers
    const handleInputChange = (field, value) => {
        console.log(`Field ${field} changed to:`, value)
        
        setFormState(prev => ({
            ...prev,
            [field]: value
        }))
        
        // Clear validation errors for this field
        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
        
        // Find client when cedula changes
        if (field === 'cedula' && allClientsInfo.length > 0) {
            const client = allClientsInfo.find(client => client.cedula === value)
            setClientInfo(client || null)
        }
    }

    const resetForm = () => {
        setFormState(defaultFormState)
        setClientInfo(null)
        setStartDate(new Date())
        setPaymentDatesFull([])
        setValidationErrors({})
        setError('')
        setSuccess(false)
    }

    const createAnother = () => {
        resetForm()
    }

    const viewPrestamos = () => {
        navigate('/prestamos')
    }

    // Loading state for fetching clients
    if (allClientsInfo.length === 0) {
        return (
            <div className="create-prestamo-container modern-prestamo-bg">
                <div className="loader"></div>
            </div>
        )
    }

    // Success state
    if (success) {
        return (
            <div className="create-prestamo-container modern-prestamo-bg">
                <div className="success-container">
                    <div className="success-icon">✅</div>
                    <h2 className="success-title">¡Préstamo Creado Exitosamente!</h2>
                    <div className="success-details">
                        <p><strong>Cliente:</strong> {clientInfo?.firstName} {clientInfo?.lastName}</p>
                        <p><strong>Monto:</strong> ${formState.prestamoAmount}</p>
                        <p><strong>Total a Pagar:</strong> ${formState.totalToPay}</p>
                        <p><strong>Pago por Período:</strong> ${formState.amountPerPayment}</p>
                        <p><strong>Frecuencia:</strong> {formState.paymentSchedule === 'Quincenal' ? 'Quincenal' : 'Semanal'}</p>
                    </div>
                    <div className="success-actions">
                        <button 
                            className="view-prestamos-btn"
                            onClick={viewPrestamos}
                        >
                            Ver Préstamos
                        </button>
                        <button 
                            className="create-another-btn"
                            onClick={createAnother}
                        >
                            Crear Otro Préstamo
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="create-prestamo-container modern-prestamo-bg">
            <form className="prestamo-form" onSubmit={handleSubmit}>
                <h2 className="form-title">Crear Nuevo Préstamo</h2>
                <p className="form-subtitle">Complete los datos para calcular y crear el préstamo</p>

                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {/* Client Information Section */}
                <div className="form-section">
                    <h3 className="section-title">Información del Cliente</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="cedula">Cédula del Cliente</label>
                            <input 
                                id="cedula"
                                className={`input-field ${validationErrors.cedula ? 'error' : ''}`}
                                name="cedula" 
                                value={formState.cedula}
                                onChange={(e) => handleInputChange('cedula', e.target.value)}
                                type="text" 
                                placeholder="Ingrese la cédula del cliente" 
                                disabled={loading}
                            />
                            {validationErrors.cedula && (
                                <span className="field-error">{validationErrors.cedula}</span>
                            )}
                            {clientInfo && (
                                <div className="client-found">
                                    ✅ Cliente: {clientInfo.firstName} {clientInfo.lastName}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="startDate">Fecha de Inicio</label>
                            <DatePicker 
                                id="startDate"
                                className='date-picker input-field' 
                                selected={startDate} 
                                onChange={(date) => setStartDate(date || new Date())}
                                minDate={new Date()}
                                disabled={loading}
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                    </div>
                </div>

                {/* Loan Details Section */}
                <div className="form-section">
                    <h3 className="section-title">Detalles del Préstamo</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Frecuencia de Pago</label>
                            <div className="payment-schedule-btns">
                                <button 
                                    type="button"
                                    className={`schedule-btn ${formState.paymentSchedule === 'Quincenal' ? 'active' : ''}`}
                                    onClick={() => handleInputChange('paymentSchedule', 'Quincenal')}
                                    disabled={loading}
                                >
                                    Quincenal (10% anual)
                                </button>
                                <button 
                                    type="button"
                                    className={`schedule-btn ${formState.paymentSchedule === 'Semanal' ? 'active' : ''}`}
                                    onClick={() => handleInputChange('paymentSchedule', 'Semanal')}
                                    disabled={loading}
                                >
                                    Semanal (5% anual)
                                </button>
                            </div>
                            {validationErrors.paymentSchedule && (
                                <span className="field-error">{validationErrors.paymentSchedule}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="prestamoAmount">Monto del Préstamo ($)</label>
                            <input 
                                id="prestamoAmount"
                                className={`input-field ${validationErrors.prestamoAmount ? 'error' : ''}`}
                                name="prestamoAmount" 
                                value={formState.prestamoAmount}
                                onChange={(e) => handleInputChange('prestamoAmount', e.target.value)}
                                type="number" 
                                min="1"
                                step="0.01"
                                placeholder="Ej: 1000" 
                                disabled={loading}
                            />
                            {validationErrors.prestamoAmount && (
                                <span className="field-error">{validationErrors.prestamoAmount}</span>
                            )}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="amountOfPayments">Número de Pagos</label>
                            <input 
                                id="amountOfPayments"
                                className={`input-field ${validationErrors.amountOfPayments ? 'error' : ''}`}
                                name="amountOfPayments" 
                                value={formState.amountOfPayments}
                                onChange={(e) => handleInputChange('amountOfPayments', e.target.value)}
                                type="number" 
                                min="1"
                                max="60"
                                placeholder="Ej: 12" 
                                disabled={loading}
                            />
                            {validationErrors.amountOfPayments && (
                                <span className="field-error">{validationErrors.amountOfPayments}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Loan Summary Section */}
                {formState.amountPerPayment && !calculating && (
                    <div className="form-section calculation-section">
                        <h3 className="section-title">Resumen del Préstamo</h3>
                        <div className="calculation-grid">
                            <div className="calc-item">
                                <span className="calc-label">Pago por Período:</span>
                                <span className="calc-value">${formState.amountPerPayment}</span>
                            </div>
                            <div className="calc-item">
                                <span className="calc-label">Total a Pagar:</span>
                                <span className="calc-value">${formState.totalToPay}</span>
                            </div>
                            <div className="calc-item">
                                <span className="calc-label">Intereses Totales:</span>
                                <span className="calc-value">${formState.interestEarn}</span>
                            </div>
                            <div className="calc-item">
                                <span className="calc-label">Fecha de Finalización:</span>
                                <span className="calc-value">
                                    {paymentDatesFull.length > 0 
                                        ? paymentDatesFull[paymentDatesFull.length - 1].toLocaleDateString('es-ES')
                                        : 'Calculando...'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {calculating && (
                    <div className="calculation-loading">
                        <span>Calculando préstamo...</span>
                    </div>
                )}

                {/* Form Actions */}
                <div className="form-actions">
                    <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={resetForm}
                        disabled={loading}
                    >
                        Limpiar Formulario
                    </button>
                    <button 
                        type="button"
                        className="show-dates-btn" 
                        disabled={!paymentDatesFull.length || loading}
                        onClick={() => setShow(true)}
                    >
                        Ver Fechas de Pago
                    </button>
                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={loading || calculating || !formState.amountPerPayment}
                    >
                        {loading ? (
                            <>
                                Creando Préstamo...
                            </>
                        ) : (
                            'Crear Préstamo'
                        )}
                    </button>
                </div>
            </form>

            {/* Payment Dates Modal */}
            <Modal show={show} onHide={() => setShow(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Fechas de Pago del Préstamo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-dates-list">
                        <div className="dates-header">
                            <div className="dates-info">
                                <strong>Cliente:</strong> {clientInfo?.firstName} {clientInfo?.lastName}<br/>
                                <strong>Monto por Pago:</strong> ${formState.amountPerPayment}<br/>
                                <strong>Frecuencia:</strong> {formState.paymentSchedule === 'Quincenal' ? 'Quincenal' : 'Semanal'}
                            </div>
                        </div>
                        <div className="dates-grid">
                            {paymentDatesFull.map((date, i) => (
                                <div className="modal-date-item" key={i}>
                                    <span className="payment-number">Pago #{i + 1}</span>
                                    <span className="payment-date">{date.toLocaleDateString('es-ES')}</span>
                                    <span className="payment-amount">${formState.amountPerPayment}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreatePrestamo

// Calculate quote when button is pressed


/// MAKE THE SEQUENCE HAPPEN IN ORDER, IF TOP CHANGES -> BOTTOM IS UPDATED