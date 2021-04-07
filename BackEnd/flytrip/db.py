import pymysql.cursors
import click
from flask import current_app, g
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
    with db.cursor() as cursor:
        with current_app.open_resource('schema.sql') as f:
            cursor.execute(f.read().decode('utf8'))


@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables"""
    init_db()
    click.echo('Database initialized.')


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)