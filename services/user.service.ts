import { prisma } from "@/lib/auth/prisma"

type UpdateUserInput = {
  name?: string;
  role?: "ADMIN" | "USER";
  email?: string;
};

//Get all users service
export async function getAllUsersService() {
  return await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
}

//Edit user service by id
  export async function editUserByIdService(userId: string, data: UpdateUserInput) {
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }