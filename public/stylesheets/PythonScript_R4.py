'''
DOCUMATENTION

# landsat image: LM4 : this is the landsat sateleite # and TM bands 
landsat images should jsjsls
YOUR fodler needs to be in this format LM40300291990241AAA07

documen unzip the image .tar .tar folder
path 030 
row 029
day # 199

Time 2: 41 AAA 
Year: 07

Edited by Author: UZAYR
Date : MARCH 5TH, 2015



#I am scrpting this in  ARCPY - ITS AN ArcGIS software however its pure python. Now in arcpy 
#the character file limitation is only subjected to 13 characters and the files name "landsat files" which I
# I am going to use for all the formulas below with IF STATEMETNS has 18 character IN THEM - for example LC08232423423894LN93 <--- I am trying to shorten
# that name to lets say output as #NDVIimage

#below you will see diferent formulas that will be applied but I am trying to fix is the file output,
#I know we used split function but if you have ideas and can show much shoter way that would be great!

'''

import arcpy 
import sys




landsat = sys.argv[0] #3 folder LLC80180222013244LGN00
NDVI = sys.argv[1]   # True or false
#outputname = LM403    # file name
location = sys.argv[2]   # path

landsat = "D:/GEOM4009/Individual project/TEST_TWO"

landsat2= landsat.split("/")
landsatname = landsat[3]

# ARCMAP FUNCTIOn check.Saptatial.analysis
#SET UP VARIABLES
	#band1 = landsat + "_B1.TIF"
	#band2 = landsat + "_B2.TIF"
	#band3 = landsat + "_B3.TIF"
	#band4 = landsat + "_B4.TIF"

	# NDVIname = landsat[1:6]   --->  LM40300 + "NDVI"
		# LM40300NDVI
	# path = location + NDVIname # to find out how to get it
		#NDVIfile = landsatpathNDVI




landsat = "C:/FOLDER/GEMO4009/Carleton/UNiversity/3893/342//dfg/df/df/d/df/LC08232423423894"

landsat2 = landsat.split("/")

landsatname = landsat[9]     #### FUNCTION THAT TAKES THE LAST NUMBER min max last end 

landsatname = "LC08232423423894LN93"

landsatshort = landsatname.split or parse  (1:5)

##NDVI = NDVI _---- > FODLER


band1 = landsatname + "_1.TIF"

#band1 = "LC08232423423894_B1.TIF"   # used in the raster calculator


		"D:\GEOM4009\Individual project\Data\LC80180222013244LGN00")


LC80180222013244LGN00 + "_B1.TIF" =  "LC80180222013244LGN00_B1.TIF"


# set up NDVI this is the formula NDVI = ( IR - R ) / ( IR + R ) (REFERENCE A)

#LC80180222013244LGN00_B3

#LC80180222013244LGN00_B4

if NDVI:
	arcpy.gp.RasterCalculator_sa("""Float(band4 - band3) / Float(band4 + band3)""", path = "D:/GEOM4009/Individual project/TEST_TWO") 

 

'''

if NDWI:
	arcpy.gp.RasterCalculator_sa("""Float(G-NIR)/Float ( G + NIR)""", path)
	band3 #= landsat8 + "_B3.TIF"
	band6 = "LM40300291990241AAA07_B6.TIFF"

path= "C:/test/1......"

if NDSI:


NDSI= arcpy.gp.RasterCalculator_sa("""Float(band 4 – band 6)/Float( band 4 + band 6)"""",path)


path= "C:/test/1......"

if SAVI:


SAVI = arcpy.gp.RasterCalculator_sa("""Float( IR - R ) / Float ( IR + R + L ) * ( 1 + L )"""", path)

path= "C:/test/1......"


if PANSHARPEN:

arcpy.CreatePansharpenedRasterDataset_management("rgb.img","3","2","1","1", "output\\rgb_pan.img","pan.img","Brovey")


path= "C:/test/1......"


if ORTHORECTIFICATION: 

	arcpy.CreateOrthoCorrectedRasterDataset_management("c:/data/RPCdata.tif","c:/data/orthoready.tif","DEM", "#", "c:/data/DEM.img", "#", "10", "GEOID")


path= "C:/test/1......"

'''