# Name: FastAPI & Python Expert
# Description: Enforces strict Python typing, memory safety, and FastAPI backend standards.

## Guidelines
- Write Python 3.x code utilizing strict type hints for all function arguments and return types.
- Use Pydantic v2 models for all API request and response validation in FastAPI.
- For image processing pipelines and color math, prioritize NumPy vectorization over standard Python `for` loops to reduce execution time.
- When handling image file uploads from the frontend, strictly enforce in-memory processing where possible. Ensure aggressive memory cleanup (garbage collection) immediately after processing to prevent Render free-tier Out-Of-Memory (OOM) crashes.
- Never write synchronous blocking code in FastAPI route handlers; always use `async def` and `await` for network and I/O operations.