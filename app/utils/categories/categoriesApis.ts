import { CategoryRequestBody } from "./types/CategoryRequestBody";
import { ICategories } from "./types/ICategory";

// Fetch categories
export async function fetchCategories(): Promise<ICategories> {
    const response = await fetch('/api/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
}

// create category
export async function createCategories(categoryData: CategoryRequestBody): Promise<ICategories> {
  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message);
    }
    return responseData; // Assuming the response follows the ApiResponse structure
  } catch (error) {
    return { success: false, message: 'Failed to create category', data: {} as any };
  }
}