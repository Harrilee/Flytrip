ticketDataSource = [
    {
        'key': '1',
        'date': '2021-04-08',
        'airline': 'China Eastern Airline',
        'flight_num': 'MU5401',
        'departure_time': '08:10',
        'arrival_time': '11:05',
        'FCprice': 2410,
        'BCprice': 2330,
        'ECprice': 1720,
        'FCSellable': True,
        'BCSellable': False,
        'ECSellable': True,
        'arrive_city': 'Chengdu',
        'arrive_airport': 'Shuangliu International Airport',
        'depart_city': "Shanghai",
        'depart_airport': "Hongqiao International Airport",
        'durationHour': 3,
        'durationMin': 50
    },
    {
        'key': '2',
        'date': '2021-04-08',
        'airline': 'China International Airline',
        'flight_num': 'CA9880',
        'departure_time': '09:10',
        'arrival_time': '12:05',
        'FCprice': 2410,
        'BCprice': 2330,
        'ECprice': 1720,
        'FCSellable': True,
        'BCSellable': True,
        'ECSellable': False,
        'arrive_city': 'Chengdu',
        'arrive_airport': 'Shuangliu International Airport',
        'depart_city': "Shanghai",
        'depart_airport': "Hongqiao International Airport",
        'durationHour': 2,
        'durationMin': 20
    },
    {
        'key': '3',
        'date': '2021-04-08',
        'airline': 'China International Airline',
        'flight_num': 'CA9880',
        'departure_time': '09:10',
        'arrival_time': '12:05',
        'FCprice': 2410,
        'BCprice': 2330,
        'ECprice': 1720,
        'FCSellable': False,
        'BCSellable': True,
        'ECSellable': True,
        'arrive_city': 'Chengdu',
        'arrive_airport': 'Shuangliu International Airport',
        'depart_city': "Shanghai",
        'depart_airport': "Hongqiao International Airport",
        'durationHour': 2,
        'durationMin': 20
    },
    {
        'key': '4',
        'date': '2021-04-08',
        'airline': 'China International Airline',
        'flight_num': 'CA9880',
        'departure_time': '09:10',
        'arrival_time': '12:05',
        'FCprice': 2410,
        'BCprice': 2330,
        'ECprice': 1720,
        'FCSellable': True,
        'BCSellable': True,
        'ECSellable': True,
        'arrive_city': 'Chengdu',
        'arrive_airport': 'Shuangliu International Airport',
        'depart_city': "Shanghai",
        'depart_airport': "Hongqiao International Airport",
        'durationHour': 2,
        'durationMin': 20
    },
]

statusDataSource = [
    {
        'key': '1',
        'airline': 'China Eastern Airline',
        'flight_num': 'MU5401',
        'departure_time': '08:10',
        'arrival_time': '11:05',
        'status': 'delayed',
        'arrive_city': 'Chengdu',
        'arrive_airport': 'Shuangliu International Airport',
        'depart_city': "Shanghai",
        'depart_airport': "Hongqiao International Airport",
        'durationHour': 3,
        'durationMin': 50
    },
    {
        'key': '2',
        'airline': 'China International Airline',
        'flight_num': 'CA9880',
        'departure_time': '09:10',
        'arrival_time': '12:05',
        'status': 'delayed',
        'arrive_city': 'Chengdu',
        'arrive_airport': 'Shuangliu International Airport',
        'depart_city': "Shanghai",
        'depart_airport': "Hongqiao International Airport",
        'durationHour': 2,
        'durationMin': 20
    },
    {
        'key': '3',
        'airline': 'China International Airline',
        'flight_num': 'CA9880',
        'departure_time': '09:10',
        'arrival_time': '12:05',
        'status': 'ontime',
        'arrive_city': 'Chengdu',
        'arrive_airport': 'Shuangliu International Airport',
        'depart_city': "Shanghai",
        'depart_airport': "Hongqiao International Airport",
        'durationHour': 2,
        'durationMin': 20
    },
    {
        'key': '4',
        'airline': 'China International Airline',
        'flight_num': 'CA9880',
        'departure_time': '09:10',
        'arrival_time': '12:05',
        'status': 'delayed',
        'arrive_city': 'Chengdu',
        'arrive_airport': 'Shuangliu International Airport',
        'depart_city': "Shanghai",
        'depart_airport': "Hongqiao International Airport",
        'durationHour': 2,
        'durationMin': 20
    },
]

