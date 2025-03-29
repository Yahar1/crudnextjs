import { getConnection } from "../../db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
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
      img,
      ctrl,
      activetime,
    } = req.body;

    console.log("Request body:", req.body);

    if (
      !email ||
      !project ||
      !staff ||
      !name_surname ||
      !tel ||
      !email_visitor ||
      !time_start ||
      !time_end ||
      !activity ||
      !detail_activity ||
      !img ||
      !activetime ||
      ctrl === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const pool = await getConnection();
      console.log("Database connection successful, executing query...");

      const timeStart = new Date(time_start);
      const timeEnd = new Date(time_end);

      if (isNaN(timeStart.getTime()) || isNaN(timeEnd.getTime())) {
        throw new Error("Invalid date format for TimeStart or TimeEnd");
      }

      const result = await pool
        .request()
        .input("Email", email)
        .input("Project", project)
        .input("Staff", staff)
        .input("NameSurname", name_surname)
        .input("Tel", tel)
        .input("EmailVisitor", email_visitor)
        .input("TimeStart", timeStart)
        .input("TimeEnd", timeEnd)
        .input("Activity", activity)
        .input("DetailActivity", detail_activity)
        .input("Img", img)
        .input("Ctrl", ctrl)
        .input("Activetime", activetime).query(`
                INSERT INTO Booking 
                (email, project, staff, name_surname, tel, email_visitor, time_start, time_end, activity, detail_activity, img, ctrl, activetime)
                OUTPUT INSERTED.Id
                VALUES 
                (@Email, @Project, @Staff, @NameSurname, @Tel, @EmailVisitor, @TimeStart, @TimeEnd, @Activity, @DetailActivity, @Img, @Ctrl, @Activetime)
            `);

      console.log("Booking created successfully:", result.recordset);
      return res
        .status(201)
        .json({
          message: "Booking created successfully",
          bookingId: result.recordset[0].BookingId,
        });
    } catch (error) {
      console.error("Error creating booking:", error.stack);
      return res
        .status(500)
        .json({ message: "Failed to create booking", error: error.toString() });
    }
  } else if (req.method === "GET") {
    try {
      const pool = await getConnection();
      const result = await pool.request().query("SELECT * FROM Booking");
      return res.status(200).json(result.recordset);
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    const {
        id, 
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
        img,
        ctrl,
        activetime,
    } = req.body;

    console.log('Edit request body:', req.body);

    if (!id || !email || !project || !staff || !name_surname || !tel || !email_visitor || !time_start || !time_end || !activity || !detail_activity || !img || !activetime || ctrl === undefined) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const pool = await getConnection();
        console.log("Database connection successful, executing query...");
  
        const timeStart = new Date(time_start);
        const timeEnd = new Date(time_end);
  
        if (isNaN(timeStart.getTime()) || isNaN(timeEnd.getTime())) {
          throw new Error("Invalid date format for TimeStart or TimeEnd");
        }
        await pool
            .request()
            .input("Id", id)
            .input("Email", email)
            .input("Project", project)
            .input("Staff", staff)
            .input("NameSurname", name_surname)
            .input("Tel", tel)
            .input("EmailVisitor", email_visitor)
            .input("TimeStart", timeStart)
            .input("TimeEnd", timeEnd)
            .input("Activity", activity)
            .input("DetailActivity", detail_activity)
            .input("Img", img)
            .input("Ctrl", ctrl)
            .input("Activetime", activetime)
            .query(
                `
                UPDATE Booking
                SET 
                    email = @Email, 
                    project = @Project, 
                    staff = @Staff, 
                    name_surname = @NameSurname, 
                    tel = @Tel, 
                    email_visitor = @EmailVisitor, 
                    time_start = @TimeStart, 
                    time_end = @TimeEnd, 
                    activity = @Activity, 
                    detail_activity = @DetailActivity, 
                    img = @Img, 
                    ctrl = @Ctrl, 
                    activetime = @Activetime
                WHERE id = @Id
                `
            );

        return res.status(200).json({ message: "Booking updated successfully" });
    } catch (error) {
        console.error('Error editing booking:', error);
        res.status(500).json({ message: 'Failed to edit booking', error: error.toString() });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Booking ID is required" });
    }

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input("Id", id)
            .query(
                `
                DELETE FROM Booking WHERE id = @Id
                `
            );

        return res.status(204).end();
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Failed to delete booking', error: error.toString() });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
