import { useEffect, useState } from 'react'
import './CreatePrestamo.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
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
    amountPerPayments: "",
    paymentDates: ''
}



const yearlyDatesForPayments = [
    ['January 15th', 'January 30th'],
    ['February 15th', (new Date().getFullYear() % 4 === 0) || ((new Date().getFullYear() % 100 === 0) && (new Date().getFullYear() % 400 === 0)) ? 29 : 28],
    ['March 15th', 'March 30th'],
    ['April 15th', 'April 30th'],
    ['May 15th', 'May 30th'],
    ['June 15th', 'June 30th'],
    ['July 15th', 'July 30th'],
    ['August 15th', 'August 30th'],
    ['September 15th', 'September 30th'],
    ['October 15th', 'October 30th'],
    ['November 15th', 'November 30th'],
    ['December 15th', 'December 30th']
]

const CreatePrestamo = () => {

    const [allClientsInfo, setAllClientsInfo] = useState(false) 

    const [paymentDatesFull, setPaymentDatesFull] = useState(false)

    const [startDate, setStartDate] = useState(new Date());

    const [currentInterestRate, setCurrentInterestRate] = useState(null)

    const [formState, setFormState] = useState(defaultFormState)
    const [showGenQuote] = useState(false)

    const [totalInterest, setTotalInterest] = useState(false)
    const [totalPay, setTotalPay] = useState(false)

    const [clientInfo, setClientInfo] = useState(false)

    const [show, setShow] = useState(false);

    const calculatePaymentDates = (numOfPayments, paySch, start) => {

        let newStart = '/' + String(start).split(' ')[2] + '/' + String(start).split(' ')[3]
        
        let monthTempTemp = String(start).split(' ')[1]

        console.log(monthTempTemp)
        if (monthTempTemp === 'Jan') {
            monthTempTemp = 1
        }
        else if (monthTempTemp === 'Feb') {
            monthTempTemp = 2
        }
        else if (monthTempTemp === 'Mar') {
            monthTempTemp = 3
        }
        else if (monthTempTemp === 'Apr') {
            monthTempTemp = 4
        }
        else if (monthTempTemp === 'May') {
            monthTempTemp = 5
        }
        else if (monthTempTemp === 'Jun') {
            monthTempTemp = 6
        }
        else if (monthTempTemp === 'Jul') {
            monthTempTemp = 7
        }
        else if (monthTempTemp === 'Aug') {
            monthTempTemp = 8
        }
        else if (monthTempTemp === 'Sep') {
            monthTempTemp = 9
        }
        else if (monthTempTemp === 'Oct') {
            monthTempTemp = 10
        }
        else if (monthTempTemp === 'Nov') {
            monthTempTemp = 11
        }
        else if (monthTempTemp === 'Dec') {
            monthTempTemp = 12
        }

        newStart = monthTempTemp + newStart

        console.log(newStart)

        let counter = 0
        let yearPlus = 0
        const startArr = newStart.split('/')
        let month = Number(startArr[0] - 1)
        let day = Number(startArr[1])

        let startDateIdx = [month]

        if (day > 15) {
            startDateIdx[1] = 1
        } else {
            startDateIdx[1] = 0
        }

        let i = month

        // console.log(startDateIdx)

        const payments = []

        // console.log(paySch)

        let biWeeklyCounter = startDateIdx[0]

        while (counter < numOfPayments) {
            if (paySch === 'Bi-Weekly') {
                if (biWeeklyCounter === 1) {
                    if (i === 11) {
                        i = 0
                        yearPlus++
                    } else {
                        i++
                    }
                    biWeeklyCounter = 0
                } else {
                    biWeeklyCounter = 1
                }
                // console.log('I:', i)
                payments.push([i + 1, i===1 && biWeeklyCounter===1 ? (new Date().getFullYear() % 4 === 0) || ((new Date().getFullYear() % 100 === 0) && (new Date().getFullYear() % 400 === 0)) ? 29 : 28 : biWeeklyCounter === 0 ? 15 : 30, new Date().getFullYear() + yearPlus])
            } else {
                if (i === 11) {
                    i = 0
                    yearPlus++
                } else {
                    i++
                }
                payments.push([i + 1, 1, new Date().getFullYear() + yearPlus])
            }
            counter++
        }
        return payments
    }

    const calculateAmountPerPayment = (numOfPayments, paySch, total) => {
        // e.preventDefault()
        let interestRate
        if (currentInterestRate === null) {
            interestRate = paySch === 'Monthly' ? 0.1 : 0.05
            setCurrentInterestRate(interestRate)
        } else {
            interestRate = currentInterestRate
        }
        // console.log('AMOUNT PER PAYMENT CHECK:', numOfPayments)

        const topFirst = (1 + (interestRate / numOfPayments))
        const topSecond = Math.pow(topFirst, numOfPayments)
        const topFinal = topSecond * (interestRate / numOfPayments)

        // console.log('AMOUNT PER PAYMENT CHECK:', topFirst)

        const bottomFinal = topSecond - 1
        
        const equationFinal = topFinal / bottomFinal

        const newAmountPerPayment = (total * equationFinal)

        console.log(numOfPayments)

        // console.log(newAmountPerPayment)

        // console.log(total, topOfEquation, bottomOfEquation)
        // console.log(total, equationFinal)
        setFormState({
            ...formState,
            amountPerPayments: newAmountPerPayment.toFixed(2)
        })
    }


    // EACH INPUT SHOULD HAVE THEIR OWN HANDLE CHANGE AND HANDLE BLUR

    const handleBlur = async (e) => {

        // MAKE THIS HAPPEN FASTER /// FRONT-END INSTEAD OF BACKEND

        // if (formState.cedula.length > 7) {
        //     const SHOW_CLIENT_ENDPOINT = (process.env.BACKEND_STRING || 'http://localhost:4000/') + `clients/${formState.cedula}`
        //     try {
        //         const response = await fetch(SHOW_CLIENT_ENDPOINT)
        //         const data = await response.json()
        //         console.log(data)
        //         if (response.status === 200) {
        //             setClientInfo({
        //                 ...data
        //             })
        //         } else {
        //             console.log(response)
        //         }
        //     } catch (error) {
        //         console.error(error)
        //     }
        // }

        if (formState.amountOfPayments !== '' && formState.paymentSchedule !== '') {
            // console.log(`${new Date().getMonth()}/${new Date().getDate()}`)
            const tempDates = calculatePaymentDates(Number(formState.amountOfPayments), formState.paymentSchedule, `${new Date().getMonth()}/${new Date().getDate()}`)
            setFormState(prevForm => {
                return (
                    {
                        ...prevForm,
                        startDate: `${new Date().getMonth()}/${new Date().getDate()}/${new Date().getFullYear()}`,
                        paymentDates: [...tempDates]
                    }
                )
            })
        }

        if (formState.prestamoAmount && formState.paymentSchedule) {
            const total = Number(formState.prestamoAmount) * (formState.paymentSchedule === 'Bi-Weekly' ? 1.05 : 1.1)
            setTotalPay(total.toFixed(2))
            setTotalInterest((total - Number(formState.prestamoAmount)).toFixed(2))
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        })

        // console.log(formState)
    }

    // console.log(new Date().getFullYear())

    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     // calculatePaymentDates(Number(formState.numOfPayments), formState.paymentSchedule, `${new Date().getMonth()}/${new Date().getDate()}`)
    //     return
    // }

    useEffect(() => {
        calculateQuote(formState.amountOfPayments, formState.paymentSchedule, formState.prestamoAmount)
    }, [formState.amountOfPayments, formState.paymentSchedule, formState.prestamoAmount])

    useEffect(() => {
        if (formState.amountOfPayments && formState.paymentSchedule && startDate) {
            setPaymentDatesFull(calculatePaymentDates(formState.amountOfPayments, formState.paymentSchedule, startDate))
        }
    }, [startDate, formState.amountOfPayments, formState.paymentSchedule])

    const getAllClientsInfo = async () => {
        try {
            const All_CLIENT_ENDPOINT = (process.env.BACKEND_STRING || 'http://localhost:4000/') + `clients/`
            const response = await fetch(All_CLIENT_ENDPOINT)
            const data = await response.json()
            setAllClientsInfo(data)
            // console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllClientsInfo()
    }, [])


    // Add the default parameters
    const calculateQuote = (amountOfPayments=formState.amountOfPayments, paymentSchedule=formState.paymentSchedule, prestamoAmount=formState.prestamoAmount) => {

        // console.log(formState)

        const total = Number(prestamoAmount) * (paymentSchedule === 'Bi-Weekly' ? 1.05 : 1.1)
        setTotalPay(total)
        const interest = (total - Number(prestamoAmount)).toFixed(2)
        setTotalInterest(interest)
        const tempFormState = {
            ...formState,
            'totalToPay': total,
            'interestEarn': interest
        }
        setFormState(tempFormState)
        /// calculatePaymentDates
        calculatePaymentDates(Number(amountOfPayments), paymentSchedule, formState.startDate)

        /// calculateAmountPerPayments
        calculateAmountPerPayment(Number(amountOfPayments), paymentSchedule, Number(total))

    }


    /// New Handle Change's ///

    const cedulaHandleChange = e => {

        const tempFormState = {
            ...formState,
            'cedula': e.target.value
        }
        if(allClientsInfo.length > 1) setClientInfo(allClientsInfo.find((client) => client.cedula === e.target.value ));
        setFormState(tempFormState)
    }

    // TEST vvv TEST //

    const paymentScheduleHandleChange = e => {
        e.preventDefault()


        /// Set payment schedule

        // console.log('prestamo amunt: ' + formState.prestamoAmount + '\namount of payments: ' + formState.amountOfPayments)
        // console.log(formState)
        /// check if prestamo amount and amount of payments are there,
        if (formState.prestamoAmount && formState.amountOfPayments) {
             /// if they are, re calculate quote
             calculateQuote(formState.amountOfPayments, e.target.value, formState.prestamoAmount)
        }

        const tempFormState = {
            ...formState,
            'paymentSchedule': e.target.value
        }

        setCurrentInterestRate(e.target.value === 'Monthly' ? 10 : 5)
        setFormState(tempFormState)
    }

    const prestamoAmountHandleChange = e => {
        e.preventDefault()
        /// check if payment schedule and amount of payments are there, 
        if (formState.paymentSchedule && formState.amountOfPayments){
            // console.log('CHECK TWO', formState.amountOfPayments)
            /// if they are, re calculate quote
            calculateQuote(formState.amountOfPayments, formState.paymentSchedule, e.target.value)
        }

         /// Set prestamo amount
         const tempFormState = {
            ...formState,
            'prestamoAmount': e.target.value
        }
        setFormState(tempFormState)
        // console.log('CHECK TWO', Number(formState.amountOfPayments))
    }

    const amountOfPaymentsHandleChange = e => {
        e.preventDefault()
        /// Set amount of payments

        /// check if prestamo amount and payment schedule are there,
        if (formState.prestamoAmount && formState.paymentSchedule){ 
            /// if they are, re calculate quote
            calculateQuote(e.target.value, formState.paymentSchedule, formState.prestamoAmount)
        }

        const tempFormState = {
            ...formState,
            'amountOfPayments': e.target.value
        }

        // console.log(tempFormState)
        setFormState(tempFormState)
    }

    const interestRateHandleChange = e => {
        e.preventDefault()

        setCurrentInterestRate(e.target.value)
    }

    // TEST ^^^ TEST //

    /// LOADING SIGN ///
    if (allClientsInfo.length < 1) {
        return <div className="loader"></div>
    }
    return (
        <div className="create-prestamo-container modern-prestamo-bg">
            <form className="prestamo-form responsive-form">
                <h2 className="form-title">Crear Nuevo Préstamo</h2>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="cedula">Cédula</label>
                        <input className="input-field" name="cedula" onBlur={cedulaHandleChange} onChange={cedulaHandleChange} type="text" placeholder="00000000000" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="startDate">Fecha de Inicio</label>
                        <DatePicker className='date-picker input-field' selected={startDate} onChange={(date) => setStartDate(date)} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Payment Schedule</label>
                        <div className="payment-schedule-btns">
                            <button className='schedule-btn' name="paymentSchedule" value='Bi-Weekly' onClick={paymentScheduleHandleChange} type="button">Bi-Weekly</button>
                            <button className='schedule-btn' name="paymentSchedule" value='Monthly' onClick={paymentScheduleHandleChange} type="button">Monthly</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="prestamoAmount">Cantidad De Préstamo</label>
                        <input className="input-field" name="prestamoAmount" onBlur={prestamoAmountHandleChange} onChange={prestamoAmountHandleChange} type="text" placeholder="1000" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="amountOfPayments">Cantidad De Pagos</label>
                        <input className="input-field" name="amountOfPayments" onBlur={amountOfPaymentsHandleChange} onChange={amountOfPaymentsHandleChange} type="text" placeholder="10" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="interestRate">Interest Rate</label>
                        <input className="input-field" name="interestRate" onBlur={interestRateHandleChange} onChange={interestRateHandleChange} type="text" placeholder="No Interest Found" />
                    </div>
                </div>
                <div className="form-row">
                    <button className="submit-btn" onClick={(e) => {
                        e.preventDefault()
                        calculateAmountPerPayment(Number(formState.amountOfPayments), formState.paymentSchedule, Number(formState.prestamoAmount))
                    }} type="submit">
                        Crear Cuota
                    </button>
                    <button className="show-dates-btn" disabled={!paymentDatesFull} name="showDates" type="button" onClick={() => {setShow(true)}}>
                        Mostrar Fechas
                    </button>
                </div>
            </form>

            <div className="prestamo-summary">
                <div className="summary-item">First Name: {clientInfo && clientInfo.firstName}</div>
                <div className="summary-item">Last Name: {clientInfo && clientInfo.lastName}</div>
                <div className="summary-item">Amount Per Payment: {(formState.amountPerPayments === String(NaN) ? 'Quote not found' : formState.amountPerPayments)}</div>
                <div className="summary-item">Start date: {new Date().getMonth()}/{new Date().getDate()}/{new Date().getFullYear()}</div>
                <div className="summary-item">End date: {paymentDatesFull ? `${paymentDatesFull[paymentDatesFull.length - 1][0]}/${paymentDatesFull[paymentDatesFull.length - 1][1]}/${paymentDatesFull[paymentDatesFull.length - 1][2]}` : 'No end date found'}</div>
                <div className="summary-item">Interest to pay: {totalInterest && totalInterest}</div>
                <div className="summary-item">Total to pay: {totalPay && Number(totalPay).toFixed(2)}</div>
                <div className="summary-item">Interest Rate: {currentInterestRate}</div>
            </div>

            <Modal show={show} onHide={() => {setShow(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Payment Dates</Modal.Title>
                </Modal.Header>
                <div className="modal-dates-list">
                    {paymentDatesFull && paymentDatesFull.map((date, i) => (
                        <div className="modal-date-item" key={i}>{i+1}. {date[0]}/{date[1]}/{date[2]}</div>
                    ))}
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {setShow(false)}}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreatePrestamo

// Calculate quote when button is pressed


/// MAKE THE SEQUENCE HAPPEN IN ORDER, IF TOP CHANGES -> BOTTOM IS UPDATED