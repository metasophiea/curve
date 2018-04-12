import sys, os, re

if len(sys.argv) < 3:
    print('input or output file missing')
    exit()



def includer(location, parentFile, inputfileName, outputObject, spacer=''):
    if(inputfileName == '*'):
        for item in os.listdir(location):
            if parentFile != item:
                includer(location, parentFile, item, outputObject, spacer)
    else:
        inputFile = open(location+'/'+inputfileName)
        for line in inputFile:
            start = line.find('{{')
            end = line.find('}}')
            if( start != -1 and end != -1 ):

                line = line.strip()
                if line[:2] == '//': continue
                line = line.split('{{')[1].split('}}')[0].split(':')

                if 'include' in line[0]:
                    newSpacer = line[0].replace('include','')
                    newLocation = '/'.join((location+'/'+line[1]).split('/')[:-1])
                    newFile = line[1].split('/')[-1]
                    includer( newLocation, inputfileName, newFile, outputObject, spacer+newSpacer)

            else:
                outputObject.write(spacer+line)

        outputObject.write('\n')
        inputFile.close()



inputfileName = sys.argv[1]
outputfileName = sys.argv[2]
outputFile = open(outputfileName,"w")

includer( os.getcwd(), None, inputfileName, outputFile )

outputFile.close()