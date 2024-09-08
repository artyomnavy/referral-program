export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
    NOT_FOUND_404: 404,
    GONE_410: 410
}

export enum PaymentStatuses {
    SUCCESS = 'Success',
    PENDING = 'Pending',
    FAILED = 'Failed',
}