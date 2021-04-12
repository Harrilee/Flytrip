import click
import pymysql.cursors
from flask import g
from flask.cli import with_appcontext


def get_db():
    """
    Connect to the mysql database using pymysql
    :return: database instance in g
    """
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
    """
    Close database connection and remove it from g
    """
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    """
    Initialize database using schema.sql
    """
    db = get_db()
    stmts = parse_sql('schema.sql')
    with db.cursor() as cursor:
        for stmt in stmts:
            cursor.execute(stmt)
        db.commit()


def parse_sql(filename):
    """
    Parse multiline SQL statements into a list of strings
    :param filename: the name of the SQL file to parse
    :return: list of strings for each SQL statement
    """
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
    """
    Clear the existing data and create new tables using command flask init-db
    """
    init_db()
    click.echo('Database initialized.')


def init_app(app):
    """
    Initialize the app with init_db_command and ensure the app to close database connection when failing
    :param app: app to initialize
    """
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
