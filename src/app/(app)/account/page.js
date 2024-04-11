import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageLinksForm from "@/components/forms/PageLinksForm";
import UsernameForm from "@/components/forms/UsernameForm";
import {Page} from "@/models/Page";
import mongoose from "mongoose";
import {getServerSession, redirect} from "next-auth";
import cloneDeep from 'clone-deep';

export default async function AccountPage({searchParams}) {
  const session = await getServerSession(authOptions);
  const desiredUsername = searchParams?.desiredUsername;
  if (!session) {
    return redirect('/');
  }
  mongoose.connect(process.env.MONGO_URI);
  const page = await Page.findOne({owner: session?.user?.email});

  // Verifica si el objeto page no es null antes de continuar
  if (page) {
    const leanPage = cloneDeep(page.toJSON());
    leanPage._id = leanPage._id.toString();
    return (
      <>
        <PageSettingsForm page={leanPage} user={session.user} />
        <PageButtonsForm page={leanPage} user={session.user} />
        <PageLinksForm page={leanPage} user={session.user} />
      </>
    );
  } else {
    // Maneja el caso cuando page es null
    return (
      <div>
        <UsernameForm desiredUsername={desiredUsername} />
      </div>
    );
  }
}
