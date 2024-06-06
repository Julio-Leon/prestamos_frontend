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

    const [formState, setFormState] = useState(defaultFormState)
    const [showGenQuote, setShowGenQuote] = useState(false)
    const [quoteCounter, setQuoteCounter] = useState(0)

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

        const interestRate = paySch === 'Monthly' ? 0.1 : 0.05

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
        if (formState.prestamoAmount && formState.amountOfPayments && formState.paymentSchedule) {
            setShowGenQuote(true)
        } else {
            setShowGenQuote(false)
        }

        
        // if (allClientsInfo.length > 0) {
        //     setClientInfo(allClientsInfo)
        // }
        calculateQuote(formState.amountOfPayments, formState.paymentSchedule, formState.prestamoAmount)

        // calculateAmountPerPayment(Number(formState.amountOfPayments), formState.paymentSchedule, Number(totalPay))

    }, [formState.amountOfPayments, formState.paymentSchedule, formState.prestamoAmount ])

    useEffect(() => {
        
        if (formState.amountOfPayments && formState.paymentSchedule && startDate) {
            setPaymentDatesFull(calculatePaymentDates(formState.amountOfPayments, formState.paymentSchedule, startDate))
        }

    }, [startDate, setStartDate, formState, setFormState])

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

    // TEST ^^^ TEST //

    /// LOADING SIGN ///
    if (allClientsInfo.length < 1) {
        return <div className="loader"></div>
    }
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
                    <Form.Control name="cedula" onBlur={cedulaHandleChange} onChange={cedulaHandleChange} type="text" placeholder="00000000000" />
                    {/* <Form.Text className="text-muted">
                        Esta informacion es totalmente privada
                    </Form.Text> */}
                </Form.Group>

                <div className="dates">
                    <DatePicker className='date-picker' selected={startDate} onChange={(date) => setStartDate(date)} />

                    <Button disabled={paymentDatesFull ? false : true} className='date-picker button-date mb-3' name="showDates" value='Show Dates' onClick={() => {setShow(true)}}>
                        Show Dates
                    </Button>
                </div>

                <Form.Group className="payment-schedule mb-3" >
                    <Form.Label>Payment Schedule</Form.Label>
                    <Button className='mb-3' name="paymentSchedule" value='Bi-Weekly' onClick={paymentScheduleHandleChange}>
                        Bi-Weekly
                    </Button>
                    <Button className='mb-3' name="paymentSchedule" value='Monthly' onClick={paymentScheduleHandleChange}>
                        Monthly
                    </Button>
                </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label>Cantidad De Prestamo</Form.Label>
                    <Form.Control name="prestamoAmount" onBlur={prestamoAmountHandleChange} onChange={prestamoAmountHandleChange} type="text" placeholder="1000" />
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label>Cantidad De Pagos</Form.Label>
                    <Form.Control name="amountOfPayments" onBlur={amountOfPaymentsHandleChange} onChange={amountOfPaymentsHandleChange} type="text" placeholder="10" />
                </Form.Group>
                <Button onClick={(e) => {
                        e.preventDefault()
                        calculateAmountPerPayment(Number(formState.amountOfPayments), formState.paymentSchedule, Number(formState.prestamoAmount))
                    }} variant="primary" type="submit">
                    Crear Cuota
                </Button>
            </Form>

            <ListGroup className='mb-3'>
                <ListGroup.Item variant="primary">First Name: {clientInfo && clientInfo.firstName}</ListGroup.Item>
                <ListGroup.Item variant="primary">Last Name: {clientInfo && clientInfo.lastName}</ListGroup.Item>
                <ListGroup.Item variant="primary">Amount Per Payment: {(formState.amountPerPayments === String(NaN) ? 'Quote not found' : formState.amountPerPayments)}</ListGroup.Item>
                <ListGroup.Item variant="primary">start date : {new Date().getMonth()}/{new Date().getDate()}/{new Date().getFullYear()}</ListGroup.Item>
                <ListGroup.Item variant="primary">end date : {paymentDatesFull ? `${paymentDatesFull[paymentDatesFull.length - 1][0]}/${paymentDatesFull[paymentDatesFull.length - 1][1]}/${paymentDatesFull[paymentDatesFull.length - 1][2]}` : 'No end date found'}</ListGroup.Item>
                <ListGroup.Item variant="primary">Interest to pay: {totalInterest && totalInterest}</ListGroup.Item>
                <ListGroup.Item variant="primary">Total to pay: {totalPay && Number(totalPay).toFixed(2)}</ListGroup.Item>
                <ListGroup.Item variant="primary">Interest Rate {formState.paymentSchedule === 'Monthly' ? '10%' : formState.paymentSchedule === 'Bi-Weekly' ? '5%' : 'No Payment Schedule Selected'}</ListGroup.Item>
            </ListGroup>

            <Modal show={show} onHide={() => {setShow(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Payment Dates</Modal.Title>
                </Modal.Header>
                {/* <div className="modal"> */}
                    <ListGroup className='mb-3'>
                        {/* <div className="modal"> */}
                            {paymentDatesFull && paymentDatesFull.map((date, i) => {
                                return <ListGroup.Item variant="dark">{i+1}. {date[0]}/{date[1]}/{date[2]}</ListGroup.Item>
                            })}
                        {/* </div> */}
                        {/* <ListGroup.Item variant="primary">First Name: {clientInfo && clientInfo.firstName}</ListGroup.Item> */}
                    </ListGroup>
                {/* </div> */}
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