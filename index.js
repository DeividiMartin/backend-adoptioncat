const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.LOG_USER,
    pass: process.env.LOG_PASS,
  },
});

app.post('/enviar-email', upload.single('imagem'), (req, res) => {
  const { name, email, cidade, estado, bairro, rua, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.LOG_USER,
    subject: 'Nova mensagem do formulário de contato',
    text: `
        Nome: ${name}
        Email: ${email}
        Cidade: ${cidade}
        Estado: ${estado}
        Bairro: ${bairro}
        Rua: ${rua}
        Mensagem: ${message}
    `,
    attachments: [
      {
        filename: 'imagem.jpg',
        content: req.file.buffer,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar o email:', error);
      res.status(500).json({ success: false });
    } else {
      console.log('Email enviado com sucesso:', info.response);
      res.json({ success: true });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
