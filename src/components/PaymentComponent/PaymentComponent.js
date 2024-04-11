// components/PaymentComponent.jsx
'use client'

import { useDispatch, useSelector } from 'react-redux';
import { setAmount } from '@/slices/paymentSlice';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PaymentComponent = ({ userId }) => {
  const dispatch = useDispatch();
  const { amount, credits } = useSelector((state) => state.payment);
  
  const handleAmountChange = (e) => {
    const newAmount = parseInt(e.target.value);
    dispatch(setAmount(newAmount));
    console.log(amount, credits)
  };

  const createOrder = async (data, actions) => {
    const res = await fetch('/api/credits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, userId }),
    });
    const order = await res.json();
    console.log(order);
    return order.id;
  };

  const onApprove = async (data, actions) => {
    console.log('Approved:', data);
    await actions.order.capture();

    // Enviar la información de que el pago fue aprobado
    try {
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, userId, paymentApproved: true }),
      });

      if (response.ok) {
        console.log('Pago aprobado correctamente');
        // Puedes realizar alguna acción adicional, como redirigir al usuario
      } else {
        console.error('Error al procesar el pago aprobado');
      }
    } catch (error) {
      console.error('Error al enviar el estado del pago:', error);
    }
  };

  const onCancel = (data) => {
    console.log('Cancelled:', data);
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col items-center justify-center">
      <div className="mb-4">
        <label htmlFor="amount" className="text-white mr-2">
          Payment Amount:
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={handleAmountChange}
          className="px-2 py-1 rounded-md"
          step="1"
          min="0"
        />
      </div>
      <div className="mb-8 text-white">Credits to Obtain: {credits} Monto: {amount}</div>
      <PayPalScriptProvider
        options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
      >
        <PayPalButtons
          style={{ layout: 'vertical', color: 'silver' }}
          createOrder={createOrder}
          onApprove={onApprove}
          onCancel={onCancel}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PaymentComponent;