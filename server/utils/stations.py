import csv
from sys import argv

SMRT_LINES = ['EW', 'CG', 'NS', 'BP', 'CC', 'CE', 'TE']
SBS_LINES = ['NE', 'DT', 'SW', 'SE', 'PW', 'PE']

TRANSFER_TIME = 5

NO_CODE_I = {'Tanah Merah': ['CG'], 'Promenade': ['CE']}

EDGES_TO_ADD = ['CG,CG1,3', 'CE,CE1,2', 'BP6,BP13,1', 'STC,SW1,2', 'STC,SW8,3', 'STC,SE1,2', 'STC,SE5,3', 'PTC,PW1,2', 'PTC,PW7,3', 'PTC,PE1,3', 'PTC,PE7,2']

walkingTime = {('Bras Basah', 'Bencoolen'): ['--DIRECTIONS--', 3], \
                ('Raffles Place', 'Downtown'): ['--DIRECTIONS--', 7], \
                    ('Esplanade', 'City Hall'): ['--DIRECTIONS--', 5]}

stations_dict = {}
lines = {}

with open('./utils/stations.csv', mode='r') as f:
    rows = csv.reader(f)
    for row in rows:
        if row[1] != 'mrt_station_english':
            station = row[1].lstrip().rstrip()
            if station not in stations_dict:
                try:
                    stations_dict[station] = [row[0]] + NO_CODE_I[station]
                except:
                    stations_dict[station] = [row[0]]
            else:
                stations_dict[station].append(row[0])

            if row[0][:2] not in lines:
                lines[row[0][:2]] = [row[0]]
            else:
                lines[row[0][:2]].append(row[0])

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


def editEdges():
    try:
        with open('./utils/edges.csv', mode='r') as f:
            rows = csv.reader(f)
            edges = [''.join([cell+',' for cell in row]).rstrip(',') for row in rows]
    except:
        edges = [] #file not created yet

    unweighted_edges = [edge.split(',')[0] + ',' + edge.split(',')[1] for edge in edges]
    with open('./utils/stations.csv', mode='r') as f:
        rows = list(csv.reader(f))
        for i in range(1,len(rows)-1):
            if rows[i][0][:2] == rows[i+1][0][:2]:
                edge = rows[i][0] + ',' + rows[i+1][0]
                if edge not in unweighted_edges:
                    edges.append(edge)

    for station in stations_dict:
        codes = stations_dict[station]
        if len(codes) > 1:
            for i in range(len(codes)-1):
                for j in range(i+1,len(codes)):
                    edge = codes[i] + ',' + codes[j] + ',' + str(TRANSFER_TIME)
                    if edge not in edges:
                        edges.append(edge)

    for edge in EDGES_TO_ADD:
        if edge not in edges:
            edges.append(edge)
    
    with open('./utils/edges.csv', mode='w', newline='') as f:
        for edge in edges:
            f.write(edge+'\n')

def writeEdgesJS():
    travelTime = {}
    with open("./utils/edges.csv", mode='r') as f:
        rows = csv.reader(f)
        for row in rows:
            travelTime[(row[0], row[1])] = row[2]

    with open('./constants/edges.js', mode='w') as f:
        f.write('const travelTime = {\n')
        for edge in travelTime:
            f.write('    '+"'"+edge[0]+','+edge[1]+"'"+' : '+travelTime[edge]+',' + '\n')
        f.write('}\n\n')

        f.write('const walkingTime = {\n')
        for edge in walkingTime:
            f.write('    '+"'"+edge[0]+","+edge[1]+"'"+' : '+str(walkingTime[edge])+',' + '\n')
        f.write('}\n\n')

        f.write('module.exports = {\n')
        f.write('    travelTime,\n')
        f.write('    walkingTime,\n')
        f.write('}')

def writeStations(): #../constants/stations.js
    with open('./constants/stations.js', mode='w') as f:
        f.write('const stations_dict = {\n')
        for station in stations_dict:
            f.write('    '+"'"+station+"' : "+str(stations_dict[station])+',\n')
        f.write('}\n\n')

        f.write('module.exports = {\n')
        f.write('    stations_dict,\n')
        f.write('}')

def main():
    if len(argv) > 1:
        if argv[1] == '/editEdges':
            editEdges()

        elif argv[1] == '/writeEdges':
            writeEdgesJS()
        
        elif argv[1] == '/writeStations':
            writeStations()

if __name__ == '__main__':
    main()