import Todos from "../model/todosModel.js";

export const getTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    const todos = await Todos.find({ owner: userId })
      .populate("owner", "firstname")
      .exec();

    if (todos.length === 0) {
      return res.json({
        status: "success",
        message: "No task!",
        data: {},
      });
    }
    res.status(200).json({
      status: "success",
      message: "fetching todo list successfully.",
      data: todos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;
    const newTodo = new Todos({
      owner: userId,
      title,
      description,
    });
    await newTodo.save();
    res
      .status(201)
      .json({ message: "To-Do created successfully!", todo: newTodo });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateTodos = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, status } = req.body;
    const todoExist = await Todos.findOne({ _id: id });
    if (!todoExist) {
      return res.status(404).json({ message: "Todos not found." });
    }
    const updateTodos = await Todos.findByIdAndUpdate(
      id,
      { title, description, status, updatedAt: Date.now() },
      { new: true }
    );
    res.status(200).json(updateTodos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTodos = async (req, res) => {
  try {
    const id = req.params.id;
    const todoExist = await Todos.findOne({ _id: id });
    if (!todoExist) {
      return res.status(404).json({ message: "Todos not found." });
    }
    const deleteTodos = await Todos.findByIdAndDelete(id);
    res.status(200).json(deleteTodos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
