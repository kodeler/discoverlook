// app/api/credits/route.js
import paypal from '@paypal/checkout-server-sdk';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const creditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Credit = mongoose.models.Credit || mongoose.model('Credit', creditSchema);

// Creating an environment
let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

export async function POST(req) {
  await mongoose.connect(process.env.MONGO_URI);

  const { amount, userId, paymentApproved } = await req.json();
  console.log("mmmmmmmmmmmmmmm",amount);

  // Asegúrate de validar el userId aquí, como verificar que no esté vacío
  if (!userId) {
    return new Response('User ID is required', { status: 400 });
  }

  let request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: amount.toString(),
        },
      },
    ],
  });

  try {
    const response = await client.execute(request);

    // Registrar los créditos o sumarlos a los existentes
    if (paymentApproved) {
      const existingCredits = await Credit.findOne({ userId: new mongoose.Types.ObjectId(userId) });

      if (existingCredits) {
        // Si el usuario ya tiene créditos, sumar los nuevos
        existingCredits.amount += amount * 100;
        await existingCredits.save();
      } else {
        // Si el usuario no tiene créditos, crear un nuevo documento
        const credit = new Credit({
          userId: new mongoose.Types.ObjectId(userId),
          amount: amount * 100,
        });
        await credit.save();
      }
    }

    return NextResponse.json({ id: response.result.id });
  } catch (error) {
    console.error(error);
    return new Response('Error processing payment', { status: 500 });
  } finally {
    await mongoose.disconnect();
  }
}


export async function GET(req) {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const userId = req.query.userId; // Obtiene el userId de los parámetros de la consulta

  // Valida el userId aquí
  if (!userId) {
    return new Response('User ID is required', { status: 400 });
  }

  try {
    const credits = await Credit.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalCredits = credits.length > 0 ? credits[0].total : 0;

    return new Response(JSON.stringify({ credits: totalCredits }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Error retrieving credits', { status: 500 });
  } finally {
    await mongoose.disconnect();
  }
}
