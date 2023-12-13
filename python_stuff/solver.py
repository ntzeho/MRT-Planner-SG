import csv
from stations import stations_dict
from heapQueue import heappop, heappush
from sys import argv

WALKING_TIME = {('Bras Basah', 'Bencoolen'): 3, ('Raffles Place', 'Downtown'): 7, ('Esplanade', 'City Hall'): 5}

travelTime = {}
with open("edges.csv", mode='r') as f:
    rows = csv.reader(f)
    for row in rows:
        travelTime[(row[0], row[1])] = int(row[2])

def getStationFromCode(code):
    for station in stations_dict:
        if code in stations_dict[station]:
            return station

def getNeighbours(station, exclude=''):
    return [edge[edge.index(station) - 1] for edge in travelTime if station in edge and station != exclude]

def commonLines(stn1, stn2):
    lines1 = [code[:2] for code in stations_dict[stn1]]
    lines2 = [code[:2] for code in stations_dict[stn2]]
    return [line for line in lines1 if line in lines2]

def checkDirect(path):
    for i in range(len(path)-1):
        if path[i][:2] != path[i+1][:2]:
            return False
    return True

def transferStation(path):
    return [getStationFromCode(path[i]) for i in range(len(path)-1) if getStationFromCode(path[i]) == getStationFromCode(path[i+1])]

    # if len(path) < 3:
    #     return []
    # if len(path) == 3:
    #     return [path[1]] if checkTransfer(path) else []
    
    # extraCheck = False
    # transfers = []
    # for i in range(len(path)-2):
    #     if extraCheck:
    #         checkPath = path[i-1:i+3]
    #     else:
    #         checkPath = path[i:i+3]

    #     if checkTransfer(checkPath):
    #         transfers.append(path[i+1])
    #     elif EW_NS_I[0] in checkPath and EW_NS_I[1] in checkPath:
    #         extraCheck = True
    #     elif DT_CE_I[0] in checkPath and DT_CE_I[1] in checkPath:
    #         extraCheck = True
    #     else:
    #         extraCheck = False

    # if EW_NS_I[0] in transfers and EW_NS_I[1] in path:
    #     transfers[transfers.index(EW_NS_I[0])] = EW_NS_I

    # elif EW_NS_I[1] in transfers and EW_NS_I[0] in path:
    #     transfers[transfers.index(EW_NS_I[1])] = EW_NS_I

    # elif DT_CE_I[0] in transfers and DT_CE_I[1] in path:
    #     if path[path.index(DT_CE_I[0])-1] == DT_CE_I[1]:
    #         transfers[transfers.index(DT_CE_I[0])] = DT_CE_I

    # elif DT_CE_I[1] in transfers and DT_CE_I[0] in path:
    #     transfers[transfers.index(DT_CE_I[1])] = DT_CE_I

    return transfers

def totalTime(path):
    time = 0
    for i in range(len(path)-1):
        try:
            time += travelTime[(path[i], path[i+1])]
        except:
            time += travelTime[(path[i+1], path[i])]
    return time

def reconstruct_path(came_from, current):
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    return path[::-1]

def convertPathToStations(path):
    namePath = []
    for code in path:
        stationName = getStationFromCode(code)
        if stationName not in namePath:
            namePath.append(stationName)
    return namePath
    return list(dict.fromkeys([getStationFromCode(code) for code in path]))

def astar(start, end, exclude=''):
    open_list = []
    closed_set = set()
    came_from = {}
    g_score = {code: float('inf') for station in stations_dict for code in stations_dict[station]}
    g_score[start] = 0
    f_score = {code: float('inf') for station in stations_dict for code in stations_dict[station]}
    f_score[start] = 0

    heappush(open_list, (f_score[start], start))

    while open_list:
        current_f, current = heappop(open_list)

        if current == end:
            path = reconstruct_path(came_from, current)
            return path, convertPathToStations(path), transferStation(path), g_score[current]
        
        closed_set.add(current)

        for neighbor in getNeighbours(current, exclude):
            if (current, neighbor) in travelTime:
                tentative_g_score = g_score[current] + travelTime.get((current, neighbor), float('inf'))
            else:
                tentative_g_score = g_score[current] + travelTime.get((neighbor, current), float('inf'))

            if tentative_g_score < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score

                f_score[neighbor] = g_score[neighbor]
                
                if neighbor not in closed_set:
                    heappush(open_list, (f_score[neighbor], neighbor))

    return None


def outputJourney(start, end):
    def sortTime(journey):
        return journey[-1]

    paths = [astar(code_start, code_end) for code_start in stations_dict[start] for code_end in stations_dict[end]]
    paths.sort(key=sortTime)

    reverse_paths = [astar(code_end, code_start) for code_start in stations_dict[start] for code_end in stations_dict[end]]
    reverse_paths.sort(key=sortTime)

    toKeep = [paths[i] for i in range(len(paths)) if paths[i][-1] == paths[0][-1] or (paths[i][-1] - paths[0][-1] <= 3 and len(paths[i][2]) <= len(paths[0][2]))]
    toKeepReverse = [reverse_paths[i] for i in range(len(reverse_paths)) if reverse_paths[i][-1] == reverse_paths[0][-1] or (reverse_paths[i][-1] - reverse_paths[0][-1] <= 3 and len(reverse_paths[i][2]) <= len(reverse_paths[0][2]))]

    for path in toKeep:
        for r_path in toKeepReverse:
            path_code, path_name = path[:2]
            r_path_code, r_path_name, r_path_transfer, r_time = r_path[0][::-1], r_path[1][::-1], r_path[2][::-1], r_path[3]

            if r_path_name == path_name and r_path_code != path_code:
                path_transfer_unique = [getStationFromCode(code) for code in path_code if code not in r_path_code]
                r_path_transfer_unique = [getStationFromCode(code) for code in r_path_code if code not in path_code]

                if path_transfer_unique != r_path_transfer_unique:
                    toKeep.append((r_path_code, r_path_name, r_path_transfer, r_time))

    toKeep.sort(key=sortTime)
    directPaths = [path for path in toKeep if checkDirect(path[0])]
    directLines = commonLines(start, end)

    if directLines != [] and len(directPaths) == 0:
        for line in directLines:
            directPath = []
            for code in stations_dict[start]:
                if code[:2] in directLines:
                    startCode = code
                    break
            
            for code in stations_dict[end]:
                if code[:2] in directLines:
                    endCode = code
                    break

            startNo = int(startCode[2:])
            endNo = int(endCode[2:])
            order = -int((startNo - endNo)/abs(startNo - endNo))

            directPath = [line+str(i) for i in range(startNo, endNo + order, order) if getStationFromCode(line + str(i)) is not None]

            toKeep.append((directPath, convertPathToStations(directPath), [], totalTime(directPath)))

    #to add in code to take into account walking stations

    return toKeep

def testAlgo():
    lst = [station for station in stations_dict]

    with open('testAlgo.js', mode='w') as f:
        f.write('const totalPaths = {\n')
        for i in range(len(lst)-1):
            for j in range(1, len(lst)):
                f.write('    ' + "'" + lst[i] + ',' +  lst[j] + "': "+str(len(outputJourney(lst[i], lst[j]))) + ',\n')
    
        f.write('}')

if __name__ == '__main__':
    try:
        print(outputJourney(argv[1], argv[2]))
    except IndexError:
        try:
            if argv[1] == '/testAlgo':
                testAlgo()
            else:
                print('Ensure there are 2 arguments - start and end station!')
        except:
            print('Ensure there are 2 arguments - start and end station!')
    except:
        print('Ensure that inputs are valid stations!')
