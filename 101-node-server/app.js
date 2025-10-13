// server/app.js

const express = require('express');
const cors = require('cors'); 
const app = express();
const PORT = 3001; // Port untuk Backend

// --- Middleware Utama ---
// 1. CORS: Izinkan akses dari frontend React (default CRA adalah http://localhost:3000)
app.use(cors({
    origin: 'http://localhost:3000' 
}));
// 2. Body Parser
app.use(express.json());

// --- 2. Middleware Logging ---
const loggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    console.log(`[LOG] ${timestamp} | ${method} ${url}`);
    next(); 
};
app.use(loggerMiddleware);

// --- 1. Penyimpanan Data Sementara & Helper ---
let books = [
    { id: 1, title: 'Express.js Dasar', author: 'Joko Santoso', year: 2021 },
    { id: 2, title: 'Belajar React & Node', author: 'Ahmad F.', year: 2023 }
];
let nextId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;

const validateBook = (book) => {
    if (!book.title || typeof book.title !== 'string' || book.title.trim().length === 0) {
        return 'Judul buku harus valid.';
    }
    if (!book.author || typeof book.author !== 'string' || book.author.trim().length === 0) {
        return 'Nama penulis harus valid.';
    }
    if (!book.year || typeof book.year !== 'number' || book.year < 1000 || book.year > new Date().getFullYear() + 1) {
        return 'Tahun terbit harus berupa angka tahun yang valid.';
    }
    return null;
};

// --- 1. Routing CRUD Buku ---
app.get('/books', (req, res) => res.status(200).json(books));

app.post('/books', (req, res, next) => {
    const newBook = req.body;
    const validationError = validateBook(newBook);
    if (validationError) {
        const error = new Error(validationError);
        error.status = 400; 
        return next(error);
    }
    const bookToAdd = { id: nextId++, ...newBook };
    books.push(bookToAdd);
    res.status(201).json({ message: 'Buku berhasil ditambahkan', book: bookToAdd });
});

app.delete('/books/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    const initialLength = books.length;
    books = books.filter(b => b.id !== id);

    if (books.length === initialLength) {
        const error = new Error(`Buku ID ${id} tidak ditemukan.`);
        error.status = 404;
        return next(error);
    }
    res.status(204).send();
});

// Anda dapat menambahkan app.put '/books/:id' di sini (sama seperti kode sebelumnya)

// --- 3. Error Handling ---
app.use((req, res, next) => {
    const error = new Error(`Resource tidak ditemukan: ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Terjadi kesalahan server internal.';
    console.error(`[ERROR] Status ${status}: ${message}`); 

    res.status(status).json({
        status: 'error',
        statusCode: status,
        message: message
    });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Backend Express berjalan di http://localhost:${PORT}`);
});