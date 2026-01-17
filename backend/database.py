import mysql.connector as con


connector = con.connect(host='localhost', user='root', password='Soul#13211993')
cursor = connector.cursor()
cursor.execute("show databases like 'govconnect'")
result = cursor.fetchone()
if result:
    print("Database exits")
else:
    cursor.execute(f"Create database govconnect")

    connector = con.connect(host='localhost', user='root', password='Soul#13211993', database='govconnect')
    cursor = connector.cursor()

    cursor.execute("""
# CREATE TABLE users (
#     username VARCHAR(100) PRIMARY KEY,
#     password VARCHAR(1000),
#     email VARCHAR(100),
#     usertype VARCHAR(100) DEFAULT 'user'
# )
# """)

class Database:
    def __init__(self):
        self.connector = con.connect(host='localhost', user='root', password='Soul#13211993', database='govconnect')
        self.cursor = self.connector.cursor()


    def login(self, username, password):
        self.cursor.execute(f"SELECT password from users where username = '{username}'")
        if self.cursor.fetchone()[0] == password:
            return 1
        else:
            return 0

    def register(self, username, password, email, user_type='user'):
        self.cursor.execute(f"Insert into users values ('{username}', '{password}', '{email}', '{user_type}'")

