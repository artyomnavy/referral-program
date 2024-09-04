import {v4 as uuidv4} from 'uuid';
import {invitesRepository} from "../repositories/invites-repository";

export const authService = {
    async generateReferal(protocol: string, host: string) {
        const refererId = uuidv4();

        await invitesRepository.createReferer(refererId);

        return {
            inviteLink: `${protocol}://${host}/auth/registration?refererId=${refererId}`
        }
    }
}