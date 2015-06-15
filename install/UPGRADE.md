Quick guide for upgrading your database from Plug "v1" with sqlite

> YMMV based on whether you made any data customizations!  This is not intended to be an automated process.

1. Step 1 - IMPORTANT: Make a backup of your current sqlite database.  If this messes up, you don't want to lose all of your data!
2. Step 2 - Drop deprecated tables and rename tables in existing data file

    Run the following commands in an sqlite3 console:
    ```
    ALTER TABLE "SONGS" RENAME TO "zzz_old_songs";
    ALTER TABLE "PLAYS" RENAME TO "zzz_old_plays";
    ALTER TABLE "USERS" ADD COLUMN "is_imported" BOOLEAN DEFAULT 0;
    ALTER TABLE "USERS" RENAME TO "zzz_old_users";
    INSERT INTO "FACTS" SELECT null, "scottpilgrim", quote FROM "SCOTT_PILGRIM";
    UPDATE "FACTS" SET category = "catfacts" WHERE category = "cat";
    ALTER TABLE "FACTS" RENAME TO "zzz_old_facts";
    DROP TABLE "SCOTT_PILGRIM";
    DROP TABLE "CHAT";
    DROP TABLE "GIFTS";
    DROP TABLE "DISCIPLINE";
    DROP TABLE "SETTINGS";
    ```
3. Step 3 - Create a dump of your sqlite database from the command line
    > sqlite3 YourFileName.sqlite .dump > migrate.sql


IF STAYING ON SQLITE
========================
4. Step 4 - Import this dump into the new sqlite database side by side w/ the new schema
    > sqlite3 YourNewDatabase.sqlite < migrate.sql

IF CONVERTING TO MYSQL
========================
4. Step 4 - Edit the dumped SQLite file
    * replace all double-quotes (") with grave accents (´) (in vim just type :%s/"/´/)
    * replace "autoincrement" with "auto_increment"
    * replace "BEGIN TRANSACTION;" with "START TRANSACTION;" at beginning of the dump
    * remove all lines containing "sqlite_sequence"

5. Step 5 - import the resulting file into your MySQL database
    * Some lines may fail due to bad data.  Since this is set up to be transactional, fix the lines as you go

6. Check out the migrate.sql file to merge the songs down when using different CIDs (new plug system)