orderHistory = {
    'spending': 99998,
    'spending30': 23569,  # The amount of spending over the past 30 days
    'commission': 9999.8,  # ONLY AVAILABLE FOR AGENTS
    'commission30': 2356.9,  # ONLY AVAILABLE FOR AGENTS
    'order': 5,
    'in_progress': 2,
    'finished': 3,
    'details': [
        {
            'key': '1',
            'date': '2021-04-08',
            'airline': 'China Eastern Airline',
            'flight_num': 'MU5401',
            'departure_time': '08:10',
            'arrival_time': '11:05',
            'price': 2410,
            'arrive_city': 'Chengdu',
            'arrive_airport': 'Shuangliu International Airport',
            'depart_city': "Shanghai",
            'depart_airport': "Hongqiao International Airport",
            'durationHour': 3,
            'durationMin': 50,
            'purchase_time': '2021-04-09 17:59:03',
            'status': 'In progress',
            'customer_name': 'Harry Lee',
            'customer_email': 'hl3794@nyu.edu'
        },
        {
            'key': '2',
            'date': '2021-04-20',
            'airline': 'China Eastern Airline',
            'flight_num': 'MU5401',
            'departure_time': '18:15',
            'arrival_time': '21:45',
            'price': 2987,
            'arrive_city': 'Chengdu',
            'arrive_airport': 'Shuangliu International Airport',
            'depart_city': "Shanghai",
            'depart_airport': "Hongqiao International Airport",
            'durationHour': 3,
            'durationMin': 50,
            'purchase_time': '2021-04-09 17:59:03',
            'status': 'Finished',
            'customer_name': 'Harry Lee 7',
            'customer_email': 'hl3797@nyu.edu'
        },
    ]
}

passengers = {
    'FC': [
        {
            'name': 'Harry Lee',
            'email': 'hl3794@nyu.edu'
        },
        {
            'name': 'Harry Two',
            'email': 'hl3794_2@nyu.edu'
        },
        {
            'name': 'Harry Three',
            'email': 'hl3794_3@nyu.edu'
        },
        {
            'name': 'Harry Four',
            'email': 'hl3794_4@nyu.edu'
        }
    ],
    'BC': [
        {
            'name': 'BCHarry Lee',
            'email': 'hl3794@nyu.edu'
        },
        {
            'name': 'BCHarry Two',
            'email': 'hl3794_2@nyu.edu'
        },
        {
            'name': 'BCHarry Three',
            'email': 'hl3794_3@nyu.edu'
        },
        {
            'name': 'BCHarry Four',
            'email': 'hl3794_4@nyu.edu'
        }
    ],
    'EC': [
        {
            'name': 'ECHarry Lee',
            'email': 'hl3794@nyu.edu'
        },
        {
            'name': 'ECHarry Two',
            'email': 'hl3794_2@nyu.edu'
        },
        {
            'name': 'ECHarry Three',
            'email': 'hl3794_3@nyu.edu'
        },
        {
            'name': 'ECHarry Four',
            'email': 'hl3794_4@nyu.edu'
        }
    ]
}

passenger_info = {
    'email':'hl3794@nyu.edu',
    'firstname': 'Harry',
    'lastname': 'Lee',
    'building_number': 403,
    'street': 'Harry_street',
    'city': 'Shanghai',
    'state': 'China',
    'phone_number': 10001,
    'passport_number': 'ABCDE',
    'passport_expiration': '1997-05-08',
    'passport_country': 'China',
    'date_of_birth': '2005-06-08'
}
