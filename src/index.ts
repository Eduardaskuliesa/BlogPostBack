import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  createAuthor,
  getAllAuthors,
  updateAuthor,
  deleteAuthor,
} from "./handlers/authorHandler";
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} from "./handlers/blogHandler";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Route patterns: METHOD /path
    switch (`${event.httpMethod} ${event.resource}`) {
      // Author routes
      case "POST /authors":
        return await createAuthor(event);
      case "GET /authors":
        return await getAllAuthors();
      case "PUT /authors/{id}":
        return await updateAuthor(event);
      case "DELETE /authors/{id}":
        return await deleteAuthor(event);

      // Blog post routes
      case "POST /posts":
        return await createPost(event);
      case "GET /posts":
        return await getAllPosts();
      case "GET /posts/{id}":
        return await getPost(event);
      case "PUT /posts/{id}":
        return await updatePost(event);
      case "DELETE /posts/{id}":
        return await deletePost(event);

      default:
        return {
          statusCode: 404,
          body: JSON.stringify({
            success: false,
            message: "Route not found",
          }),
        };
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
    };
  }
};
