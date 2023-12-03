SMRT_DEFAULT_URL = 'http://journey.smrt.com.sg/journey/station_info/<>/first-and-last-train/'
SBS_URL = 'https://www.sbstransit.com.sg/first-train-last-train'

def SMRT_URL(station):
    return SMRT_DEFAULT_URL.replace('<>', station.lower().replace(' ','-'))

SMRT_LINES = ['EW', 'CG', 'NS', 'BP', 'CC', 'CE', 'TE']
SBS_LINES = ['NE', 'DT', 'SW', 'SE', 'PW', 'PE']

TRANSFER_TIME = 5

EW_NS_I = ['City Hall', 'Raffles Place']
DT_CE_I = ['Promenade', 'Bayfront']

NO_CODE_I = {'Tanah Merah': ['CG'], 'Promenade': ['CE'], \
             'Sengkang': ['SW', 'SE'], 'Punggol': ['PW', 'PE']}