/*
SBS website not updated with severe lack of info
source - https://landtransportguru.net
***THESE TIMINGS ARE NOT GUARANTEED TO BE CORRECT AS THERE ARE NO OFFICIAL RECORDS OF THESE TIMINGS***

Sengkang LRT – (STC) Sengkang
Destination	                            First Train	                                    Last Train
                                        Weekdays & Saturdays	Sun & Public Holidays	Daily
West Loop Outer via SW8 Renjong
(Platform 1 | Route A)	                5:33am	                5:53am	                12:37am
West Loop Inner via SW1 Cheng Lim
(Platform 2 | Route B)	                5:30am	                5:50am	                12:13am
East Loop Outer via SE1 Compassvale
(Platform 2 | Route C)	                5:25am	                5:45am	                12:21am
East Loop Inner via SE5 Ranggung
(Platform 1 | Route D)	                5:29am	                5:49am	                12:35am


Punggol LRT – (PTC) Punggol
Destination	                            First Train	                                    Last Train
                                        Weekdays & Sat	        Sun & Public Holidays	 Daily
West Loop Outer via PW7 Soo Teck
(Platform 1 | Route A)	                5:20am	                5:40am	                12:40am
West Loop Inner via PW1 Sam Kee
(Platform 2 | Route B)	                5:18am	                5:38am	                12:13am
East Loop Outer via PE7 Damai
(Platform 2 | Route C)                  5:20am	                5:40am	                12:20am
East Loop Inner via PE1 Cove
(Platform 1 | Route D)                  5:25am	                5:45am	                12:38am

*/

