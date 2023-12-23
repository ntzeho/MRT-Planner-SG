from stations import stations_dict, stationType
from bs4 import BeautifulSoup
import requests

SMRT_DEFAULT_URL = 'http://connect-cdn.smrt.wwprojects.com/autoupdate/mrt-timing/<>.html'
SBS_URL = 'https://www.sbstransit.com.sg/first-train-last-train'

SBS_TAGS = ['<font color="#000000">', '<font size="3">', '<br/>', '<font>', '</font>', '<span style="line-height: normal"><span style="font-size: 10pt"><span style="color: rgb(118, 113, 113)">m</span></span></span>', '\xa0', '\n', '\t']
SMRT_HEADER_TAGS = ['<div id="divTimeHeader">', '</div>', '\xa0', '\r', '\n', '                   ']
SMRT_TAGS = ['<td>', '</td>', '<td class="center">', '<td class="pad-left">']

timings = {station: {'codes': stations_dict[station], 'sbs_times': {}, 'smrt_times': {}} for station in stations_dict}

def SMRT_URL(station):
    return SMRT_DEFAULT_URL.replace('<>', station.lower().replace(' ','%20'))

def cleanText(type, result):
    x = str(result)
    if type == 'sbs':
        for tag in SBS_TAGS:
            x = x.replace(tag, '')
    
    elif type == 'smrt_header':
        for tag in SMRT_HEADER_TAGS:
            if tag == '\xa0':
                x = x.replace(tag, ' ')
            else:
                x = x.replace(tag, '')
    
    elif type == 'smrt':
        for tag in SMRT_TAGS:
            x = x.replace(tag, '')

    return x.rstrip()

def cleanStation(station):
    return station.split(' ')[:2]

def scrapeSMRT():
    for station in stations_dict:
        if stationType(station)['SMRT'] == 1:
            page = requests.get(SMRT_URL(station))
            soup = BeautifulSoup(page.content, "html.parser")

            headers = soup.find_all('div', id='divTimeHeader')
            cleanHeaders = [cleanText('smrt_header', header) for header in headers]

            results = soup.find_all('td')
            cleanResults = [cleanText('smrt', result) for result in results]

            smrt_timings = []
            indexes = [i for i in range(len(cleanResults)) if cleanResults[i] == 'First Train']
            for i in range(len(indexes)):
                try:
                    smrt_timings.append(cleanResults[indexes[i]:indexes[i+1]])
                except:
                    smrt_timings.append(cleanResults[indexes[i]:])

            for lst in smrt_timings:
                newlst = [cleanHeaders[smrt_timings.index(lst)]] + lst
                smrt_timings[smrt_timings.index(lst)] = newlst

            for timing in smrt_timings:
                timings[station]['smrt_times'][timing[0]] = {timing[order] + ' | ' + timing[day]: timing[day+order] for order in range(1,3) for day in range(3,len(timing)-3,3)}
            

def scrapeSBS():
    page = requests.get(SBS_URL)
    soup = BeautifulSoup(page.content, "html.parser")
    results = soup.find_all('font')
    cleanResults = [cleanText('sbs', result) for result in results]

    for i in range(len(cleanResults)):
        if 'from' in cleanResults[i].lower() and 'from ' not in cleanResults[i].lower():
            cleanResults[i] = cleanResults[i].replace('from', 'from ')

        if cleanResults[i] =='m' and cleanResults[i-1][-1] == 'a':
            cleanResults[i-1] = cleanResults[i-1] + 'm'
            cleanResults.pop(i)

        if cleanResults[i][-4:] == 'from':
            cleanResults[i] = cleanResults[i] + ' '+ cleanResults[i+1]
            cleanResults.pop(i+1)
            break

    SBStimings = []
    indexes = [i for i in range(len(cleanResults)) if 'Towards' in cleanResults[i] or 'Departing' in cleanResults[i]]
    for i in range(len(indexes)):
        try:
            SBStimings.append(cleanResults[indexes[i]:indexes[i+1]])
        except:
            SBStimings.append(cleanResults[indexes[i]:])
    
    sbs_master = {'timing_dict_' + str(i): {} for i in range(len(SBStimings))}
    count = 0
    for key in sbs_master:
        if count < 2: #downtown line #[timings[count][i][4:]]
            for i in range(len(SBStimings[count])):
                if 'DT' in SBStimings[count][i]:
                    sbs_master[key][SBStimings[count][i][4:].lstrip()] = {SBStimings[count][0]: {SBStimings[count][1] + ' | ' + SBStimings[count][3]: SBStimings[count][i+1] , SBStimings[count][1] + ' | ' + SBStimings[count][4]: SBStimings[count][i+2], SBStimings[count][2]: SBStimings[count][i+3]}}

        elif count < 4: #northeast line
            for i in range(len(SBStimings[count])):
                if 'NE' in SBStimings[count][i]:
                    sbs_master[key][SBStimings[count][i][4:].lstrip()] = {SBStimings[count][0]: {SBStimings[count][1] + ' | ' + SBStimings[count][3]: SBStimings[count][i+1] , SBStimings[count][1] + ' | ' + SBStimings[count][4]: SBStimings[count][i+2], SBStimings[count][1] + ' | ' + SBStimings[count][5]: SBStimings[count][i+3], SBStimings[count][2] + ' | ' + SBStimings[count][6]: SBStimings[count][i+4], SBStimings[count][2] + ' | ' + SBStimings[count][7]: SBStimings[count][i+5]}}

        else: #sengkang and punggol lrt
            for i in range(len(SBStimings[count])):
                if 'Loop' in SBStimings[count][i]:
                    sbs_master[key][SBStimings[count][i]] = {SBStimings[count][1] + ' | ' + SBStimings[count][3]: SBStimings[count][i+1] , SBStimings[count][1] + ' | ' + SBStimings[count][4]: SBStimings[count][i+2], SBStimings[count][2]: SBStimings[count][i+3]}

        count += 1

    for i in range(len(SBStimings)):
        if i < 4:
            for station in sbs_master['timing_dict_'+str(i)]:
                timings[station]['sbs_times'][SBStimings[i][0]] = sbs_master['timing_dict_'+str(i)][station][SBStimings[i][0]]

        elif i == 4:
            for loop in sbs_master['timing_dict_'+str(i)]:
                timings['Sengkang']['sbs_times'][loop] = sbs_master['timing_dict_'+str(i)][loop]

        else:
            for loop in sbs_master['timing_dict_'+str(i)]:
                timings['Punggol']['sbs_times'][loop] = sbs_master['timing_dict_'+str(i)][loop]


def main():
    scrapeSBS()
    scrapeSMRT()

    with open('./constants/timings.js', mode='w', newline='') as f:
        f.write('const timings = {\n')
        for station in timings:
            f.write("    '"+station+"' : ")
            f.write(str(timings[station]) + ',\n')
        f.write('}\n')
        f.write('module.exports = {\n')
        f.write('    timings\n')
        f.write('}')

if __name__ == '__main__':
    main()
    