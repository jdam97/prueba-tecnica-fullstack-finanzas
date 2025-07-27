import { any } from "better-auth";
import { getAllUsersService,editUserByIdService } from "../services/user.service";
import type { NextApiRequest, NextApiResponse } from "next";

//Get all users Controller
export async function getAllUsersController(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await getAllUsersService();
    return res.status(200).json(users);
  } catch (e) {
    return res.status(500).json({ error: "Error interno" });
  }
}

export async function editUserByIdController(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;
  const { name, role, email } = req.body;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const updatedUser = await editUserByIdService(id, { name, role, email });
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error editando usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}