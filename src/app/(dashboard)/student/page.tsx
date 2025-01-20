import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const StudentPage = async () => {
  const { userId } = auth();
  console.log(auth());
  if (!userId) {
    redirect("/sign-in");
  }

  // First, get the student to find their classId
  const student = await prisma.student.findUnique({
    where: {
      id: userId,
    },
    include: {
      class: true, // Include the class details
    },
  });

  if (!student) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold">Account not found</h1>
        <p className="mt-2">Your account is not registered as a student.</p>
      </div>
    );
  }

  if (!student.class) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold">No class assigned</h1>
        <p className="mt-2">Please contact your administrator to be assigned to a class.</p>
      </div>
    );
  }

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({student.class.name})</h1>
          <BigCalendarContainer type="classId" id={student.class.id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;