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
    # usertype: super_admin for Super User, usertype: agriculture_admin for Admin for Agriculture and usertype: healthcare_admin for Admin of Healthcare and usertype: user for Normal User

    cursor.execute(
        'Create table hospital(hospital_id varchar(100) primary key, name varchar(100), city varchar(100), state varchar(100), type varchar(10))')

    cursor.execute(
        "Create table doctors (dr_name varchar(100), hospital_id varchar(100), gender varchar(100), time varchar(100), patients int not null default 0)")

    cursor.execute(
        "Create table farmers(farmerName varchar(100), mobileNumber bigint, location varchar(100), landArea decimal (18, 2))")

    cursor.execute(
        'Create table patients(name varchar(100), city varchar(100), state varchar(100), date varchar(30), gender varchar(100), hospital_id varchar(100), dr_name varchar(100), mobileNumber bigint)')

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
        self.cursor.execute(f"Insert into users values ('{username}', '{password}', '{email}', '{user_type}')")
        self.connector.commit()

    def search_hospitals(self, state, city):
        self.cursor.execute(f"Select name from hospital where state = '{state}' and city = '{city}'")
        return self.cursor.fetchall()

    def search_doctor(self, name):
        self.cursor.execute(f"Select hospital_id from hospital where name ='{name} and patients < 30'")
        result = self.cursor.fetchone()[0]
        self.cursor.execute(f"Select dr_name from doctors where hospital_id = '{result}'")
        return self.cursor.fetchall()

    def register_hospital(self, hospital_id, name, city, state, type):
        self.cursor.execute(f"Insert into hospital values ('{hospital_id}', '{name}', '{city}', '{state}', '{type}')")
        self.connector.commit()

    def register_doctor(self, dr_name, hospital_id, gender, time):
        self.cursor.execute(f"Insert into doctors values ('{dr_name}', '{hospital_id}', '{gender}', '{time}')")
        self.connector.commit()

    def register_patients(self, name, city, state, date, gender, hospital_name, dr_name, mobileNumber):
        self.cursor.execute(f"Select hospital_id from hospital where name = '{hospital_name}'")
        hospital_id = self.cursor.fetchone()[0]
        self.cursor.execute(f"Insert into patients values ('{name}', '{city}', '{state}', '{date}', '{gender}', '{hospital_id}', '{dr_name}', {mobileNumber})")
        self.connector.commit()
        self.cursor.execute(f"Update doctors set patients = patients + 1 where dr_name = '{dr_name}' and hospital_id = '{hospital_id}'")
        self.connector.commit()



