import mysql.connector as con



connector = con.connect(host='localhost', user='root', password='Soul#13211993', database='govconnect')
cursor = connector.cursor()
cursor.execute("INSERT INTO users (username, password, email) VALUES ('User123', 'User123', 'User@123')")

cursor.execute("Insert into users values('AdminH123', 'AdminH123', 'AdminH@123', 'healthcare_admin')")
cursor.execute("Insert into users values('AdminA123', 'AdminA123', 'AdminA@123', 'agriculture_admin')")


cursor.execute('Create table hospital(hospital_id varchar(100) primary key, name varchar(100), city varchar(100), state varchar(100), type varchar(10))')


a = [
    {
      "hospital_id": "HOS-DEL-001",
      "name": "Delhi Government General Hospital",
      "location": { "city": "New Delhi", "state": "Delhi" },
      "type": "government"
    },
    {
      "hospital_id": "HOS-DEL-002",
      "name": "Apollo Hospital Delhi",
      "location": { "city": "New Delhi", "state": "Delhi" },
      "type": "private"
    },

    {
      "hospital_id": "HOS-MUM-001",
      "name": "Mumbai Municipal Hospital",
      "location": { "city": "Mumbai", "state": "Maharashtra" },
      "type": "government"
    },
    {
      "hospital_id": "HOS-MUM-002",
      "name": "Lilavati Hospital",
      "location": { "city": "Mumbai", "state": "Maharashtra" },
      "type": "private"
    },

    {
      "hospital_id": "HOS-KOL-001",
      "name": "Kolkata Medical College Hospital",
      "location": { "city": "Kolkata", "state": "West Bengal" },
      "type": "government"
    },
    {
      "hospital_id": "HOS-KOL-002",
      "name": "AMRI Hospital Kolkata",
      "location": { "city": "Kolkata", "state": "West Bengal" },
      "type": "private"
    },

    {
      "hospital_id": "HOS-CHN-001",
      "name": "Chennai Government General Hospital",
      "location": { "city": "Chennai", "state": "Tamil Nadu" },
      "type": "government"
    },
    {
      "hospital_id": "HOS-CHN-002",
      "name": "Fortis Malar Hospital",
      "location": { "city": "Chennai", "state": "Tamil Nadu" },
      "type": "private"
    },

    {
      "hospital_id": "HOS-BLR-001",
      "name": "Bangalore Medical College Hospital",
      "location": { "city": "Bengaluru", "state": "Karnataka" },
      "type": "government"
    },
    {
      "hospital_id": "HOS-BLR-002",
      "name": "Manipal Hospital",
      "location": { "city": "Bengaluru", "state": "Karnataka" },
      "type": "private"
    },

    {
      "hospital_id": "HOS-HYD-001",
      "name": "Osmania General Hospital",
      "location": { "city": "Hyderabad", "state": "Telangana" },
      "type": "government"
    },
    {
      "hospital_id": "HOS-HYD-002",
      "name": "CARE Hospitals",
      "location": { "city": "Hyderabad", "state": "Telangana" },
      "type": "private"
    },

    {
      "hospital_id": "HOS-AHM-001",
      "name": "Civil Hospital Ahmedabad",
      "location": { "city": "Ahmedabad", "state": "Gujarat" },
      "type": "government"
    },
    {
      "hospital_id": "HOS-AHM-002",
      "name": "Zydus Hospital",
      "location": { "city": "Ahmedabad", "state": "Gujarat" },
      "type": "private"
    },

    {
      "hospital_id": "HOS-JAI-001",
      "name": "SMS Hospital Jaipur",
      "location": { "city": "Jaipur", "state": "Rajasthan" },
      "type": "government"
    },
    {
      "hospital_id": "HOS-JAI-002",
      "name": "Fortis Hospital Jaipur",
      "location": { "city": "Jaipur", "state": "Rajasthan" },
      "type": "private"
    },

    {
      "hospital_id": "HOS-LKO-001",
      "name": "King George Medical University",
      "location": { "city": "Lucknow", "state": "Uttar Pradesh" },
      "type": "government"
    },
    {
      "hospital_id": "HOS-LKO-002",
      "name": "Apollo Medics Lucknow",
      "location": { "city": "Lucknow", "state": "Uttar Pradesh" },
      "type": "private"
    },

    {
      "hospital_id": "HOS-BHP-001",
      "name": "AIIMS Bhopal",
      "location": { "city": "Bhopal", "state": "Madhya Pradesh" },
      "type": "government"
    },
    {
      "hospital_id": "HOS-BHP-002",
      "name": "Bansal Hospital",
      "location": { "city": "Bhopal", "state": "Madhya Pradesh" },
      "type": "private"
    },

    {
      "hospital_id": "HOS-PAT-001",
      "name": "PMCH Patna",
      "location": { "city": "Patna", "state": "Bihar" },
      "type": "government"
    },
    {
      "hospital_id": "HOS-PAT-002",
      "name": "Ford Hospital",
      "location": { "city": "Patna", "state": "Bihar" },
      "type": "private"
    },

    {
      "hospital_id": "HOS-RNC-001",
      "name": "RIMS Ranchi",
      "location": { "city": "Ranchi", "state": "Jharkhand" },
      "type": "government"
    },
    {
      "hospital_id": "HOS-RNC-002",
      "name": "Orchid Medical Centre",
      "location": { "city": "Ranchi", "state": "Jharkhand" },
      "type": "private"
    },

    {
      "hospital_id": "HOS-GHY-001",
      "name": "GMCH Guwahati",
      "location": { "city": "Guwahati", "state": "Assam" },
      "type": "government"
    },
    {
      "hospital_id": "HOS-GHY-002",
      "name": "Apollo Hospitals Guwahati",
      "location": { "city": "Guwahati", "state": "Assam" },
      "type": "private"
    }
]

