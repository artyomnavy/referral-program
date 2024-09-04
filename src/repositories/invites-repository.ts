import {db} from "../db/db";

export const invitesRepository = {
    async createReferer(id: string) {
        try {
            await db('invites').insert({ referrer_id: id }).returning('id');
        } catch(error) {
            console.error(error);
        }
    }
}