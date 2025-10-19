import sql from "mssql";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const dbconfig = {
    server: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    options: { encrypt: true, trustServerCertificate: true }
}

async function getConnection() {
    try {
        const pool = await sql.connect(dbconfig);
        return pool;
    } catch (error) {
        console.error("DB Fail Connection: ", error.message);
        throw error;
    }
}

app.get("/contacts", async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const request = pool.request();
        const result = await request.query("SELECT * FROM Contactos");
        await pool.close();
        if (result.recordset.length === 0){
            return res.status(404).json({message: "No hay registros"});
        }
        return res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Server Internal Error ", error: err.message })
    } finally {
        if (pool) await pool.close();
    }
});

app.get("/contacts/:id", async (req, res) => {
    let pool;
    try {
        const { id } = req.params;
        pool = await getConnection();
        const request = pool.request();
        const result = await request
        .input('input', sql.Int, id)
        .query("SELECT * FROM Contactos WHERE Id = @input");
        await pool.close();
        if (result.recordset.length === 0){
            return res.status(404).json({message: "No hay registros"});
        }
        return res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Server Internal Error ", error: err.message })
    } finally {
        if (pool) await pool.close();
    }
});

app.post("/contacts", async (req, res) => {
    let pool;
    try {
        const { nombre, apellido, email, telefono, dpi } = req.body;
        pool = await getConnection();
        const request = await pool.request()
        .input('Nombre', sql.NVarChar, nombre)
        .input('Apellido', sql.NVarChar, apellido)
        .input('Email', sql.NVarChar, email)
        .input('Telefono', sql.NVarChar, telefono)
        .input('DPI', sql.NVarChar, dpi)
        .execute('sp_InsertContact');
        await pool.close();
        return res.status(201).json({ message: "Succesfully inserted!"});
    } catch (error) {
        res.status(500).json({ message: "Server Internal Error ", error: err.message })
    } finally {
        if (pool) await pool.close();
    }
});

app.put("/contacts/:id", async (req, res) => {
    let pool;
    try {
        const { id } = req.params;
        const { nombre, apellido, email, telefono, dpi } = req.body;
        pool = await getConnection();
        const request = await pool.request()
        .input('Id', sql.Int, id)
        .input('Nombre', sql.NVarChar, nombre)
        .input('Apellido', sql.NVarChar, apellido)
        .input('Email', sql.NVarChar, email)
        .input('Telefono', sql.NVarChar, telefono)
        .input('DPI', sql.NVarChar, dpi)
        .execute('sp_UpdateConctact');
        await pool.close();
        return res.status(201).json({ message: "Succesfully updated!"});
    } catch (error) {
        res.status(500).json({ message: "Server Internal Error ", error: error.message })
    } finally {
        if (pool) await pool.close();
    }
});

app.delete("/contacts/:id", async (req, res) => {
    let pool;
    try {
        const { id } = req.params;        
        pool = await getConnection();
        const request = await pool.request()
        .input('Id', sql.Int, id)
        .execute('sp_DeleteContact');
        await pool.close();
        return res.status(201).json({ message: "Succesfully deleted!"});
    } catch (error) {
        res.status(500).json({ message: "Server Internal Error ", error: error.message })
    } finally {
        if (pool) await pool.close();
    }
});

app.listen(process.env.PORT, ()=> {
    console.log(`Servidor en el puerto ${process.env.PORT}`);
    getConnection()
    .then((pool)=>{
        console.log("Success Connection!");
        pool.close();
    })
    .catch((error)=>{
        console.error("Failed Connection X:" , error.message);
    })
})