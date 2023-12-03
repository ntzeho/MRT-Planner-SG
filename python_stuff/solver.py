import csv
from stations import stations_dict, getStationFromCode
from heapQueue import heappop, heappush
from constants import TRANSFER_TIME, EW_NS_I, DT_CE_I
from sys import argv

travelTime = {}
with open("edges_final.csv", mode='r') as f:
    rows = csv.reader(f)
    for row in rows:
        travelTime[(row[0], row[1])] = int(row[2])


def getNeighbours(station):
    return [edge[edge.index(station) - 1] for edge in travelTime if station in edge]

def commonLines(stn1, stn2):
    lines1 = [code[:2] for code in stations_dict[stn1]]
    lines2 = [code[:2] for code in stations_dict[stn2]]
    return [line for line in lines1 if line in lines2]


def checkTransfer(path): #check if transfer exists for latest addition of station
    if len(path) < 3: #if only 1 or 2 stations in path there cannot be any transfer
        return False
    if len(path) == 3:
        lines = [commonLines(path[i], path[i+1]) for i in range(2)]

        if len(lines[0]) == len(lines[1]) and len(lines[0]) == 1:
            return lines[0] != lines[1]
        
        if len(lines[0]) > 1 or len(lines[1]) > 1:
            for i in range(len(lines[0])):
                if lines[0][i] in lines[1]:
                    return False

        return True
    
    last4 = path[-4:]
    if EW_NS_I[0] in last4 and EW_NS_I[1] in last4:
        return len(commonLines(path[-4], path[-1])) == 0
    
    if DT_CE_I[0] in last4 and DT_CE_I[1] in last4:
        return len(commonLines(path[-4], path[-1])) == 0

    return checkTransfer(path[-3:])

def checkDirect(path):
    for i in range(len(path)-2):
        if checkTransfer(path[i:i+3]):
            return False
    return True

def transferStation(path):
    if len(path) < 3:
        return []
    if len(path) == 3:
        return [path[1]] if checkTransfer(path) else []
    
    extraCheck = False
    transfers = []
    for i in range(len(path)-2):
        if extraCheck:
            checkPath = path[i-1:i+3]
        else:
            checkPath = path[i:i+3]

        if checkTransfer(checkPath):
            transfers.append(path[i+1])
        elif EW_NS_I[0] in checkPath and EW_NS_I[1] in checkPath:
            extraCheck = True
        elif DT_CE_I[0] in checkPath and DT_CE_I[1] in checkPath:
            extraCheck = True
        else:
            extraCheck = False

    if EW_NS_I[0] in transfers and EW_NS_I[1] in path:
        transfers[transfers.index(EW_NS_I[0])] = EW_NS_I

    elif EW_NS_I[1] in transfers and EW_NS_I[0] in path:
        transfers[transfers.index(EW_NS_I[1])] = EW_NS_I

    elif DT_CE_I[0] in transfers and DT_CE_I[1] in path:
        transfers[transfers.index(DT_CE_I[0])] = DT_CE_I

    elif DT_CE_I[1] in transfers and DT_CE_I[0] in path:
        transfers[transfers.index(DT_CE_I[1])] = DT_CE_I

    return transfers

def reconstruct_path(came_from, current):
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    return path[::-1]

def totalTime(path):
    time = 0
    for i in range(len(path)-1):
        try:
            time += travelTime[(path[i],path[i+1])]
        except:
            time += travelTime[(path[i+1],path[i])]
    return time + TRANSFER_TIME*len(transferStation(path))

def astar(start, end, weighted = True):
    open_list = []
    closed_set = set()
    came_from = {}
    g_score = {station: float('inf') for station in stations_dict}
    g_score[start] = 0
    f_score = {station: float('inf') for station in stations_dict}
    f_score[start] = 0

    heappush(open_list, (f_score[start], start))

    while open_list:
        current_f, current = heappop(open_list)

        if current == end:
            return reconstruct_path(came_from, current)

        closed_set.add(current)

        for neighbor in getNeighbours(current):
            if not weighted:
                tentative_g_score = g_score[current] + 1

                if tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score

                    f_score[neighbor] = g_score[neighbor]
                    
                    if neighbor not in closed_set:
                        heappush(open_list, (f_score[neighbor], neighbor))

            else:
                if (current, neighbor) in travelTime:
                    tentative_g_score = g_score[current] + travelTime.get((current, neighbor), float('inf'))
                else:
                    tentative_g_score = g_score[current] + travelTime.get((neighbor, current), float('inf'))

                if checkTransfer(reconstruct_path(came_from, current)):
                    tentative_g_score += TRANSFER_TIME


                if tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score

                    f_score[neighbor] = g_score[neighbor]
                    
                    if neighbor not in closed_set:
                        heappush(open_list, (f_score[neighbor], neighbor))

    return None


def outputJourney(start, end):
    shortest_path = astar(start, end)
    shortest_unweighted = astar(start, end, False)

    allPaths = [(shortest_path, totalTime(shortest_path), transferStation(shortest_path))]
    if totalTime(shortest_path) == totalTime(shortest_unweighted) and shortest_unweighted != shortest_path:
        allPaths.append((shortest_unweighted, allPaths[0][1], transferStation(shortest_unweighted)))

    directLines = commonLines(start, end)

    if directLines != [] and len(shortest_path) > 3 and not checkDirect(shortest_path):
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

            directPath = []

            for i in range(startNo, endNo + order, order):
                if getStationFromCode(line + str(i)) is not None:
                    directPath.append(getStationFromCode(line + str(i)))

            allPaths.append((directPath, totalTime(directPath), []))

    return allPaths

if __name__ == '__main__':
    try:
        print(outputJourney(argv[1], argv[2]))
    except IndexError:
        print('Ensure there are 2 arguments - start and end station!')
    except TypeError:
        print('Ensure that inputs are valid stations!')
