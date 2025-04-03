const express = require("express");
const router = express.Router();
const { getCollection } = require("./models/index");
const { ObjectId } = require("mongodb");

// GET /todos
router.get("/todos", async (req, res) => {
    try {
        const collection = getCollection();
        const todos = await collection.find({}).toArray();
        res.status(200).json(todos);
    } catch (error) {
        console.error("🔥 GET Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST /todos
router.post("/todos", async (req, res) => {
    const collection = getCollection();
    let { todo } = req.body;

    todo = JSON.stringify(todo);

    const newTodo = await collection.insertOne({ todo, status: false });

    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });

});

// DELETE /todos/:id
router.delete("/todos/:id", async (req, res) => {
    try {
        const collection = getCollection();
        const _id = new ObjectId(req.params.id);

        const deletedTodo = await collection.deleteOne({ _id });

        if (deletedTodo.deletedCount === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error("🔥 DELETE Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// PUT /todos/:id
router.put("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status } = req.body;

    if (typeof status !== "boolean") {
        return res.status(400).json({ mssg: "invalid status" });
    }

    const updatedTodo = await collection.updateOne({ _id }, { $set: { status: !status } });
    res.status(200).json(updatedTodo);
});

module.exports = router;