for detail in a:
     cursor.execute(f"Insert into hospital values ('{detail['hospital_id']}', '{detail['name']}', '{detail['location']['city']}', '{detail['location']['state']}', '{detail['type']}')")
     connector.commit()
print("details saved")


a = [
    {"dr_name": "Dr. Anil Sharma",
      "hospital_id": "HOS-DEL-001",
      "gender": "Male",
      "time": "09:00-12:00"
    },
    {
      "dr_name": "Dr. Pooja Verma",
      "hospital_id": "HOS-DEL-001",
      "gender": "Female",
      "time": "16:00-20:00"
    },

    {
      "dr_name": "Dr. Amit Khanna",
      "hospital_id": "HOS-DEL-002",
      "gender": "Male",
      "time": "09:00-12:00"
    },
    {
      "dr_name": "Dr. Neha Kapoor",
      "hospital_id": "HOS-DEL-002",
      "gender": "Female",
      "time": "16:00-20:00"
    },

    {
      "dr_name": "Dr. Sanjay Patil",
      "hospital_id": "HOS-MUM-001",
      "gender": "Male",
      "time": "09:00-12:00"
    },
    {
      "dr_name": "Dr. Kavita Desai",
      "hospital_id": "HOS-MUM-001",
      "gender": "Female",
      "time": "16:00-20:00"
    },

    {
      "dr_name": "Dr. Rohit Shah",
      "hospital_id": "HOS-MUM-002",
      "gender": "Male",
      "time": "09:00-12:00"
    },
    {
      "dr_name": "Dr. Nidhi Jain",
      "hospital_id": "HOS-MUM-002",
      "gender": "Female",
      "time": "16:00-20:00"
    },

    {
      "dr_name": "Dr. Subhankar Das",
      "hospital_id": "HOS-KOL-001",
      "gender": "Male",
      "time": "09:00-12:00"
    },
    {
      "dr_name": "Dr. Rina Mukherjee",
      "hospital_id": "HOS-KOL-001",
      "gender": "Female",
      "time": "16:00-20:00"
    },

    {
      "dr_name": "Dr. Arijit Sen",
      "hospital_id": "HOS-KOL-002",
      "gender": "Male",
      "time": "09:00-12:00"
    },
    {
      "dr_name": "Dr. Sohini Ghosh",
      "hospital_id": "HOS-KOL-002",
      "gender": "Female",
      "time": "16:00-20:00"
    }
]