lrtTimings = {
    'Sengkang': {'codes': ['STC_A', 'STC_B', 'STC_C', 'STC_D'], 'A': {'First Trains | Mondays to Saturdays': '5.33am', 'First Trains | Sundays/Public Holidays': '5.53am', 'Last Trains': '12.37am'}, 'B': {'First Trains | Mondays to Saturdays': '5.30am', 'First Trains | Sundays/Public Holidays': '5.50am', 'Last Trains': '12.13am'}, 'C': {'First Trains | Mondays to Saturdays': '5.25am', 'First Trains | Sundays/Public Holidays': '5.45am', 'Last Trains': '12.21am'}, 'D': {'First Trains | Mondays to Saturdays': '5.29am', 'First Trains | Sundays/Public Holidays': '5.49am', 'Last Trains': '12.35am'}},
    'Compassvale' : {'codes': ['SE1'], 'C': {'First Trains | Mondays to Saturdays': '5.26am', 'First Trains | Sundays/Public Holidays': '5.46am', 'Last Trains': '12.23am'}, 'D': {'First Trains | Mondays to Saturdays': '5.37am', 'First Trains | Sundays/Public Holidays': '5.57am', 'Last Trains': '12.48am'}},
    'Rumbia' : {'codes': ['SE2'], 'C': {'First Trains | Mondays to Saturdays': '5.28am', 'First Trains | Sundays/Public Holidays': '5.48am', 'Last Trains': '12.25am'}, 'D': {'First Trains | Mondays to Saturdays': '5.36am', 'First Trains | Sundays/Public Holidays': '5.56am', 'Last Trains': '12.46am'}},
    'Bakau' : {'codes': ['SE3'], 'C': {'First Trains | Mondays to Saturdays': '5.30am', 'First Trains | Sundays/Public Holidays': '5.49am', 'Last Trains': '12.26am'}, 'D': {'First Trains | Mondays to Saturdays': '5.34am', 'First Trains | Sundays/Public Holidays': '5.54am', 'Last Trains': '12.42am'}},
    'Kangkar' : {'codes': ['SE4'], 'C': {'First Trains | Mondays to Saturdays': '5.31am', 'First Trains | Sundays/Public Holidays': '5.51am', 'Last Trains': '12.27am'}, 'D': {'First Trains | Mondays to Saturdays': '5.33am', 'First Trains | Sundays/Public Holidays': '5.53am', 'Last Trains': '12.40am'}},
    'Ranggung' : {'codes': ['SE5'], 'C': {'First Trains | Mondays to Saturdays': '5.33am', 'First Trains | Sundays/Public Holidays': '5.53am', 'Last Trains': '12.30am'}, 'D': {'First Trains | Mondays to Saturdays': '5.31am', 'First Trains | Sundays/Public Holidays': '5.51am', 'Last Trains': '12.37am'}},
    'Cheng Lim' : {'codes': ['SW1'], 'A': {'First Trains | Mondays to Saturdays': '5.44am', 'First Trains | Sundays/Public Holidays': '6.04am', 'Last Trains': '1.00am'}, 'B': {'First Trains | Mondays to Saturdays': '5.18am', 'First Trains | Sundays/Public Holidays': '5.38am', 'Last Trains': '12.16am'}},
    'Farmway' : {'codes': ['SW2'], 'A': {'First Trains | Mondays to Saturdays': '5.43am', 'First Trains | Sundays/Public Holidays': '6.03am', 'Last Trains': '12.59am'}, 'B': {'First Trains | Mondays to Saturdays': '5.19am', 'First Trains | Sundays/Public Holidays': '5.39am', 'Last Trains': '12.17am'}},
    'Kupang' : {'codes': ['SW3'], 'A': {'First Trains | Mondays to Saturdays': '5.42am', 'First Trains | Sundays/Public Holidays': '6.02am', 'Last Trains': '12.57am'}, 'B': {'First Trains | Mondays to Saturdays': '5.20am', 'First Trains | Sundays/Public Holidays': '5.42am', 'Last Trains': '12.18am'}},
    'Thanggam' : {'codes': ['SW4'], 'A': {'First Trains | Mondays to Saturdays': '5.41am', 'First Trains | Sundays/Public Holidays': '6.01am', 'Last Trains': '12.55am'}, 'B': {'First Trains | Mondays to Saturdays': '5.21am', 'First Trains | Sundays/Public Holidays': '5.41am', 'Last Trains': '12.19am'}},
    'Fernvale' : {'codes': ['SW5'], 'A': {'First Trains | Mondays to Saturdays': '5.40am', 'First Trains | Sundays/Public Holidays': '6.00am', 'Last Trains': '12.49am'}, 'B': {'First Trains | Mondays to Saturdays': '5.23am', 'First Trains | Sundays/Public Holidays': '5.43am', 'Last Trains': '12.21am'}},
    'Layar' : {'codes': ['SW6'], 'A': {'First Trains | Mondays to Saturdays': '5.38am', 'First Trains | Sundays/Public Holidays': '5.58am', 'Last Trains': '12.46am'}, 'B': {'First Trains | Mondays to Saturdays': '5.25am', 'First Trains | Sundays/Public Holidays': '5.45am', 'Last Trains': '12.23am'}},
    'Tongkang' : {'codes': ['SW7'], 'A': {'First Trains | Mondays to Saturdays': '5.36am', 'First Trains | Sundays/Public Holidays': '5.56am', 'Last Trains': '12.45am'}, 'B': {'First Trains | Mondays to Saturdays': '5.26am', 'First Trains | Sundays/Public Holidays': '5.46am', 'Last Trains': '12.24am'}},
    'Renjong' : {'codes': ['SW8'], 'A': {'First Trains | Mondays to Saturdays': '5.35am', 'First Trains | Sundays/Public Holidays': '5.55am', 'Last Trains': '12.42am'}, 'B': {'First Trains | Mondays to Saturdays': '5.28am', 'First Trains | Sundays/Public Holidays': '5.48am', 'Last Trains': '12.26am'}},
    
    'Punggol': {'codes': ['PTC_A', 'PTC_B', 'PTC_C', 'PTC_D'], 'A': {'First Trains | Mondays to Saturdays': '5.20am', 'First Trains | Sundays/Public Holidays': '5.40am', 'Last Trains': '12.40am'}, 'B': {'First Trains | Mondays to Saturdays': '5.18am', 'First Trains | Sundays/Public Holidays': '5.38am', 'Last Trains': '12.13am'}, 'C': {'First Trains | Mondays to Saturdays': '5.20am', 'First Trains | Sundays/Public Holidays': '5.40am', 'Last Trains': '12.20am'}, 'D': {'First Trains | Mondays to Saturdays': '5.25am', 'First Trains | Sundays/Public Holidays': '5.45am', 'Last Trains': '12.38am'}},
    'Cove' : {'codes': ['PE1'], 'C': {'First Trains | Mondays to Saturdays': '5.30am', 'First Trains | Sundays/Public Holidays': '5.50am', 'Last Trains': '12.30am'}, 'D': {'First Trains | Mondays to Saturdays': '5.27am', 'First Trains | Sundays/Public Holidays': '5.47am', 'Last Trains': '12.40am'}},
    'Meridian' : {'codes': ['PE2'], 'C': {'First Trains | Mondays to Saturdays': '5.29am', 'First Trains | Sundays/Public Holidays': '5.49am', 'Last Trains': '12.29am'}, 'D': {'First Trains | Mondays to Saturdays': '5.28am', 'First Trains | Sundays/Public Holidays': '5.48am', 'Last Trains': '12.43am'}},
    'Coral Edge' : {'codes': ['PE3'], 'C': {'First Trains | Mondays to Saturdays': '5.28am', 'First Trains | Sundays/Public Holidays': '5.48am', 'Last Trains': '12.28am'}, 'D': {'First Trains | Mondays to Saturdays': '5.30am', 'First Trains | Sundays/Public Holidays': '5.50am', 'Last Trains': '12.45am'}},
    'Riviera' : {'codes': ['PE4'], 'C': {'First Trains | Mondays to Saturdays': '5.26am', 'First Trains | Sundays/Public Holidays': '5.46am', 'Last Trains': '12.26am'}, 'D': {'First Trains | Mondays to Saturdays': '5.31am', 'First Trains | Sundays/Public Holidays': '5.51am', 'Last Trains': '12.48am'}},
    'Kadaloor' : {'codes': ['PE5'], 'C': {'First Trains | Mondays to Saturdays': '5.24am', 'First Trains | Sundays/Public Holidays': '5.44am', 'Last Trains': '12.25am'}, 'D': {'First Trains | Mondays to Saturdays': '5.33am', 'First Trains | Sundays/Public Holidays': '5.53am', 'Last Trains': '12.51am'}},
    'Oasis' : {'codes': ['PE6'], 'C': {'First Trains | Mondays to Saturdays': '5.23am', 'First Trains | Sundays/Public Holidays': '5.43am', 'Last Trains': '12.23am'}, 'D': {'First Trains | Mondays to Saturdays': '5.34am', 'First Trains | Sundays/Public Holidays': '5.54am', 'Last Trains': '12.53am'}},
    'Damai' : {'codes': ['PE7'], 'C': {'First Trains | Mondays to Saturdays': '5.22am', 'First Trains | Sundays/Public Holidays': '5.42am', 'Last Trains': '12.22am'}, 'D': {'First Trains | Mondays to Saturdays': '5.36am', 'First Trains | Sundays/Public Holidays': '5.55am', 'Last Trains': '12.55am'}},
    'Sam Kee' : {'codes': ['PW1'], 'A': {'First Trains | Mondays to Saturdays': '5.37am', 'First Trains | Sundays/Public Holidays': '5.57am', 'Last Trains': '12.48am'}, 'B': {'First Trains | Mondays to Saturdays': '5.18am', 'First Trains | Sundays/Public Holidays': '5.38am', 'Last Trains': '12.15am'}},
    'Teck Lee' : {'codes': ['PW2'], 'A': {'First Trains | Mondays to Saturdays': '5.36am', 'First Trains | Sundays/Public Holidays': '5.56am', 'Last Trains': '12.49am'}, 'B': {'First Trains | Mondays to Saturdays': '5.19am', 'First Trains | Sundays/Public Holidays': '5.39am', 'Last Trains': '12.16am'}},
    'Punggol Point' : {'codes': ['PW3'], 'A': {'First Trains | Mondays to Saturdays': '5.35am', 'First Trains | Sundays/Public Holidays': '5.55am', 'Last Trains': '12.48am'}, 'B': {'First Trains | Mondays to Saturdays': '5.20am', 'First Trains | Sundays/Public Holidays': '5.40am', 'Last Trains': '12.17am'}}, //source says 12.52am but more likely to be 12.17am
    'Samudera' : {'codes': ['PW4'], 'A': {'First Trains | Mondays to Saturdays': '5.34am', 'First Trains | Sundays/Public Holidays': '5.54am', 'Last Trains': '12.47am'}, 'B': {'First Trains | Mondays to Saturdays': '5.21am', 'First Trains | Sundays/Public Holidays': '5.41am', 'Last Trains': '12.18am'}},
    'Nibong' : {'codes': ['PW5'], 'A': {'First Trains | Mondays to Saturdays': '5.33am', 'First Trains | Sundays/Public Holidays': '5.53am', 'Last Trains': '12.46am'}, 'B': {'First Trains | Mondays to Saturdays': '5.22am', 'First Trains | Sundays/Public Holidays': '5.42am', 'Last Trains': '12.19am'}},
    'Sumang' : {'codes': ['PW6'], 'A': {'First Trains | Mondays to Saturdays': '5.32am', 'First Trains | Sundays/Public Holidays': '5.52am', 'Last Trains': '12.45am'}, 'B': {'First Trains | Mondays to Saturdays': '5.23am', 'First Trains | Sundays/Public Holidays': '5.43am', 'Last Trains': '12.20am'}},
    'Soo Teck' : {'codes': ['PW7'], 'A': {'First Trains | Mondays to Saturdays': '5.30am', 'First Trains | Sundays/Public Holidays': '5.50am', 'Last Trains': '12.43am'}, 'B': {'First Trains | Mondays to Saturdays': '5.25am', 'First Trains | Sundays/Public Holidays': '5.45am', 'Last Trains': '12.22am'}},
}

module.exports = {
    lrtTimings
}