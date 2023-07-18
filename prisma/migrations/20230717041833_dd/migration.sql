/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `create_time` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `update_time` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `post_authorId_fkey`;

-- DropIndex
DROP INDEX `user_email_key` ON `user`;

-- DropIndex
DROP INDEX `user_name_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `create_time`,
    DROP COLUMN `email`,
    DROP COLUMN `password`,
    DROP COLUMN `update_time`,
    ADD COLUMN `age` INTEGER NULL,
    ADD COLUMN `price` INTEGER NULL,
    ADD COLUMN `total` INTEGER NULL,
    MODIFY `id` INTEGER NULL,
    MODIFY `name` VARCHAR(15) NULL;

-- DropTable
DROP TABLE `post`;

-- CreateTable
CREATE TABLE `department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `department_name` VARCHAR(15) NULL,
    `manager_id` INTEGER NULL,
    `location_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(15) NULL,
    `last_name` VARCHAR(15) NULL,
    `email` VARCHAR(225) NULL,
    `phone_number` INTEGER NULL,
    `job_id` INTEGER NULL,
    `salary` FLOAT NULL,
    `manager_id` INTEGER NULL,
    `department_id` INTEGER NULL,
    `commission_pct` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_grade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grade_level` VARCHAR(1) NULL,
    `lowest_sal` INTEGER NULL,
    `highest_sal` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `street_adress` VARCHAR(225) NULL,
    `postal_code` INTEGER NULL,
    `city` VARCHAR(15) NULL,
    `state_province` VARCHAR(15) NULL,
    `country_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
