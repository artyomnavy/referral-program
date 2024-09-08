import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    // Создание таблицы BlacklistRefreshTokens
    await knex.schema.createTable('BlacklistRefreshTokens', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('refreshToken').notNullable();
    });

}

export async function down(knex: Knex): Promise<void> {
    // Удаление таблицы
    await knex.schema.dropTableIfExists('BlacklistRefreshTokens');
}

