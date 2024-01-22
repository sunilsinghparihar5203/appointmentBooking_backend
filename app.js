const path = require("path");
const cors = require("cors");
const express = require("express");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Appointments = require("./models/appointments");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Get single appointment using ID
app.get("/appointment/:appointId", (req, res, next) => {
  const id = req.params.appointId;
  Appointments.findByPk(id)
    .then((result) => {
      if (!result) {
        res.send("<p>Data not available!</p>");
      } else {
        console.log({ id: result });
        res.send(result);
      }
    })
    .catch((err) => console.log("Error while fetching appintment usign ID"));
});

// Get list of all apointments
app.get("/appointments", async (req, res, next) => {
  const appointments = await Appointments.findAll();
  res.send(appointments);
});

app.put("/appointment/edit/:appointId", (req, res, next) => {
  const id = req.params.appointId;
  const name = req.body.name;
  const contact = req.body.contact;
  const email = req.body.email;
  Appointments.update(
    { name: name, contact: contact, email: email },
    {
      where: {
        id: id,
      },
    }
  )
    .then((result) => {
      res.send(result);
    })
    .then((err) => console.log(err));
  Appointments.update(
    { lastName: "Doe" },
    {
      where: {
        lastName: null,
      },
    }
  );
});

//Delete appointment using ID
app.delete("/appointment/delete/:appointId", (req, res, next) => {
  const id = req.params.appointId;
  Appointments.destroy({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log(result);
      res.send("Deleted");
    })
    .catch((err) => {
      console.log("Got error while deleting");
    });
});

// Save new appointment
app.post("/appointment", (req, res, next) => {
  console.log({ body: req });
  const name = req.body.name;
  const contact = req.body.contact;
  const email = req.body.email;
  Appointments.create({ name: name, contact: contact, email: email })
    .then((result) => {
      console.log({ result });
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

// This is defalut page
app.use("/", (req, res, next) => {
  res.send("<div> <a href='/appointments'>Appointments</a></div>");
});

// To handle any other route
app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found", path: "/404" });
});

sequelize
  .sync()
  .then((result) => {
    app.listen(3002, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
