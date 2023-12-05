const SMRT_LINES = ['EW', 'CG', 'NS', 'BP', 'CC', 'CE', 'TE']
const SBS_LINES = ['NE', 'DT', 'SW', 'SE', 'PW', 'PE']

const TRANSFER_TIME = 5

const EW_NS_I = ['City Hall', 'Raffles Place']
const DT_CE_I = ['Promenade', 'Bayfront']

const NO_CODE_I = {'Tanah Merah': ['CG'], 'Promenade': ['CE'], 'Sengkang': ['SW', 'SE'], 'Punggol': ['PW', 'PE']}

const WALKING_TIME = {"['City Hall', 'Esplanade']": 5, "['Bras Basah', 'Bencoolen']": 3, "['Raffles Place', 'Downtown']": 7}

module.exports = {
    SMRT_LINES,
    SBS_LINES,
    TRANSFER_TIME,
    EW_NS_I,
    DT_CE_I,
    NO_CODE_I,
    WALKING_TIME,
}