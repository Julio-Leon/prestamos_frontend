import { useState } from 'react'
import './CreatePrestamo.css'

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
    paymentDates: []
}



const yearlyDatesForPayments = [
    ['January 15th', 'January 30th'],
    ['February 15th', (new Date().getFullYear() % 4 === 0) || ((new Date().getFullYear() % 100 === 0) && (new Date().getFullYear() % 400 === 0)) ? 'February 29th' : 'February 28th'],
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

    const calculatePaymentDates = (numOfPayments, paySch, start) => {
        let counter = 0
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

        console.log(paySch)

        let biWeeklyCounter = startDateIdx[1]

        while (counter < numOfPayments) {
            if (paySch === 'Bi-Weekly') {
                payments.push(yearlyDatesForPayments[i][biWeeklyCounter])
                if (biWeeklyCounter === 1) {
                    if (i === 11) {
                        i = 0
                    } else {
                        i++
                    }
                    biWeeklyCounter = 0
                } else {
                    biWeeklyCounter = 1
                }
            } else {
                payments.push(yearlyDatesForPayments[i][startDateIdx[1]])
                if (i === 11) {
                    i = 0
                } else {
                    i++
                }
            }
            counter++
        }
        setFormState({
            ...formState,
            paymentDates: [...payments]
        })
        console.log(payments)
    }

    const calculateAmountPerPayment = (numOfPayments, paySch, total) => {
        const interestRate = paySch === 'Monthly' ? 10 : 5

        const topOfEquation = Math.pow((1 + interestRate), numOfPayments) * interestRate
        const bottomOfEquation = Math.pow((1 + interestRate), numOfPayments) - 1

        const amountPerPayment = (total * topOfEquation) / bottomOfEquation

        console.log(amountPerPayment)

        console.log(total, topOfEquation, bottomOfEquation)

        return amountPerPayment
    }

    const handleChange = (e) => {

        if (formState.amountOfPayments !== '' && formState.paymentSchedule !== '') {
            setFormState({
                ...formState,
                startDate: `${new Date().getMonth()}/${new Date().getDate()}`
            })
            console.log(`${new Date().getMonth()}/${new Date().getDate()}`)
            calculatePaymentDates(Number(formState.amountOfPayments), formState.paymentSchedule, `${new Date().getMonth()}/${new Date().getDate()}`)
            if (formState.prestamoAmount) {
                setFormState({
                    ...formState,
                    amountPerPayments: calculateAmountPerPayment(Number(formState.amountOfPayments), formState.paymentSchedule, Number(formState.prestamoAmount))
                })
            }
        }

        e.preventDefault()
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        })
        console.log(formState)
    }   

    // console.log(new Date().getFullYear())

    const handleSubmit = (e) => {
        e.preventDefault()
        calculatePaymentDates(Number(formState.numOfPayments), formState.paymentSchedule, `${new Date().getMonth()}/${new Date().getDate()}`)
        return
    }

    return (
        <div className="create-prestamo-container flex-container">
            <form onSubmit={handleSubmit} className='client-form flex-container'>
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
                <div className='amount-of-payments flex-container'>
                    <label htmlFor="amountOfPayments">Number Of Payments: </label>
                    <input type="text" name="amountOfPayments" onChange={handleChange} value={formState.amountOfPayments}/>
                </div>
                <div>
                    <label htmlFor="prestamoAmount">Prestamo Amount: </label>
                    <input type="text" name="prestamoAmount" onChange={handleChange} value={formState.prestamoAmount}/>
                </div>
                <input type="submit" value="Create" />
            </form>
            <div className="prestamo-client-info">
                <div>First Name</div>
                <div>Last Name</div>
                <div>Amount Per Payment: {formState.prestamoAmount !== '' ? formState.amountPerPayments : 'Need more information'}</div>
                <div>start date : TODAY</div>
                <div>end date : calculate depending on payment schedule and amount</div>
                <div>Interest to pay</div>
                <div>Total to pay</div>
            </div>
        </div>
    )
}

export default CreatePrestamo