// app/(app)/pay/page.js (or any other page)
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PaymentComponent from '@/components/PaymentComponent/PaymentComponent';
import mongoose from 'mongoose';
import {User} from "@/models/User";

export default async function PayPage() {
  const session = await getServerSession(authOptions);
  mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: session?.user?.email });
  const userId = user.id;
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3043002697.
  console.log(">>+++++>>>>>>>------>>>>>>>>>>>>>>>>", userId);

  return <PaymentComponent userId={userId} />;
}