import csv
from sys import argv

SMRT_LINES = ['EW', 'CG', 'NS', 'BP', 'CC', 'CE', 'TE']
SBS_LINES = ['NE', 'DT', 'SW', 'SE', 'PW', 'PE']
SENGKANG_PUNGGOL_LINES = ['STC_A', 'STC_B', 'STC_C', 'STC_D', 'SE', 'SW',\
                          'PTC_A','PTC_B', 'PTC_C','PTC_D', 'PE', 'PW']
SENGKANG_PUNGGOL_ORIGINAL_CODE = ['STC', 'PTC']
BUKIT_PANJANG_LRT_ORIGINAL_EDGES = ['BP1,BP2', 'BP2,BP3', 'BP3,BP4', 'BP4,BP5', 'BP5,BP6', 'BP6,BP7']

TRANSFER_TIME = 5

NO_CODE_I = {'Tanah Merah': ['CG'], 'Promenade': ['CE']}
"""
BUKIT PANJANG LRT:
a - BP6 to BP13
b - BP6 to BP7

SENGKANG LRT:
Route A - West high
Route B - West 1
Route C - East 1
Route D - East high

PUNGGOL LRT:
Route A - West high
Route B - West 1
Route C - East high
Route D - East 1
"""
EDGES_TO_ADD = ['CG,CG1,3', 'CE,CE1,2',\
                'BP1_a,BP2_a,2', 'BP2_a,BP3_a,2', 'BP3_a,BP4_a,1', 'BP4_a,BP5_a,1', 'BP5_a,BP6_a,2',\
                'BP1_b,BP2_b,2', 'BP2_b,BP3_b,2', 'BP3_b,BP4_b,1', 'BP4_b,BP5_b,1', 'BP5_b,BP6_b,2',\
                'BP1_a,BP1_b,5', 'BP2_a,BP2_b,5', 'BP3_a,BP3_b,5', 'BP4_a,BP4_b,5', 'BP5_a,BP5_b,5', \
                'BP6_a,BP6_b,5', 'BP6_b,BP7,1', 'BP6_a,BP13,1',\
                'STC_A,STC_B,5', 'STC_A,STC_C,5', 'STC_A,STC_D,5', 'STC_B,STC_C,5', 'STC_B,STC_D,5', 'STC_C,STC_D,5',\
                'PTC_A,PTC_B,5', 'PTC_A,PTC_C,5', 'PTC_A,PTC_D,5', 'PTC_B,PTC_C,5', 'PTC_B,PTC_D,5', 'PTC_C,PTC_D,5',\
                'STC_B,SW1,2', 'STC_A,SW8,3', 'STC_C,SE1,2', 'STC_D,SE5,3', \
                'PTC_B,PW1,2', 'PTC_A,PW7,3', 'PTC_D,PE1,3', 'PTC_C,PE7,2']
SPECIAL_STATIONS = [['BP6_a', 'BP6_b'], ['STC_A', 'STC_B'], ['STC_C', 'STC_D'], ['PTC_A', 'PTC_B'], ['PTC_C', 'PTC_D']]

walkingTime = {('Bras Basah', 'Bencoolen'): ['3 minutes walk | Bras Basah Exit B/C <-> Bencoolen Exit C for underpass through SMU. Walking on street level is fine as well.', 3], \
                ('Raffles Place', 'Downtown'): ['7 minutes walk | Raffles Place Exit J <-> Downtown Exit B for underpass through Marina Bay Link Mall', 7], \
                    ('Esplanade', 'City Hall'): ['5 minutes walk | Esplanade Exit G <-> City Hall Exit A for transfer through Raffles City Shopping Mall Basement 2', 5]}

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
                    if 'BP' in row[0] and int(row[0][2:]) <= 6:
                        stations_dict[station] = [row[0]+'_a', row[0]+'_b']
                    else:
                        stations_dict[station] = [row[0]]
            else:
                if row[0] in SENGKANG_PUNGGOL_ORIGINAL_CODE:
                    stations_dict[station].append(row[0]+'_A')
                    stations_dict[station].append(row[0]+'_B')
                    stations_dict[station].append(row[0]+'_C')
                    stations_dict[station].append(row[0]+'_D')
                elif 'BP' in row[0] and int(row[0][2:]) <= 6:
                    stations_dict[station].append(row[0]+'_a')
                    stations_dict[station].append(row[0]+'_b')
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
                if edge not in unweighted_edges and edge not in BUKIT_PANJANG_LRT_ORIGINAL_EDGES:
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

        f.write('const specialStations = ' + str(SPECIAL_STATIONS) + '\n\n')
        f.write('const transferTime = ' + str(TRANSFER_TIME) + '\n\n')

        f.write('module.exports = {\n')
        f.write('    travelTime,\n')
        f.write('    walkingTime,\n')
        f.write('    specialStations,\n')
        f.write('    transferTime\n')
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