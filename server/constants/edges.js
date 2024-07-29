const travelTime = {
    'NS1,NS2' : 3,
    'NS2,NS3' : 2,
    'NS3,NS4' : 4,
    'NS4,NS5' : 3,
    'NS5,NS7' : 5,
    'NS7,NS8' : 3,
    'NS8,NS9' : 2,
    'NS9,NS10' : 3,
    'NS10,NS11' : 3,
    'NS11,NS12' : 3,
    'NS12,NS13' : 3,
    'NS13,NS14' : 2,
    'NS14,NS15' : 6,
    'NS15,NS16' : 2,
    'NS16,NS17' : 4,
    'NS17,NS18' : 2,
    'NS18,NS19' : 2,
    'NS19,NS20' : 3,
    'NS20,NS21' : 2,
    'NS21,NS22' : 3,
    'NS22,NS23' : 2,
    'NS23,NS24' : 2,
    'NS24,NS25' : 3,
    'NS25,NS26' : 2,
    'NS26,NS27' : 2,
    'NS27,NS28' : 3,
    'EW1,EW2' : 3,
    'EW2,EW3' : 3,
    'EW3,EW4' : 3,
    'EW4,EW5' : 3,
    'EW5,EW6' : 3,
    'EW6,EW7' : 3,
    'EW7,EW8' : 2,
    'EW8,EW9' : 2,
    'EW9,EW10' : 3,
    'EW10,EW11' : 2,
    'EW11,EW12' : 3,
    'EW12,EW13' : 2,
    'EW13,EW14' : 2,
    'EW14,EW15' : 3,
    'EW15,EW16' : 2,
    'EW16,EW17' : 3,
    'EW17,EW18' : 2,
    'EW18,EW19' : 3,
    'EW19,EW20' : 2,
    'EW20,EW21' : 2,
    'EW21,EW22' : 3,
    'EW22,EW23' : 3,
    'EW23,EW24' : 4,
    'EW24,EW25' : 2,
    'EW25,EW26' : 3,
    'EW26,EW27' : 3,
    'EW27,EW28' : 2,
    'EW28,EW29' : 3,
    'EW29,EW30' : 3,
    'EW30,EW31' : 3,
    'EW31,EW32' : 2,
    'EW32,EW33' : 2,
    'CG1,CG2' : 4,
    'NE1,NE3' : 4,
    'NE3,NE4' : 1,
    'NE4,NE5' : 2,
    'NE5,NE6' : 3,
    'NE6,NE7' : 2,
    'NE7,NE8' : 2,
    'NE8,NE9' : 2,
    'NE9,NE10' : 3,
    'NE10,NE11' : 1,
    'NE11,NE12' : 2,
    'NE12,NE13' : 3,
    'NE13,NE14' : 2,
    'NE14,NE15' : 2,
    'NE15,NE16' : 2,
    'NE16,NE17' : 3,
    'CC1,CC2' : 2,
    'CC2,CC3' : 2,
    'CC3,CC4' : 2,
    'CC4,CC5' : 2,
    'CC5,CC6' : 2,
    'CC6,CC7' : 2,
    'CC7,CC8' : 2,
    'CC8,CC9' : 3,
    'CC9,CC10' : 2,
    'CC10,CC11' : 2,
    'CC11,CC12' : 2,
    'CC12,CC13' : 3,
    'CC13,CC14' : 2,
    'CC14,CC15' : 3,
    'CC15,CC16' : 3,
    'CC16,CC17' : 2,
    'CC17,CC19' : 5,
    'CC19,CC20' : 2,
    'CC20,CC21' : 3,
    'CC21,CC22' : 2,
    'CC22,CC23' : 2,
    'CC23,CC24' : 2,
    'CC24,CC25' : 2,
    'CC25,CC26' : 3,
    'CC26,CC27' : 2,
    'CC27,CC28' : 2,
    'CC28,CC29' : 3,
    'CE1,CE2' : 2,
    'DT1,DT2' : 2,
    'DT2,DT3' : 2,
    'DT3,DT5' : 4,
    'DT5,DT6' : 2,
    'DT6,DT7' : 3,
    'DT7,DT8' : 2,
    'DT8,DT9' : 2,
    'DT9,DT10' : 2,
    'DT10,DT11' : 3,
    'DT11,DT12' : 3,
    'DT12,DT13' : 1,
    'DT13,DT14' : 2,
    'DT14,DT15' : 3,
    'DT15,DT16' : 2,
    'DT16,DT17' : 2,
    'DT17,DT18' : 2,
    'DT18,DT19' : 2,
    'DT19,DT20' : 2,
    'DT20,DT21' : 2,
    'DT21,DT22' : 2,
    'DT22,DT23' : 2,
    'DT23,DT24' : 2,
    'DT24,DT25' : 3,
    'DT25,DT26' : 2,
    'DT26,DT27' : 2,
    'DT27,DT28' : 2,
    'DT28,DT29' : 2,
    'DT29,DT30' : 2,
    'DT30,DT31' : 3,
    'DT31,DT32' : 2,
    'DT32,DT33' : 2,
    'DT33,DT34' : 3,
    'DT34,DT35' : 2,
    'BP7,BP8' : 2,
    'BP8,BP9' : 1,
    'BP9,BP10' : 2,
    'BP10,BP11' : 1,
    'BP11,BP12' : 2,
    'BP12,BP13' : 1,
    'SE1,SE2' : 1,
    'SE2,SE3' : 1,
    'SE3,SE4' : 1,
    'SE4,SE5' : 2,
    'SW1,SW2' : 1,
    'SW2,SW3' : 1,
    'SW3,SW4' : 1,
    'SW4,SW5' : 1,
    'SW5,SW6' : 1,
    'SW6,SW7' : 1,
    'SW7,SW8' : 1,
    'PE1,PE2' : 1,
    'PE2,PE3' : 1,
    'PE3,PE4' : 1,
    'PE4,PE5' : 1,
    'PE5,PE6' : 1,
    'PE6,PE7' : 1,
    'PW1,PW3' : 2,
    'PW3,PW4' : 1,
    'PW4,PW5' : 1,
    'PW5,PW6' : 1,
    'PW6,PW7' : 1,
    'TE1,TE2' : 3,
    'TE2,TE3' : 3,
    'TE3,TE4' : 4,
    'TE4,TE5' : 4,
    'TE5,TE6' : 2,
    'TE6,TE7' : 2,
    'TE7,TE8' : 3,
    'TE8,TE9' : 3,
    'TE9,TE11' : 5,
    'TE11,TE12' : 2,
    'TE12,TE13' : 2,
    'TE13,TE14' : 2,
    'TE14,TE15' : 2,
    'TE15,TE16' : 2,
    'TE16,TE17' : 2,
    'TE17,TE18' : 2,
    'TE18,TE19' : 2,
    'TE19,TE20' : 1,
    'TE20,TE22' : 4,
    'TE22,TE23' : 4,
    'TE23,TE24' : 2,
    'TE24,TE25' : 2,
    'TE25,TE26' : 2,
    'TE26,TE27' : 2,
    'TE27,TE28' : 2,
    'TE28,TE29' : 2,
    'NS1,EW24' : 5,
    'NS9,TE2' : 5,
    'NS17,CC15' : 5,
    'NS21,DT11' : 5,
    'NS22,TE14' : 5,
    'NS24,NE6' : 5,
    'NS24,CC1' : 5,
    'NE6,CC1' : 5,
    'NS25,EW13' : 5,
    'NS26,EW14' : 5,
    'NS27,CE2' : 5,
    'NS27,TE20' : 5,
    'CE2,TE20' : 5,
    'EW2,DT32' : 5,
    'EW4,CG' : 5,
    'EW8,CC9' : 5,
    'EW12,DT14' : 5,
    'EW16,NE3' : 5,
    'EW16,TE17' : 5,
    'NE3,TE17' : 5,
    'EW21,CC22' : 5,
    'CG1,DT35' : 5,
    'NE1,CC29' : 5,
    'NE4,DT19' : 5,
    'NE7,DT12' : 5,
    'NE12,CC13' : 5,
    'CC4,CE' : 5,
    'CC4,DT15' : 5,
    'CE,DT15' : 5,
    'CC10,DT26' : 5,
    'CC17,TE9' : 5,
    'CC19,DT9' : 5,
    'CE1,DT16' : 5,
    'DT10,TE11' : 5,
    'CG,CG1' : 3,
    'CE,CE1' : 2,
    'NE16,STC_A' : 5,
    'NE16,STC_B' : 5,
    'NE16,STC_C' : 5,
    'NE16,STC_D' : 5,
    'STC_A,STC_B' : 5,
    'STC_A,STC_C' : 5,
    'STC_A,STC_D' : 5,
    'STC_B,STC_C' : 5,
    'STC_B,STC_D' : 5,
    'STC_C,STC_D' : 5,
    'NE17,PTC_A' : 5,
    'NE17,PTC_B' : 5,
    'NE17,PTC_C' : 5,
    'NE17,PTC_D' : 5,
    'PTC_A,PTC_B' : 5,
    'PTC_A,PTC_C' : 5,
    'PTC_A,PTC_D' : 5,
    'PTC_B,PTC_C' : 5,
    'PTC_B,PTC_D' : 5,
    'PTC_C,PTC_D' : 5,
    'STC_B,SW1' : 2,
    'STC_A,SW8' : 3,
    'STC_C,SE1' : 2,
    'STC_D,SE5' : 3,
    'PTC_B,PW1' : 2,
    'PTC_A,PW7' : 3,
    'PTC_D,PE1' : 3,
    'PTC_C,PE7' : 2,
    'NS4,BP1_a' : 5,
    'NS4,BP1_b' : 5,
    'BP1_a,BP1_b' : 5,
    'DT1,BP6_a' : 5,
    'DT1,BP6_b' : 5,
    'BP6_a,BP6_b' : 5,
    'BP1_a,BP2_a' : 2,
    'BP2_a,BP3_a' : 2,
    'BP3_a,BP4_a' : 1,
    'BP4_a,BP5_a' : 1,
    'BP5_a,BP6_a' : 2,
    'BP1_b,BP2_b' : 2,
    'BP2_b,BP3_b' : 2,
    'BP3_b,BP4_b' : 1,
    'BP4_b,BP5_b' : 1,
    'BP5_b,BP6_b' : 2,
    'BP2_a,BP2_b' : 5,
    'BP3_a,BP3_b' : 5,
    'BP4_a,BP4_b' : 5,
    'BP5_a,BP5_b' : 5,
    'BP6_b,BP7' : 1,
    'BP6_a,BP13' : 1,
}

const walkingTime = {
    'Bras Basah,Bencoolen' : ['3 minutes walk | Bras Basah Exit B/C <-> Bencoolen Exit C for underpass through SMU. Walking on street level is fine as well.', 3],
    'Raffles Place,Downtown' : ['7 minutes walk | Raffles Place Exit J <-> Downtown Exit B for underpass through Marina Bay Link Mall', 7],
    'Esplanade,City Hall' : ['5 minutes walk | Esplanade Exit G <-> City Hall Exit A for transfer through Raffles City Shopping Mall Basement 2', 5],
}

const specialStations = [['BP6_a', 'BP6_b'], ['STC_A', 'STC_B'], ['STC_C', 'STC_D'], ['PTC_A', 'PTC_B'], ['PTC_C', 'PTC_D']]

const transferTime = 5

module.exports = {
    travelTime,
    walkingTime,
    specialStations,
    transferTime
}