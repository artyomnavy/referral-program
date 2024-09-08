export type CreateStudentByAdminModel = {
    fullName: string,
    phone: string,
    email: string,
    password: string
}

export type CreateStudentByReferrerModel = {
    refLinkId: string
    fullName: string,
    phone: string,
    email: string,
    password: string
}