from constants import SMRT_LINES, SBS_LINES, NO_CODE_I
import csv

class Station:
    def __init__(self, name, codes, neighbours):
        self.name = name
        self.codes = codes
        self.neighbours = neighbours

        #codes is a dictionary with the keys being the lines the station lies on, and the corresponding number

class Edge:
    def _init_(self, first, second, weight):
        self.first = first
        self.second = second
        self.weight = weight


class Map:
    def __init__(self, s, lines):
        self.lines = lines



stations_dict = {}
lines = {}
stationID = {}
with open('stations.csv', mode='r') as f:
    rows = csv.reader(f)
    for row in rows:
        if row[1] != 'mrt_station_english':
            if row[1] not in stations_dict:
                try:
                    stations_dict[row[1]] = [row[0]] + NO_CODE_I[row[1]]
                except:
                    stations_dict[row[1]] = [row[0]]
            else:
                stations_dict[row[1]].append(row[0])

            if row[0][:2] not in lines:
                lines[row[0][:2]] = [row[0]]
            else:
                lines[row[0][:2]].append(row[0])
value = 0
for station in stations_dict:
    stationID[station] = value
    value += 1

def getStationFromCode(code, useID = False):
    for station in stations_dict:
        if code in stations_dict[station]:
            return station if not useID else stationID[station]

def getConvertedEdges():
    toConvertEdges = []
    with open('edges.csv', mode='r') as f:
        edges = csv.reader(f)
        for edge in edges:
            toConvertEdges.append(edge)

    convertedEdges = [[getStationFromCode(edge[0]), getStationFromCode(edge[1])] + edge[2:] for edge in toConvertEdges]
    #print(convertedEdges)

    with open('edges_final.csv', mode='w', newline='') as f:
        for edge in convertedEdges:
            if edge[2] == '':
                f.write(edge[0] + ',' + edge[1] + ',1' + '\n')
            else:
                f.write(edge[0] + ',' + edge[1] + ',' + edge[2] + '\n')

def writeEdges():
    with open('edges.csv', mode='w', newline='') as f:
        for line in lines:
            for i in range(len(lines[line]) - 1):
                f.write(lines[line][i] + ',' + lines[line][i+1] + '\n')

#check if station belongs to SBS, SMRT or both
def stationType(station):
    isSBS, isSMRT = 0,0
    codes = stations_dict[station]
    for code in codes:
        if code[:2] in SMRT_LINES:
            isSMRT = 1
        elif code[:2] in SBS_LINES:
            isSBS = 1
    return {'SMRT': isSMRT, 'SBS': isSBS}

if __name__ == '__main__':
    getConvertedEdges()