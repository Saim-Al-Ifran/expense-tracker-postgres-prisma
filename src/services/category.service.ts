import prisma from "../config/prisma";
export const createCategory = async (userId: number, name: string) => {
  const existingCategory = await prisma.category.findFirst({
    where: { name, userId },
  });

  if (existingCategory) {
    throw new Error("Category with this name already exists.");
  }

  return await prisma.category.create({
    data: { name, userId },
  });
};

export const getAllCategories = async (userId: number) => {
  return await prisma.category.findMany({
    where: {
      OR: [ { userId }],
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateCategory = async (
  id: number,
  userId: number,
  name: string
) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new Error("Category not found.");

  if (category.userId !== userId) {
    throw new Error("You are not authorized to update this category.");
  }

  const duplicate = await prisma.category.findFirst({
    where: {
      name,
      userId,
      NOT: { id },
    },
  });

  if (duplicate) throw new Error("Category name already exists.");

  return await prisma.category.update({
    where: { id },
    data: { name },
  });
};

export const deleteCategory = async (id: number, userId: number) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new Error("Category not found.");

  if (category.userId !== userId) {
    throw new Error("You are not authorized to delete this category.");
  }

  await prisma.category.delete({ where: { id } });
  return { message: "Category deleted successfully." };
};
