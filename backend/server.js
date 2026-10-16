const express = require("express");
const connection = require("./db");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Save a Lost or Found item
app.post("/api/items", (req, res) => {
    const {
        student_id,
        item_name,
        category,
        item_type,
        description,
        location,
        item_date
    } = req.body;

    const sql = `
        INSERT INTO items
        (student_id, item_name, category, item_type,
         description, location, item_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(sql, [
        student_id,
        item_name,
        category,
        item_type,
        description || "",
        location,
        item_date
    ], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({
                message: "Could not save the item."
            });
        }

        res.status(201).json({
            message: "Item saved successfully!",
            item_id: result.insertId
        });
    });
});

// Get all Lost and Found items
app.get("/api/items", (req, res) => {
    const sql = `
        SELECT item_id, item_name, category, item_type,
               description, location, item_date, status
        FROM items
        ORDER BY created_at DESC
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({
                message: "Could not fetch items."
            });
        }

        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});