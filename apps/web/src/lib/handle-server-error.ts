import { toast } from 'sonner'
import { HttpError } from './repository/http-error'

export function handleServerError(error: unknown) {
  // eslint-disable-next-line no-console
  console.log(error)

  let errMsg = 'Something went wrong!'

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errMsg = 'Content not found.'
  }

  if (error instanceof HttpError) {
    errMsg = error.message
  }

  toast.error(errMsg)
}
