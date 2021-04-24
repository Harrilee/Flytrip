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
        'durationMin': 50,
        'date': '2021-04-08'
    },
    {
        'key': '2',
        'airline': 'China International Airline',
        'flight_num': 'CA9880',
        'departure_time': '09:10',
        'arrival_time': '12:05',
        'status': 'upcoming',
        'arrive_city': 'Chengdu',
        'arrive_airport': 'Shuangliu International Airport',
        'depart_city': "Shanghai",
        'depart_airport': "Hongqiao International Airport",
        'durationHour': 2,
        'durationMin': 20,
        'date': '2021-04-20'
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
        'durationMin': 20,
        'date': '2021-04-24'
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
        'durationMin': 20,
        'date': '2021-05-20'
    },
]

orderHistoryCustomer = [
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
        'status': 'ontime',
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
        'status': 'finished',
        'customer_name': 'Harry Lee 7',
        'customer_email': 'hl3797@nyu.edu'
    },
    {
        'key': '3',
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
        'status': 'delayed',
        'customer_name': 'Harry Lee 7',
        'customer_email': 'hl3797@nyu.edu'
    },
    {
        'key': '4',
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
        'status': 'delayed',
        'customer_name': 'Harry Lee 7',
        'customer_email': 'hl3797@nyu.edu'
    },
]

orderHistoryAgent = [
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
        'status': 'ontime',
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
        'status': 'finished',
        'customer_name': 'Harry Lee 2',
        'customer_email': 'hl3797@nyu.edu'
    },
    {
        'key': '3',
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
        'status': 'delayed',
        'customer_name': 'Harry Lee 2',
        'customer_email': 'hl3797@nyu.edu'
    },
    {
        'key': '4',
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
        'status': 'delayed',
        'customer_name': 'Harry Lee 3',
        'customer_email': 'hl3797@nyu.edu'
    },
    {
        'key': '4',
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
        'status': 'delayed',
        'customer_name': 'Harry Lee 3',
        'customer_email': 'hl3797@nyu.edu'
    },
    {
        'key': '4',
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
        'status': 'delayed',
        'customer_name': 'Harry Lee 4',
        'customer_email': 'hl3797@nyu.edu'
    },
    {
        'key': '4',
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
        'status': 'delayed',
        'customer_name': 'Harry Lee 4',
        'customer_email': 'hl3797@nyu.edu'
    },
    {
        'key': '4',
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
        'status': 'delayed',
        'customer_name': 'Harry Lee ',
        'customer_email': 'hl3797@nyu.edu'
    },
    {
        'key': '4',
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
        'status': 'delayed',
        'customer_name': 'Harry Lee 5',
        'customer_email': 'hl3797@nyu.edu'
    },
    {
        'key': '4',
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
        'status': 'delayed',
        'customer_name': 'Harry Lee 5',
        'customer_email': 'hl3797@nyu.edu'
    },
]

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
    'email': 'hl3794@nyu.edu',
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
selling = [
    {
        'month': 'Apr',
        'selling': 2031
    },
    {
        'month': 'May',
        'selling': 3059
    },
    {
        'month': 'Jun',
        'selling': 4889
    },
    {
        'month': 'Jul',
        'selling': 7809
    },
    {
        'month': 'Aug',
        'selling': 9009
    },
    {
        'month': 'Sep',
        'selling': 1056
    },
    {
        'month': 'Oct',
        'selling': 5302
    },
    {
        'month': 'Nov',
        'selling': 2032
    },
    {
        'month': 'Dec',
        'selling': 3035
    },
    {
        'month': 'Jan',
        'selling': 5068
    },
    {
        'month': 'Feb',
        'selling': 5042
    },
    {
        'month': 'Mar',
        'selling': 2895
    }
]
top_customer = [
    {
        'name': 'Harry Lee',
        'email': 'hl3794@nyu.edu',
        'spending': 8900
    },
    {
        'name': 'Harry Two',
        'email': 'hl3794_2@nyu.edu',
        'spending': 8750
    },
    {
        'name': 'Harry Three',
        'email': 'hl3794_3@nyu.edu',
        'spending': 7500
    },
    {
        'name': 'Harry Four',
        'email': 'hl3794_4@nyu.edu',
        'spending': 1050
    }
]

top_customer_ticket = [
    {
        'name': 'Harry Lee',
        'email': 'hl3794@nyu.edu',
        'ticket': 24
    },
    {
        'name': 'Harry Two',
        'email': 'hl3794_2@nyu.edu',
        'ticket': 22
    },
    {
        'name': 'Harry Three',
        'email': 'hl3794_3@nyu.edu',
        'ticket': 18
    },
    {
        'name': 'Harry Four',
        'email': 'hl3794_4@nyu.edu',
        'ticket': 16
    },
    {
        'name': 'Harry Four',
        'email': 'hl3794_4@nyu.edu',
        'ticket': 8
    }
]

top_customer_commission = [
    {
        'name': 'Harry Lee',
        'email': 'hl3794@nyu.edu',
        'commission': 25698
    },
    {
        'name': 'Harry Two',
        'email': 'hl3794_2@nyu.edu',
        'commission': 22222
    },
    {
        'name': 'Harry Three',
        'email': 'hl3794_3@nyu.edu',
        'commission': 10101
    },
    {
        'name': 'Harry Four',
        'email': 'hl3794_4@nyu.edu',
        'commission': 5059
    },
    {
        'name': 'Harry Four',
        'email': 'hl3794_4@nyu.edu',
        'commission': 2020
    }
]
top_agent = [
    {
        'name': 'Harry Lee Agent',
        'email': 'hl3794@nyu.edu',
        'tickets': 10,
        'selling': 62900
    },
    {
        'name': 'Harry Two Agent',
        'email': 'hl3794_2@nyu.edu',
        'tickets': 8,
        'selling': 52750
    },
    {
        'name': 'Harry Three Agent',
        'email': 'hl3794_3@nyu.edu',
        'tickets': 6,
        'selling': 45200
    },
    {
        'name': 'Harry Four Agent',
        'email': 'hl3794_4@nyu.edu',
        'tickets': 5,
        'selling': 35200
    }
]
