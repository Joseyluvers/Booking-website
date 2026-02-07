const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/book', async (req, res) => {
  const { name, email, service, date, time } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_app_password'
    }
  });

  await transporter.sendMail({
    from: 'Booking System',
    to: email,
    subject: 'Appointment Confirmation',
    html: `<h3>Appointment Confirmed</h3>
           <p>Service: ${service}</p>
           <p>Date: ${date}</p>
           <p>Time: ${time}</p>`
  });

  res.json({ success: true });
});

app.listen(5000, () => console.log('Server running on port 5000'));