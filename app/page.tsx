"use client";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Modal, Button } from "@mui/material";
import Image from "next/image";

interface Booking {
  id: number;
  email: string;
  project: string;
  staff: string;
  name_surname: string;
  tel: number;
  email_visitor: string;
  time_start: string;
  time_end: string;
  activity: string;
  detail_activity: string;
  img: string;
  ctrl: number;
  activetime: string;
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("");
  const [staff, setStaff] = useState("");
  const [name_surname, setNameSurname] = useState("");
  const [tel, setTel] = useState("");
  const [email_visitor, setEmailVisitor] = useState("");
  const [time_start, setTimeStart] = useState("");
  const [time_end, setTimeEnd] = useState("");
  const [activity, setActivity] = useState("");
  const [detail_activity, setDetailActivity] = useState("");
  const [img, setImg] = useState("");
  const [ctrl, setCtrl] = useState(1);
  const [activetime, setActivetime] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/crudbooking");
      if (!res.ok) {
        const errorResponse = await res.json();
        console.error("Error response:", errorResponse);
        throw new Error("Failed to fetch booking");
      }
      const data: Booking[] = await res.json();
      console.log("Fetched booking:", data);
      setBookings(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newBooking = {
      email,
      project,
      staff,
      name_surname,
      tel,
      email_visitor,
      time_start,
      time_end,
      activity,
      detail_activity,
      ctrl,
      img,
      activetime,
    };

    console.log("Booking Data Submitted:", JSON.stringify(newBooking, null, 2));
    const missingFields = Object.entries(newBooking)
      .filter(([, value]) => !value)
      .map(([field]) => field);
    if (missingFields.length > 0) {
      console.warn("Missing Fields:", missingFields);
      alert("Please fill in all required fields: " + missingFields.join(", "));
      return;
    }

    try {
      const response = await fetch("/api/crudbooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });

      if (response.ok) {
        setEmail("");
        setProject("");
        setStaff("");
        setNameSurname("");
        setTel("");
        setEmailVisitor("");
        setTimeStart("");
        setTimeEnd("");
        setActivity("");
        setDetailActivity("");
        setImg("");
        setCtrl(1);
        setActivetime("");
        alert("Booking created successfully!");
        fetchBookings();
      } else {
        const errorResponse = await response.json();
        alert("Error creating booking: " + errorResponse.message);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const handleUpdate = (booking: Booking) => {
    setSelectedBooking(booking);
    setEmail(booking.email);
    setProject(booking.project);
    setStaff(booking.staff);
    setNameSurname(booking.name_surname);
    setTel(booking.tel.toString());
    setEmailVisitor(booking.email_visitor);
    setTimeStart(booking.time_start);
    setTimeEnd(booking.time_end);
    setActivity(booking.activity);
    setDetailActivity(booking.detail_activity);
    setImg(booking.img);
    setCtrl(booking.ctrl);
    setActivetime(booking.activetime);
    setUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedBooking) return;

    const updatedBooking = {
      id: selectedBooking.id,
      email,
      project,
      staff,
      name_surname,
      tel,
      email_visitor,
      time_start,
      time_end,
      activity,
      detail_activity,
      ctrl,
      img,
      activetime,
    };

    try {
      const response = await fetch("/api/crudbooking", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBooking),
      });

      if (response.ok) {
        alert("Booking updated successfully!");
        fetchBookings();
        setUpdateModalOpen(false);
      } else {
        const errorResponse = await response.json();
        alert("Error updating booking: " + errorResponse.message);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/crudbooking`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert("Booking deleted successfully!");
        fetchBookings();
      } else {
        const errorResponse = await response.json();
        alert("Error deleting booking: " + errorResponse.message);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Staff"
            value={staff}
            onChange={(e) => setStaff(e.target.value)}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Name Surname"
            value={name_surname}
            onChange={(e) => setNameSurname(e.target.value)}
            className="border rounded p-2"
            required
          />
          <input
            type="tel"
            placeholder="Telephone"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            className="border rounded p-2"
            required
          />
          <input
            type="email"
            placeholder="Visitor Email"
            value={email_visitor}
            onChange={(e) => setEmailVisitor(e.target.value)}
            className="border rounded p-2"
            required
          />
          <input
            type="datetime-local"
            placeholder="Start Time"
            value={time_start}
            onChange={(e) => setTimeStart(e.target.value)}
            className="border rounded p-2"
            required
          />
          <input
            type="datetime-local"
            placeholder="End Time"
            value={time_end}
            onChange={(e) => setTimeEnd(e.target.value)}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Detail of Activity"
            value={detail_activity}
            onChange={(e) => setDetailActivity(e.target.value)}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="Control"
            value={ctrl}
            onChange={(e) => setCtrl(Number(e.target.value))}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Activity Time"
            value={activetime}
            onChange={(e) => setActivetime(e.target.value)}
            className="border rounded p-2"
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Create Booking
          </Button>
        </form>

        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={bookings}
            columns={[
              { field: "id", headerName: "ID", width: 70 },
              { field: "email", headerName: "Email", width: 130 },
              { field: "project", headerName: "Project", width: 130 },
              { field: "staff", headerName: "Staff", width: 130 },
              { field: "name_surname", headerName: "Name Surname", width: 130 },
              { field: "tel", headerName: "Telephone", width: 130 },
              {
                field: "email_visitor",
                headerName: "Visitor Email",
                width: 130,
              },
              { field: "time_start", headerName: "Start Time", width: 150 },
              { field: "time_end", headerName: "End Time", width: 150 },
              { field: "activity", headerName: "Activity", width: 130 },
              { field: "detail_activity", headerName: "Details", width: 150 },
              { field: "img", headerName: "Image", width: 150 },
              { field: "ctrl", headerName: "Control", width: 100 },
              { field: "activetime", headerName: "Activity Time", width: 150 },
              {
                field: "action",
                headerName: "Action",
                renderCell: (params) => (
                  <div>
                    <Button
                      onClick={() => handleUpdate(params.row as Booking)}
                      variant="contained"
                      color="secondary"
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => handleDelete(params.row.id)}
                      variant="contained"
                      color="error"
                      style={{ marginLeft: "5px" }}
                    >
                      Delete
                    </Button>
                  </div>
                ),
                width: 200,
              },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const selectedRows = bookings.filter((row) =>
                selectedIDs.has(row.id)
              );
              console.log(selectedRows);
            }}
          />
        </div>
      </main>

      <Modal open={updateModalOpen} onClose={() => setUpdateModalOpen(false)}>
        <Box
          sx={{
            width: 400,
            padding: 4,
            margin: "auto",
            backgroundColor: "white",
            borderRadius: 2,
          }}
        >
          <h2>Update Booking</h2>
          <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="text"
              placeholder="Project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="text"
              placeholder="Staff"
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="text"
              placeholder="Name Surname"
              value={name_surname}
              onChange={(e) => setNameSurname(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="tel"
              placeholder="Telephone"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="email"
              placeholder="Visitor Email"
              value={email_visitor}
              onChange={(e) => setEmailVisitor(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="datetime-local"
              placeholder="Start Time"
              value={time_start}
              onChange={(e) => setTimeStart(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="datetime-local"
              placeholder="End Time"
              value={time_end}
              onChange={(e) => setTimeEnd(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="text"
              placeholder="Activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="text"
              placeholder="Detail of Activity"
              value={detail_activity}
              onChange={(e) => setDetailActivity(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              className="border rounded p-2"
            />
            <input
              type="number"
              placeholder="Control"
              value={ctrl}
              onChange={(e) => setCtrl(Number(e.target.value))}
              className="border rounded p-2"
              required
            />
            <input
              type="text"
              placeholder="Activity Time"
              value={activetime}
              onChange={(e) => setActivetime(e.target.value)}
              className="border rounded p-2"
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Update Booking
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
