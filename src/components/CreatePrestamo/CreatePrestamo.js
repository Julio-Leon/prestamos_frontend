import { useEffect, useState } from 'react'
import './CreatePrestamo.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';



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

    const [formState, setFormState] = useState(defaultFormState)
    const [showGenQuote, setShowGenQuote] = useState(false)
    const [quoteCounter, setQuoteCounter] = useState(0)

    const [totalInterest, setTotalInterest] = useState(false)
    const [totalPay, setTotalPay] = useState(false)

    const [clientInfo, setClientInfo] = useState(false)

    const calculatePaymentDates = (numOfPayments, paySch, start) => {
        let counter = 0
        let yearPlus = 0
        const startArr = start.split('/')
        let month = Number(startArr[0])
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

        let biWeeklyCounter = startDateIdx[1]

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

        const interestRate = paySch === 'Monthly' ? 0.1 : 0.05

        const topFirst = (1 + (interestRate / numOfPayments))
        const topSecond = Math.pow(topFirst, numOfPayments)
        const topFinal = topSecond * (interestRate / numOfPayments)

        const bottomFinal = topSecond - 1
        
        const equationFinal = topFinal / bottomFinal

        const newAmountPerPayment = (total * equationFinal)

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

        if (formState.cedula.length > 7) {
            const SHOW_CLIENT_ENDPOINT = (process.env.BACKEND_STRING || 'http://localhost:4000/') + `clients/${formState.cedula}`
            try {
                const response = await fetch(SHOW_CLIENT_ENDPOINT)
                const data = await response.json()
                console.log(data)
                if (response.status === 200) {
                    setClientInfo({
                        ...data
                    })
                } else {
                    console.log(response)
                }
            } catch (error) {
                console.error(error)
            }
        }

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

    const handleSubmit = (e) => {
        e.preventDefault()
        // calculatePaymentDates(Number(formState.numOfPayments), formState.paymentSchedule, `${new Date().getMonth()}/${new Date().getDate()}`)
        return
    }

    useEffect(() => {
        if (formState.prestamoAmount && formState.amountOfPayments && formState.paymentSchedule) {
            setShowGenQuote(true)
        } else {
            setShowGenQuote(false)
        }
    }, [formState, ])

    return (
        <div className="create-prestamo-container flex-container">
            {/* <form onSubmit={handleSubmit} className='client-form flex-container'>
                <div>
                    <label htmlFor="cedula">Cedula: </label>
                    <input type="text" name="cedula" onChange={handleChange} value={formState.cedula}/>
                </div>
                <div className='payment-schedule flex-container'>
                    <label htmlFor="paymentSchedule">Payment Schedule: </label>

                    <div className="payment-schedule-selections">
                        <label htmlFor="bi-weekly"></label>
                        <input type="button" id='bi-weekly' name="paymentSchedule" value="Bi-Weekly" onClick={handleChange}/>
                        <label htmlFor="monthly"></label>
                        <input type="button" id='monthly' name="paymentSchedule" value="Monthly" onClick={handleChange} />
                    </div>
                </div>
                <div>
                    <label htmlFor="prestamoAmount">Prestamo Amount: </label>
                    <input type="text" name="prestamoAmount" onBlur={handleBlur} onChange={handleChange} value={formState.prestamoAmount}/>
                </div>
                <div className='amount-of-payments flex-container'>
                    <label htmlFor="amountOfPayments">Number Of Payments: </label>
                    <input type="text" name="amountOfPayments" onBlur={handleBlur} onChange={handleChange} value={formState.amountOfPayments}/>

                    <input style={{display: showGenQuote ? 'flex' : 'none'}} type="button" value="Generate Quote" onClick={(e) => {
                        calculateAmountPerPayment(Number(formState.amountOfPayments), formState.paymentSchedule, Number(formState.prestamoAmount))
                    }} />
                </div>
                <input type="submit" value="Create" />
            </form> */}

            <Form>
                <Form.Group className="mb-3" >
                    <Form.Label>Cedula</Form.Label>
                    <Form.Control name="cedula" onBlur={handleBlur} onChange={handleChange} type="text" placeholder="00000000000" />
                    {/* <Form.Text className="text-muted">
                        Esta informacion es totalmente privada
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="payment-schedule mb-3" >
                    <Form.Label>Payment Schedule</Form.Label>
                    <Button name="paymentSchedule" value='Bi-Weekly' onClick={handleChange}>
                        Weekly
                    </Button>
                    <Button name="paymentSchedule" value='Monthly' onClick={handleChange}>
                        Monthly
                    </Button>
                </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label>Cantidad De Prestamo</Form.Label>
                    <Form.Control name="prestamoAmount" onBlur={handleBlur} onChange={handleChange} type="text" placeholder="1000" />
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label>Cantidad De Pagos</Form.Label>
                    <Form.Control name="amountOfPayments" onBlur={handleBlur} onChange={handleChange} type="text" placeholder="10" />
                </Form.Group>
                <Button onClick={(e) => {
                        e.preventDefault()
                        calculateAmountPerPayment(Number(formState.amountOfPayments), formState.paymentSchedule, Number(formState.prestamoAmount))
                    }} variant="primary" type="submit">
                    Crear Cuota
                </Button>
            </Form>

            <div className="prestamo-client-info">
                <div>First Name: {clientInfo && clientInfo.firstName}</div>
                <div>Last Name: {clientInfo && clientInfo.lastName}</div>
                <div>Amount Per Payment: {(formState.amountPerPayments ? formState.amountPerPayments : 'Quote not found')}</div>
                <div>start date : {new Date().getMonth()}/{new Date().getDate()}/{new Date().getFullYear()}</div>
                <div>end date : {formState.paymentDates ? `${formState.paymentDates[formState.paymentDates.length - 1][0]}/${formState.paymentDates[formState.paymentDates.length - 1][1]}/${formState.paymentDates[formState.paymentDates.length - 1][2]}` : 'No end date found'}</div>
                <div>Interest to pay: {totalInterest && totalInterest}</div>
                <div>Total to pay: {totalPay && totalPay}</div>
            </div>
        </div>
    )
}

export default CreatePrestamo


/// MAKE THE SEQUENCE HAPPEN IN ORDER, IF TOP CHANGES -> BOTTOM IS UPDATED