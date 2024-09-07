import type { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
    // Создание таблиц
    await knex.schema.createTable('Students', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('fullName').notNullable();
        table.string('phone').unique().notNullable();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.string('referrerId').nullable();
        table.date('createdAt').defaultTo(knex.fn.now());
    });

    // Создание таблицы Referrers
    await knex.schema.createTable('Referrers', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('studentId').notNullable().references('id').inTable('Students').onDelete('CASCADE');
        table.integer('countOfUses').defaultTo(0);
        table.integer('bonusLessons').defaultTo(0);
        table.date('exp').nullable();
    });

    // Создание таблицы Payments
    await knex.schema.createTable('Payments', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('studentId').notNullable().references('id').inTable('Students').onDelete('CASCADE');
        table.uuid('refLinkId').nullable().references('id').inTable('Referrers').onDelete('SET NULL');
        table.string('amount').nullable();
        table.enum('paymentStatus', ['Pending', 'Success', 'Failed']);
        table.string('currency').nullable();
        table.date('addedAt').defaultTo(knex.fn.now());
    });

    // Создание таблицы Lessons
    await knex.schema.createTable('Lessons', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('studentId').notNullable().references('id').inTable('Students').onDelete('CASCADE');
        table.uuid('refLinkId').nullable().references('id').inTable('Referrers').onDelete('CASCADE');
        table.uuid('paymentId').nullable().references('id').inTable('Payments').onDelete('SET NULL');
        table.string('productName').notNullable();
        table.integer('countLessons').notNullable();
        table.date('addedAt').defaultTo(knex.fn.now());
    });
};

export const down = async (knex: Knex): Promise<void> => {
    // Удаление таблиц
    await knex.schema.dropTableIfExists('Payments');

    await knex.schema.dropTableIfExists('Lessons');

    await knex.schema.dropTableIfExists('Referrers');

    await knex.schema.dropTableIfExists('Students');
};