cursor.execute("Create table doctors (dr_name varchar(100), hospital_id varchar(100), gender varchar(100), time varchar(100))")
for details in a:
    cursor.execute(f"Insert into doctors values ('{details['dr_name']}', '{details['hospital_id']}', '{details['gender']}', '{details['time']}')")
    connector.commit()

print("doctor details saved")


a = [
  { "farmerName": "Ramesh Kumar", "mobileNumber": "9876543201", "location": "Hisar", "landArea": 3.5 },
  { "farmerName": "Suresh Yadav", "mobileNumber": "9876543202", "location": "Rewari", "landArea": 2.0 },
  { "farmerName": "Mahesh Patel", "mobileNumber": "9876543203", "location": "Anand", "landArea": 4.2 },
  { "farmerName": "Kiran Deshmukh", "mobileNumber": "9876543204", "location": "Nashik", "landArea": 5.0 },
  { "farmerName": "Vijay Pawar", "mobileNumber": "9876543205", "location": "Satara", "landArea": 1.8 },
  { "farmerName": "Raju Singh", "mobileNumber": "9876543206", "location": "Gaya", "landArea": 2.5 },
  { "farmerName": "Amit Verma", "mobileNumber": "9876543207", "location": "Kanpur", "landArea": 3.0 },
  { "farmerName": "Sunil Mishra", "mobileNumber": "9876543208", "location": "Prayagraj", "landArea": 2.2 },
  { "farmerName": "Naresh Meena", "mobileNumber": "9876543209", "location": "Kota", "landArea": 6.0 },
  { "farmerName": "Govind Lal", "mobileNumber": "9876543210", "location": "Bhilwara", "landArea": 4.8 },
  { "farmerName": "Anand Rao", "mobileNumber": "9876543211", "location": "Guntur", "landArea": 3.6 },
  { "farmerName": "Srinivas Reddy", "mobileNumber": "9876543212", "location": "Warangal", "landArea": 5.5 },
  { "farmerName": "Ravi Teja", "mobileNumber": "9876543213", "location": "Nellore", "landArea": 2.9 },
  { "farmerName": "Prakash Gowda", "mobileNumber": "9876543214", "location": "Mandya", "landArea": 4.0 },
  { "farmerName": "Shivappa H", "mobileNumber": "9876543215", "location": "Davangere", "landArea": 3.1 },
  { "farmerName": "Basavaraj K", "mobileNumber": "9876543216", "location": "Bagalkot", "landArea": 2.4 },
  { "farmerName": "Raghavan Nair", "mobileNumber": "9876543217", "location": "Palakkad", "landArea": 1.5 },
  { "farmerName": "Suresh Menon", "mobileNumber": "9876543218", "location": "Thrissur", "landArea": 2.1 },
  { "farmerName": "Manikandan S", "mobileNumber": "9876543219", "location": "Thanjavur", "landArea": 3.8 },
  { "farmerName": "Arun Kumar", "mobileNumber": "9876543220", "location": "Erode", "landArea": 4.6 },
  { "farmerName": "Mohan Das", "mobileNumber": "9876543221", "location": "Cooch Behar", "landArea": 1.9 },
  { "farmerName": "Subhash Ghosh", "mobileNumber": "9876543222", "location": "Burdwan", "landArea": 3.3 },
  { "farmerName": "Bikash Roy", "mobileNumber": "9876543223", "location": "Jalpaiguri", "landArea": 2.7 },
  { "farmerName": "Ashok Mahto", "mobileNumber": "9876543224", "location": "Dhanbad", "landArea": 2.0 },
  { "farmerName": "Ranjit Singh", "mobileNumber": "9876543225", "location": "Ludhiana", "landArea": 6.5 },
  { "farmerName": "Baldev Singh", "mobileNumber": "9876543226", "location": "Moga", "landArea": 7.2 },
  { "farmerName": "Harpreet Kaur", "mobileNumber": "9876543227", "location": "Patiala", "landArea": 3.9 },
  { "farmerName": "Gurmeet Singh", "mobileNumber": "9876543228", "location": "Amritsar", "landArea": 5.1 },
  { "farmerName": "Pankaj Sharma", "mobileNumber": "9876543229", "location": "Una", "landArea": 1.6 },
  { "farmerName": "Rohit Thakur", "mobileNumber": "9876543230", "location": "Solan", "landArea": 2.3 },
  { "farmerName": "Dinesh Rawat", "mobileNumber": "9876543231", "location": "Dehradun", "landArea": 1.8 },
  { "farmerName": "Mukul Joshi", "mobileNumber": "9876543232", "location": "Nainital", "landArea": 2.0 },
  { "farmerName": "Rakesh Yadav", "mobileNumber": "9876543233", "location": "Etawah", "landArea": 4.4 },
  { "farmerName": "Santosh Kumar", "mobileNumber": "9876543234", "location": "Muzaffarpur", "landArea": 2.6 },
  { "farmerName": "Ajay Prasad", "mobileNumber": "9876543235", "location": "Darbhanga", "landArea": 3.2 },
  { "farmerName": "Nitin Patil", "mobileNumber": "9876543236", "location": "Jalgaon", "landArea": 5.7 },
  { "farmerName": "Sachin Kale", "mobileNumber": "9876543237", "location": "Ahmednagar", "landArea": 4.9 },
  { "farmerName": "Pradeep Chavan", "mobileNumber": "9876543238", "location": "Latur", "landArea": 2.8 },
  { "farmerName": "Rajesh Solanki", "mobileNumber": "9876543239", "location": "Ujjain", "landArea": 3.6 },
  { "farmerName": "Mukesh Patel", "mobileNumber": "9876543240", "location": "Ratlam", "landArea": 4.1 },
  { "farmerName": "Bhupendra Singh", "mobileNumber": "9876543241", "location": "Alwar", "landArea": 5.3 },
  { "farmerName": "Kamaljeet Singh", "mobileNumber": "9876543242", "location": "Sirsa", "landArea": 6.1 },
  { "farmerName": "Sanjay Das", "mobileNumber": "9876543243", "location": "Barpeta", "landArea": 2.4 },
  { "farmerName": "Hemanta Bora", "mobileNumber": "9876543244", "location": "Jorhat", "landArea": 3.0 },
  { "farmerName": "Lalit Barman", "mobileNumber": "9876543245", "location": "Dhubri", "landArea": 1.7 },
  { "farmerName": "Rupesh Toppo", "mobileNumber": "9876543246", "location": "Ranchi", "landArea": 2.9 },
  { "farmerName": "Anil Sahu", "mobileNumber": "9876543247", "location": "Raipur", "landArea": 4.5 },
  { "farmerName": "Deepak Verma", "mobileNumber": "9876543248", "location": "Bilaspur", "landArea": 3.4 },
  { "farmerName": "Narayan Rout", "mobileNumber": "9876543249", "location": "Cuttack", "landArea": 2.6 },
  { "farmerName": "Pramod Behera", "mobileNumber": "9876543250", "location": "Puri", "landArea": 3.1 },

  { "farmerName": "Rahul Sharma", "mobileNumber": "9876543251", "location": "Delhi", "landArea": 2.5 },
  { "farmerName": "Vikram Singh", "mobileNumber": "9876543252", "location": "Mumbai", "landArea": 1.8 },
  { "farmerName": "Ajay Gupta", "mobileNumber": "9876543253", "location": "Chennai", "landArea": 3.2 },
  { "farmerName": "Arun Pillai", "mobileNumber": "9876543254", "location": "Bengaluru", "landArea": 2.9 },
  { "farmerName": "Rohit Nair", "mobileNumber": "9876543255", "location": "Kochi", "landArea": 1.7 },
  { "farmerName": "Manoj Kumar", "mobileNumber": "9876543256", "location": "Hyderabad", "landArea": 3.0 },
  { "farmerName": "Sandeep Mehta", "mobileNumber": "9876543257", "location": "Jaipur", "landArea": 4.2 },
  { "farmerName": "Vikas Sharma", "mobileNumber": "9876543258", "location": "Lucknow", "landArea": 3.5 },
  { "farmerName": "Harish Joshi", "mobileNumber": "9876543259", "location": "Pune", "landArea": 2.8 },
  { "farmerName": "Gaurav Choudhary", "mobileNumber": "9876543260", "location": "Ahmedabad", "landArea": 4.0 },
  { "farmerName": "Naveen Reddy", "mobileNumber": "9876543261", "location": "Vijayawada", "landArea": 3.6 },
  { "farmerName": "Ashok Kumar", "mobileNumber": "9876543262", "location": "Guwahati", "landArea": 2.4 },
  { "farmerName": "Rakesh Gupta", "mobileNumber": "9876543263", "location": "Indore", "landArea": 3.1 },
  { "farmerName": "Praveen Kumar", "mobileNumber": "9876543264", "location": "Bhopal", "landArea": 2.7 },
  { "farmerName": "Anuj Singh", "mobileNumber": "9876543265", "location": "Kolkata", "landArea": 3.3 },
  { "farmerName": "Ramesh Iyer", "mobileNumber": "9876543266", "location": "Thiruvananthapuram", "landArea": 1.9 },
  { "farmerName": "Sanjay Rao", "mobileNumber": "9876543267", "location": "Mysuru", "landArea": 2.8 },
  { "farmerName": "Vishal Mehta", "mobileNumber": "9876543268", "location": "Surat", "landArea": 3.5 },
  { "farmerName": "Rajesh Kumar", "mobileNumber": "9876543269", "location": "Nagpur", "landArea": 4.1 },
  { "farmerName": "Kartik Sharma", "mobileNumber": "9876543270", "location": "Bhubaneswar", "landArea": 3.0 },
  { "farmerName": "Rohit Verma", "mobileNumber": "9876543271", "location": "Shimla", "landArea": 2.2 },
  { "farmerName": "Suresh Patil", "mobileNumber": "9876543272", "location": "Kolhapur", "landArea": 3.8 },
  { "farmerName": "Anil Kumar", "mobileNumber": "9876543273", "location": "Raipur", "landArea": 2.5 },
  { "farmerName": "Rajat Singh", "mobileNumber": "9876543274", "location": "Agra", "landArea": 3.1 },
  { "farmerName": "Siddharth Rao", "mobileNumber": "9876543275", "location": "Coimbatore", "landArea": 2.7 },
  { "farmerName": "Madan Lal", "mobileNumber": "9876543276", "location": "Jammu", "landArea": 1.9 },
  { "farmerName": "Ravindra Joshi", "mobileNumber": "9876543277", "location": "Patna", "landArea": 2.6 },
  { "farmerName": "Deepak Kumar", "mobileNumber": "9876543278", "location": "Thane", "landArea": 3.4 },
  { "farmerName": "Vivek Sharma", "mobileNumber": "9876543279", "location": "Gorakhpur", "landArea": 2.5 },
  { "farmerName": "Sanjay Reddy", "mobileNumber": "9876543280", "location": "Vellore", "landArea": 2.9 }
]

cursor.execute("Create table farmers(farmerName varchar(100), mobileNumber bigint, location varchar(100), landArea decimal (18, 2))")

for detail in a:
    cursor.execute(f"Insert into farmers values('{detail['farmerName']}', {detail['mobileNumber']}, '{detail['location']}', '{detail['landArea']}')")
    connector.commit()

print("Farmers table updated")