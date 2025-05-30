import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import SignOutButton from "@/app/dashboard/components/sing-out-button";
import { db } from "@/db";
import { usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

// server component, so we can use headers to get the session, and redirect to the authentication page if the user is not logged in

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }

  // get clinics from user
  const clinics = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session.user.id),
  });

  // if user has no clinics, redirect to clinic form
  if (clinics.length === 0) redirect("/clinic-form");

  // if user has clinics, show the dashboard

  return (
    <div>
      <h1>Dashboard</h1>
      <h1>{session?.user?.name} </h1>
      <h1>{session?.user?.email}</h1>
      <SignOutButton />
    </div>
  );
};

export default DashboardPage;
