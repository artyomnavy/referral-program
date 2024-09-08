import request from "supertest";
import {HTTP_STATUSES, PaymentStatuses} from "../src/utils";
import {StudentOutputType} from "../src/models/students/student.output";
import {app} from "../src/app";

describe('Referral program (e2e)', () => {

    const loginBasicAuth = process.env.BASIC_AUTH_LOGIN;
    const passwordBasicAuth = process.env.BASIC_AUTH_PASSWORD;

    if (!loginBasicAuth || !passwordBasicAuth) {
        throw new Error('Tests failed: BASIC_AUTH_LOGIN or BASIC_AUTH_PASSWORD is empty in env file')
    }

    let inviteLink: { inviteLink: string } | null = null
    let refLinkId: string | null = null
    let studentByAdmin: StudentOutputType | null = null
    let studentByReferrer: StudentOutputType | null = null
    let accessTokenToReferrer: any = null
    let refreshTokenToReferrer: any = null
    let accessTokenToStudent: any = null
    let refreshTokenToStudent: any = null

    // DELETE ALL DATA
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    // CREATE STUDENT BY ADMIN
    it('+ POST create student by admin with correct data', async () => {
        const createData = {
            fullName: 'Test Testov',
            phone: '89995551321',
            email: 'test@testov.com',
            password: 'testov999',
        }

        const createStudentByAdmin = await request(app)
            .post('/sa/students')
            .auth(loginBasicAuth, passwordBasicAuth)
            .send(createData)
            .expect(HTTP_STATUSES.CREATED_201)

        studentByAdmin = createStudentByAdmin.body

        expect(studentByAdmin).toEqual({
            id: expect.any(String),
            fullName: createData.fullName,
            phone: createData.phone,
            email: createData.email,
            referrerId: null
        })
    })

    // LOGIN STUDENT BY ADMIN
    it('+ POST login student by admin with correct data and create access and refresh tokens', async () => {
        const authData = {
            phoneOrEmail: 'test@testov.com',
            password: 'testov999'
        }

        const createTokens = await request(app)
            .post('/auth/login')
            .send(authData)
            .expect(HTTP_STATUSES.OK_200)

        refreshTokenToReferrer = createTokens.headers['set-cookie'][0].split('=')[1].split(';')[0]

        accessTokenToReferrer = createTokens.body.accessToken
    })

    // GENERATE REFERRAL LINK
    it('+ POST generate referral link by student by admin', async () => {
        const generateLink = await request(app)
            .post('/auth/generation-referral-link')
            .auth(accessTokenToReferrer, {type: 'bearer'})
            .expect(HTTP_STATUSES.OK_200)

        inviteLink = generateLink.body

        expect(inviteLink).toEqual({
            inviteLink: expect.any(String),
        })

        const refLink = new URL(inviteLink!.inviteLink)

        refLinkId = refLink.searchParams.get('referrer')
    })

    // CREATE STUDENT BY REFERRER
    it('+ POST registration/create student by referrer with correct invite link', async () => {
        const createData = {
            refLinkId: refLinkId,
            fullName: 'Bug Testovich',
            phone: '+79813734242',
            email: 'bug@testovich.com',
            password: 'testovich981',
        }

        const createStudentByReferrer = await request(app)
            .post('/auth/referral-registration')
            .send(createData)
            .expect(HTTP_STATUSES.CREATED_201)

        studentByReferrer = createStudentByReferrer.body

        expect(studentByReferrer).toEqual({
            id: expect.any(String),
            fullName: createData.fullName,
            phone: createData.phone,
            email: createData.email,
            referrerId: studentByAdmin!.id
        })
    })

    // LOGIN STUDENT BY REFERRER
    it('+ POST login student by referrer with correct data and create access and refresh tokens', async () => {
        const authData = {
            phoneOrEmail: '+79813734242',
            password: 'testovich981'
        }

        const createTokens = await request(app)
            .post('/auth/login')
            .send(authData)
            .expect(HTTP_STATUSES.OK_200)

        refreshTokenToStudent = createTokens.headers['set-cookie'][0].split('=')[1].split(';')[0]

        accessTokenToStudent = createTokens.body.accessToken
    })

    // ADD REFERRAL PAYMENTS INFO AND LESSONS TO STUDENT AND REFERRER
    it('+ POST add referral payments student and lessons to student and referrer with correct data', async () => {
        const addData = {
            refLinkId: refLinkId,
            amount: '150',
            paymentStatus: PaymentStatuses.SUCCESS,
            currency: 'RUR',
            countLessons: '4',
            productName: 'Test lessons'
        }

        const addPaymentAndLessons = await request(app)
            .post('/payments/referral/add')
            .auth(accessTokenToStudent, {type: 'bearer'})
            .send(addData)
            .expect(HTTP_STATUSES.CREATED_201)

        const paymentAndLessons = addPaymentAndLessons.body

        expect(paymentAndLessons).toEqual({
            student: {
                id: expect.any(String),
                productName: addData.productName,
                countLessons: +addData.countLessons
            },
            referrer: {
                refLinkId: refLinkId,
                bonusLessons: +addData.countLessons
            }
        })
    })

    // GET REFERRAL STATISTIC FOR STUDENT
    it('+ GET referral statistic for student with correct data', async () => {
        const res = await request(app)
            .get('/students/referral-statistic')
            .auth(accessTokenToReferrer, {type: 'bearer'})
            .expect(HTTP_STATUSES.OK_200, {
                studentId: studentByAdmin!.id,
                referrals: {
                    totalCount: 1,
                    students: {
                        referrals: [{
                            id: studentByReferrer!.id,
                            fullName: studentByReferrer!.fullName
                        }]
                    }
                }
            })
    })

    // LOGOUT STUDENT BY ADMIN
    it('+ POST logout student by admin', async () => {
        await request(app)
            .post('/auth/logout')
            .set('Cookie', [`refreshToken=${refreshTokenToReferrer}`])
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    // UPDATE REFRESH TOKEN STUDENT BY ADMIN
    it('- POST update refresh token student by admin', async () => {
        await request(app)
            .post('/auth/refresh-token')
            .set('Cookie', [`refreshToken=${refreshTokenToReferrer}`])
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    // DELETE ALL DATA
    afterAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })
})