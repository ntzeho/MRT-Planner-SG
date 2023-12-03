from stations import stations_dict, stationType
from constants import *
from solver import outputJourney

from bs4 import BeautifulSoup
import requests
import webbrowser
from sys import argv

#webbrowser.open(SMRT_URL('Botanic Gardens'))

#print(stationType('Stevens'))

def scrapeSMRT(station):
    url = SMRT_URL(station)
    page = requests.get(SMRT_URL(station))
    print(page)

    soup = BeautifulSoup(page.content, "html.parser")
    results = soup.find(id = 'divTimesDetails')
    print(results)


def scrapeSBS(station):
    
    pass

def lastTrain(start, end, transfers):
    startType = stationType(start)
    endType = stationType(end)
    transferTypes = [stationType(transfer) if type(transfer) is str else [stationType(stn) for stn in transfer] for transfer in transfers]
    timings = []

    if startType['SMRT'] == 1:
        pass #scrap smrt
    if startType['SBS'] == 1:
        pass #scrap sbs

    if endType['SMRT'] == 1:
        pass #scrap smrt
    if endType['SBS'] == 1:
        pass #scrap sbs

    for transferType in transferTypes:
        if type(transferType) is list:
            continue

        if startType['SMRT'] == 1:
            pass #scrap smrt
        if startType['SBS'] == 1:
            pass #scrap sbs

    
    return timings


if __name__ == '__main__':
    
    scrapeSMRT('Botanic Gardens')
    exit()
    
    try:
        paths = outputJourney(argv[1], argv[2])
        for path in paths:
            fullPath, totalTime, transfers = path
            lastTrainTimings = lastTrain(argv[1], argv[2], transfers)
        print(paths)
            
    except IndexError:
        print('Ensure there are 2 arguments - start and end station!')
    except TypeError:
        print('Ensure that inputs are valid stations!')
