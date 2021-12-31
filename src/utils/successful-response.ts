interface SuccessfulResponse<T> {
  success: true,
  errors: null,
  data?: T,
  message?: string
}


export function transformSuccess<T>(data?: T, message?: string): SuccessfulResponse<T> {
  let response: SuccessfulResponse<T> = {
    success: true,
    errors: null
  }

  if (data) response.data = data;
  if (message) response.message = message;

  return response;

}