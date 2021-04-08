import click
import pymysql.cursors
from flask import g
from flask.cli import with_appcontext


#
# with connection:
#     with connection.cursor() as cursor:
#         # Create a new record
#         sql = "INSERT INTO `users` (`email`, `password`) VALUES (%s, %s)"
#         cursor.execute(sql, ('webmaster@python.org', 'very-secret'))
#
#     connection.commit()
#
#     with connection.cursor() as cursor:
#         sql = "SELECT `id`, `password` FROM `users` WHERE `email`=%s"
#         cursor.execute(sql, ('webmaster@python.org',))
#         result = cursor.fetchone()
#         print(result)


def get_db():
    if 'db' not in g:
        g.db = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='password',
            database='flytrip',
            cursorclass=pymysql.cursors.DictCursor
        )

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    db = get_db()
    stmts = parse_sql('schema.sql')
    with db.cursor() as cursor:
        for stmt in stmts:
            cursor.execute(stmt)
            print(stmt)
            print()
        db.commit()


def parse_sql(filename):
    data = open(filename, 'r').readlines()
    stmts = []
    DELIMITER = ';'
    stmt = ''

    for lineno, line in enumerate(data):
        if not line.strip():
            continue

        if line.startswith('--'):
            continue

        if 'DELIMITER' in line:
            DELIMITER = line.split()[1]
            continue

        if DELIMITER not in line:
            stmt += line.replace(DELIMITER, ';')
            continue

        if stmt:
            stmt += line
            stmts.append(stmt.strip())
            stmt = ''
        else:
            stmts.append(line.strip())
    return stmts


@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables"""
    init_db()
    click.echo('Database initialized.')


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
