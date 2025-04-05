var target = ee.Image("users/zhaoyanbo0712/China/target_area_CHN")
var desert_freq = ee.Image("users/zhaoyanbo0712/China/desert_freq_CHN")
var PGZ = desert_freq.updateMask(target).lte(1)
var PDZ = desert_freq.updateMask(target).gte(20)
var TZ = desert_freq.updateMask(target).where(desert_freq.gte(20),1).gt(1)
var all = target

/*
Function:
(1)delta:to calculate the Δ of EVITGS caused by every impact foctors
(2)gpprel:to calculate the gpprel(coefficience) during the study period
(3)eviadj:to calculate the evitge without the effect of CO2
*/

{
    //////==================(1) study area===========
    var region = ee.FeatureCollection("users/zhaoyanbo0712/eastAsia/china")
    var yearNum = 21
    /////////data process
    //////evitgs

    var evitgs00 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2000")
    var evitgs01 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2001")
    var evitgs02 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2002")
    var evitgs03 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2003")
    var evitgs04 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2004")
    var evitgs05 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2005")
    var evitgs06 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2006")
    var evitgs07 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2007")
    var evitgs08 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2008")
    var evitgs09 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2009")
    var evitgs10 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2010")
    var evitgs11 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2011")
    var evitgs12 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2012")
    var evitgs13 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2013")
    var evitgs14 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2014")
    var evitgs15 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2015")
    var evitgs16 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2016")
    var evitgs17 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2017")
    var evitgs18 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2018")
    var evitgs19 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2019")
    var evitgs20 = ee.Image("users/zhaoyanbo0712/China/evitgs_china_2020")

    var EVI_IC = ee.ImageCollection.fromImages([evitgs00,evitgs01,evitgs02,evitgs03,evitgs04,
        evitgs05,evitgs06,evitgs07,evitgs08,evitgs09,evitgs10,
        evitgs11,evitgs12,evitgs13,evitgs14,evitgs15,evitgs16,
        evitgs17,evitgs18,evitgs19,evitgs20])
        .map(function(image){
            return image.rename("evitgs")
        })
    EVI_IC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(EVI_IC)).get("ic"))).map(addyear)
    /////////CO2
    // var CO2_IC = ee.ImageCollection("users/zhaoyanbo0712/CO2_0020_CA").map(function(img){
    //                 img = img.rename("co2")
    //                 return img.reproject({crs:"EPSG:4326",scale:500})
    // })
    // CO2_IC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(CO2_IC)).get("ic"))).map(addyear)

    var co2_base = EVI_IC.select("evitgs").first().multiply(0.0)
    var CO2con = ee.ImageCollection.fromImages([ee.Image(368.865),ee.Image(370.467),ee.Image(372.522),ee.Image(374.76),ee.Image(376.812),ee.Image(378.812),ee.Image(380.827),
        ee.Image(382.777),ee.Image(384.8),ee.Image(387.012),ee.Image(389.324),ee.Image(391.638),ee.Image(394.009),ee.Image(396.464),ee.Image(399.004),
        ee.Image(401.628),ee.Image(404.328),ee.Image(407.096),ee.Image(409.927),ee.Image(412.822),ee.Image(415.78)])
        .map(function(num){
            var co2_current = ee.Image(co2_base).add(ee.Image(num))
            return co2_current.rename("co2")
        })
    var CO2_IC = ee.ImageCollection(CO2con)
    CO2_IC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(CO2_IC)).get("ic"))).map(addyear)



    /////////results
    /////1.
    var evi_general_Sen = EVI_IC.select(["year","evitgs"]).reduce(ee.Reducer.sensSlope())
    var evi_general_slope = evi_general_Sen.select("slope")
    var evi_general_offset = evi_general_Sen.select("offset")
    var delta_evi_general = delta(evi_general_slope,yearNum)
    Map.addLayer(delta_evi_general.updateMask(target),{},"overall")
    /////2.
    var co2_start = ee.Image(CO2_IC.select("co2").first())
    var gpp_cof_IC = CO2_IC.map(function(img){
        var co2_current = ee.Image(img.select("co2"))
        var gpp_cof_current = gpprel(co2_current,co2_start)
        return gpp_cof_current.rename("gpprel")
    })
    gpp_cof_IC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(gpp_cof_IC)).get("ic"))).map(addyear)
    //eviadj
    var evi_co2adj_IC = EVI_IC.map(function(img){
        var evi_current = ee.Image(img.select("evitgs"))
        var evi_adj = eviadj(evi_current,gpp_cof_IC.select("gpprel"))
        return evi_adj.rename("evitgs_adj")
    })
    evi_co2adj_IC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(evi_co2adj_IC)).get("ic"))).map(addyear)
    //evi - eviadj
    var evi_co2_IC = EVI_IC.select("evitgs").map(function(img){
        var evi_current = ee.Image(img)
        var evi_co2 = ICsubtractICbyImages(evi_current,evi_co2adj_IC.select("evitgs_adj"))
        return evi_co2.rename("evi_co2")
    })
    evi_co2_IC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(evi_co2_IC)).get("ic"))).map(addyear)

    var evi_co2_Sen = evi_co2_IC.select(["year","evi_co2"]).reduce(ee.Reducer.sensSlope())
    var evi_co2_slope = evi_co2_Sen.select("slope")
    var evi_co2_offset = evi_co2_Sen.select("offset")
    var delta_evi_co2 = delta(evi_co2_slope,yearNum)
    Map.addLayer(delta_evi_co2,{},"co2_caused")



    /////3.export evi/pre/tmp used for TSSRESTREND
    // var randomPoints = ee.FeatureCollection.randomPoints(region,500,10)
    // Map.addLayer(randomPoints)
    ///2000-2020EVI
    var EVI_IC_toimg = EVI_IC.select("evitgs").toBands()
        .rename(["evitgs_2000","evitgs_2001","evitgs_2002","evitgs_2003","evitgs_2004",
            "evitgs_2005","evitgs_2006","evitgs_2007","evitgs_2008","evitgs_2009","evitgs_2010",
            "evitgs_2011","evitgs_2012","evitgs_2013","evitgs_2014","evitgs_2015","evitgs_2016",
            "evitgs_2017","evitgs_2018","evitgs_2019","evitgs_2020"])
    ///2000-2020EVI_adj
    var EVI_adj_IC_toimg = evi_co2adj_IC.select("evitgs_adj").toBands()
        .rename(["evitgs_adj_2000","evitgs_adj_2001","evitgs_adj_2002","evitgs_adj_2003","evitgs_adj_2004",
            "evitgs_adj_2005","evitgs_adj_2006","evitgs_adj_2007","evitgs_adj_2008","evitgs_adj_2009","evitgs_adj_2010",
            "evitgs_adj_2011","evitgs_adj_2012","evitgs_adj_2013","evitgs_adj_2014","evitgs_adj_2015","evitgs_adj_2016",
            "evitgs_adj_2017","evitgs_adj_2018","evitgs_adj_2019","evitgs_adj_2020"])
    ///2000-2020pre
    var PRE_img = ee.Image("users/zhaoyanbo0712/eastAsia/pre_CHN_2000_2021").reproject({crs:"EPSG:4326",scale:500})
    ///2000-2020tmp
    var TMP_img = ee.Image("users/zhaoyanbo0712/eastAsia/tmp_CHN_2000_2021").reproject({crs:"EPSG:4326",scale:500})

    // var result = ee.ImageCollection.fromImages([EVI_IC_toimg,EVI_adj_IC_toimg,PRE_img,TMP_img]).toBands()

    // var fc1 = randomPoints.map(function(ft){
    //     var pid = ee.String(ft.id())
    //     ft = ft.set("name",ee.String("p").cat(pid))
    //     return ft
    // })

    // var fc2 = result.sampleRegions({
    //   collection:fc1,
    //   properties:ee.List(['name']),
    //   scale:10
    // })

    // Export.table.toDrive({
    //   collection:fc2,
    //   description:"VCR_TSSRESTREND_CA_0020",
    //   folder:"result",
    //   fileFormat:"CSV"
    // })
    ///RESTREND
    //1.regression(PRE\TMP) 2.difference 3.regression(residual)
    var PRE_IC = ee.ImageCollection.fromImages([PRE_img.select("pre_2000"),PRE_img.select("pre_2001"),PRE_img.select("pre_2002"),
        PRE_img.select("pre_2003"),PRE_img.select("pre_2004"),PRE_img.select("pre_2005"),
        PRE_img.select("pre_2006"),PRE_img.select("pre_2007"),PRE_img.select("pre_2008"),
        PRE_img.select("pre_2009"),PRE_img.select("pre_2010"),PRE_img.select("pre_2011"),
        PRE_img.select("pre_2012"),PRE_img.select("pre_2013"),PRE_img.select("pre_2014"),
        PRE_img.select("pre_2015"),PRE_img.select("pre_2016"),PRE_img.select("pre_2017"),
        PRE_img.select("pre_2018"),PRE_img.select("pre_2019"),PRE_img.select("pre_2020")])
        .map(function(img){
            return img.rename("pre")
        })
    PRE_IC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(PRE_IC)).get("ic"))).map(addyear)
    var TMP_IC = ee.ImageCollection.fromImages([TMP_img.select("tmp_2000"),TMP_img.select("tmp_2001"),TMP_img.select("tmp_2002"),
        TMP_img.select("tmp_2003"),TMP_img.select("tmp_2004"),TMP_img.select("tmp_2005"),
        TMP_img.select("tmp_2006"),TMP_img.select("tmp_2007"),TMP_img.select("tmp_2008"),
        TMP_img.select("tmp_2009"),TMP_img.select("tmp_2010"),TMP_img.select("tmp_2011"),
        TMP_img.select("tmp_2012"),TMP_img.select("tmp_2013"),TMP_img.select("tmp_2014"),
        TMP_img.select("tmp_2015"),TMP_img.select("tmp_2016"),TMP_img.select("tmp_2017"),
        TMP_img.select("tmp_2018"),TMP_img.select("tmp_2019"),TMP_img.select("tmp_2020")])
        .map(function(img){
            return img.rename("tmp")
        })
    TMP_IC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(TMP_IC)).get("ic"))).map(addyear)
    ///build the VCR
    var regressIC_1 = evi_co2adj_IC.select("evitgs_adj").map(function(evi){
        var yearFilter = ee.Image(evi).date()
        var pre_current = PRE_IC.filterDate(yearFilter).select("pre").toBands().rename("pre")
        var tmp_current = TMP_IC.filterDate(yearFilter).select("tmp").toBands().rename("tmp")
        var constant = ee.Image(evi).multiply(0).add(1).rename("constant")
        return evi.addBands(pre_current).addBands(tmp_current).addBands(constant)
    })
    var VCR = regressIC_1.select(["pre","tmp","constant","evitgs_adj"]).reduce(ee.Reducer(ee.Reducer.linearRegression({numX:3, numY:1})))
    // print(VCR)
    // Map.addLayer(VCR.select("coefficients"))
    var name1='pre'
    var name2='tmp'
    var name3='constant'
    var name4='EVI'
    var bandNames =[ [name1, name2,name3] ,[name4]]// 0-axis variation.
    var coe=VCR.select('coefficients').arrayFlatten(bandNames)

    var coef_pre = coe.select("pre_EVI")
    var coef_tmp = coe.select("tmp_EVI")
    var constant = coe.select("constant_EVI")
    ///build the ideal series
    var ideal_evitgs_adj = PRE_IC.select("pre").map(function(pre){
        var yearFilter = ee.Image(pre).date()
        var tmp = TMP_IC.filterDate(yearFilter).select("tmp").toBands().rename("tmp")
        var ideal = coef_pre.multiply(pre).add(coef_tmp.multiply(tmp)).add(constant)
        return ideal.rename("ideal_evitgs_adj")
    })
    ideal_evitgs_adj = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(ideal_evitgs_adj)).get("ic"))).map(addyear)
    // Map.addLayer(ideal_evitgs_adj.select("ideal_evitgs_adj"))
    // Map.addLayer(evi_co2adj_IC.select("evitgs_adj"))
    ///residual------LU:ideal_evitgs_adj - evitgs_adj
    var residual = ideal_evitgs_adj.select("ideal_evitgs_adj").map(function(img){
        var ideal_evitgs_adj_current = ee.Image(img)
        var yearFilter = ee.Image(ideal_evitgs_adj_current).date()
        var evi_co2adj_current = evi_co2adj_IC.filterDate(yearFilter).select("evitgs_adj").toBands().rename("evitgs_adj")
        var res = evi_co2adj_current.subtract(ideal_evitgs_adj_current)
        return ee.Image(res).rename("evitgs_LU")
    })
    residual = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(residual)).get("ic"))).map(addyear)
    print(residual)
    var evi_LU_Sen = residual.select(["year","evitgs_LU"]).reduce(ee.Reducer.sensSlope())
    var evi_LU_slope = evi_LU_Sen.select("slope")
    var evi_LU_offset = evi_LU_Sen.select("offset")
    var delta_evi_LU = delta(evi_LU_slope,yearNum)
    Map.addLayer(delta_evi_LU.updateMask(target),{},"LU_caused")

    /////4.
    ///sg smooth
    // var smooth_PRE_IC = sgsmooth(PRE_IC.select("pre"), 2, 7, 4)
    // var smooth_TMP_IC = sgsmooth(TMP_IC.select("tmp"), 2, 7, 4)
    var smooth_PRE_IC = PRE_IC.select("pre")
    var smooth_TMP_IC = TMP_IC.select("tmp")
    smooth_PRE_IC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(smooth_PRE_IC)).get("ic"))).map(addyear)
    smooth_TMP_IC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(smooth_TMP_IC)).get("ic"))).map(addyear)
    ///smooth sen slope
    var pre_smooth_Sen = smooth_PRE_IC.select(["year","pre"]).reduce(ee.Reducer.sensSlope())
    var pre_smooth_slope = pre_smooth_Sen.select("slope")
    var pre_smooth_offset = pre_smooth_Sen.select("offset")
    var tmp_smooth_Sen = smooth_TMP_IC.select(["year","tmp"]).reduce(ee.Reducer.sensSlope())
    var tmp_smooth_slope = tmp_smooth_Sen.select("slope")
    var tmp_smooth_offset = tmp_smooth_Sen.select("offset")
    // Map.addLayer(PRE_IC.select("pre"))
    // Map.addLayer(smooth_PRE_IC.select("pre"))
    // Map.addLayer(TMP_IC.select("tmp"))
    // Map.addLayer(smooth_TMP_IC.select("tmp"))


    ///detrend = observation - smooth
    var detrend_PRE_IC = PRE_IC.map(function(img){
        var yr_current = ee.Image(img.select("year"))
        var pre_current = ee.Image(img.select("pre"))
        var res = pre_smooth_slope.multiply(yr_current).add(pre_smooth_offset)
        var detrend = pre_current.subtract(res)
        return detrend.rename("detrend_pre")
    })
    detrend_PRE_IC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(detrend_PRE_IC)).get("ic"))).map(addyear)
    // Map.addLayer(detrend_PRE_IC)
    var detrend_TMP_IC = TMP_IC.map(function(img){
        var yr_current = ee.Image(img.select("year"))
        var tmp_current = ee.Image(img.select("tmp"))
        var res = tmp_smooth_slope.multiply(yr_current).add(tmp_smooth_offset)
        var detrend = tmp_current.subtract(res)
        return detrend.rename("detrend_tmp")
    })
    detrend_TMP_IC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(detrend_TMP_IC)).get("ic"))).map(addyear)
    // Map.addLayer(detrend_TMP_IC)
    ///CV VCR
    var evitgs_cv_IC = detrend_PRE_IC.select("detrend_pre").map(function(pre){
        var yearFilter = ee.Image(pre).date()
        var tmp = detrend_TMP_IC.filterDate(yearFilter).select("detrend_tmp").toBands().rename("detrend_tmp")
        var cv = coef_pre.multiply(pre).add(coef_tmp.multiply(tmp)).add(constant)
        return cv.rename("evitgs_cv").updateMask(target)
    })
    // Map.addLayer(evitgs_cv_IC)
    evitgs_cv_IC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(evitgs_cv_IC)).get("ic"))).map(addyear)
    ///CC = VCR - CV VCR
    var evitgs_cc_IC = ideal_evitgs_adj.select("ideal_evitgs_adj").map(function(img){
        var ideal_evitgs_adj_current = ee.Image(img)
        var yearFilter = ee.Image(ideal_evitgs_adj_current).date()
        var evitgs_cv_current = evitgs_cv_IC.filterDate(yearFilter).select("evitgs_cv").toBands().rename("evitgs_cv")
        var cc = ideal_evitgs_adj_current.subtract(evitgs_cv_current)
        return ee.Image(cc).rename("evitgs_cc")
    })
    evitgs_cc_IC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(evitgs_cc_IC)).get("ic"))).map(addyear)
    ///delta  CC CV
    var evi_cv_Sen = evitgs_cv_IC.select(["year","evitgs_cv"]).reduce(ee.Reducer.sensSlope())
    var evi_cv_slope = evi_cv_Sen.select("slope")
    var evi_cv_offset = evi_cv_Sen.select("offset")
    var delta_evi_cv = delta(evi_cv_slope,yearNum)
    Map.addLayer(delta_evi_cv,{},"cv_caused")


    var evi_cc_Sen = evitgs_cc_IC.select(["year","evitgs_cc"]).reduce(ee.Reducer.sensSlope())
    var evi_cc_slope = evi_cc_Sen.select("slope")
    var evi_cc_offset = evi_cc_Sen.select("offset")
    var delta_evi_cc = delta(evi_cc_slope,yearNum)
    Map.addLayer(delta_evi_cc,{},"cc_caused")

    var delta_evi_of = delta_evi_general.subtract(delta_evi_co2).subtract(delta_evi_LU).subtract(delta_evi_cc).subtract(delta_evi_cv)
    Map.addLayer(delta_evi_of,{},"other_factors_caused")

    var delta_evi_ac = delta_evi_co2.add(delta_evi_cc)

    //absolute value to caculate the magnitude
    var delta_evi_general_abs = delta_evi_general.abs()
    var delta_evi_co2_abs = delta_evi_co2.abs()
    var delta_evi_LU_abs = delta_evi_LU.abs()
    var delta_evi_cc_abs = delta_evi_cc.abs()
    var delta_evi_cv_abs = delta_evi_cv.abs()
    var delta_evi_of_abs = delta_evi_of.abs()






    ////significance
    var general90 = confidence90(EVI_IC,"evitgs",evi_general_slope,evi_general_offset)
    var co290 = confidence90(evi_co2_IC,"evi_co2",evi_co2_slope,evi_co2_offset)
    var LU90 = confidence90(residual,"evitgs_LU",evi_LU_slope,evi_LU_offset)
    var cc90 = confidence90(evitgs_cc_IC,"evitgs_cc",evi_cc_slope,evi_cc_offset)
    var cv90 = confidence90(evitgs_cv_IC,"evitgs_cv",evi_cv_slope,evi_cv_offset)

    // Export.image.toDrive({
    //   image:general90.clip(region).updateMask(target),
    //   description:"CHN_delta_evi_general_p",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })

    // Export.image.toDrive({
    //   image:co290.clip(region).updateMask(target),
    //   description:"CHN_delta_evi_co2_p",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })

    // Export.image.toDrive({
    //   image:LU90.clip(region).updateMask(target),
    //   description:"CHN_delta_evi_lu_p",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })

    // Export.image.toDrive({
    //   image:cc90.clip(region).updateMask(target),
    //   description:"CHN_delta_evi_cc_p",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })

    // Export.image.toDrive({
    //   image:cv90.clip(region).updateMask(target),
    //   description:"CHN_delta_evi_cv_p",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })

    // Map.addLayer(general90.clip(region).updateMask(target),{},"general90")
    // Map.addLayer(co290.clip(region).updateMask(target),{},"co290")
    // Map.addLayer(LU90.clip(region).updateMask(target),{},"LU90")
    // Map.addLayer(cc90.clip(region).updateMask(target),{},"cc90")
    // Map.addLayer(cv90.clip(region).updateMask(target),{},"cv90")

    // Export.image.toAsset({
    //   image:general90.clip(region).updateMask(target),
    //   description:"China/CHN_delta_evi_general_p",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })
    // Export.image.toAsset({
    //   image:co290.clip(region).updateMask(target),
    //   description:"China/CHN_delta_evi_co2_p",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })
    // Export.image.toAsset({
    //   image:LU90.clip(region).updateMask(target),
    //   description:"China/CHN_delta_evi_LU_p",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })
    // Export.image.toAsset({
    //   image:cc90.clip(region).updateMask(target),
    //   description:"China/CHN_delta_evi_cc_p",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })
    // Export.image.toAsset({
    //   image:cv90.clip(region).updateMask(target),
    //   description:"China/CHN_delta_evi_cv_p",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })
    /////5.per pixels max factor
    ///1:co2   2:LU  3.CC  4.CV
    //delta_evi_LU_abs   delta_evi_cc_abs    delta_evi_cv_abs    delta_evi_co2_abs
    var main_factors = ee.Image(1).where(delta_evi_LU_abs.gt(delta_evi_cc_abs).and(delta_evi_LU_abs.gt(delta_evi_cv_abs))
        .and(delta_evi_LU_abs.gt(delta_evi_co2_abs)).and(delta_evi_LU_abs.gt(delta_evi_of_abs)),2)
    main_factors = main_factors.where(delta_evi_cc_abs.gt(delta_evi_LU_abs).and(delta_evi_cc_abs.gt(delta_evi_cv_abs))
        .and(delta_evi_cc_abs.gt(delta_evi_co2_abs)).and(delta_evi_cc_abs.gt(delta_evi_of_abs)),3)
    main_factors = main_factors.where(delta_evi_cv_abs.gt(delta_evi_LU_abs).and(delta_evi_cv_abs.gt(delta_evi_cc_abs))
        .and(delta_evi_cv_abs.gt(delta_evi_co2_abs)).and(delta_evi_cv_abs.gt(delta_evi_of_abs)),4)
    main_factors = main_factors.where(delta_evi_of_abs.gt(delta_evi_LU_abs).and(delta_evi_of_abs.gt(delta_evi_cc_abs))
        .and(delta_evi_of_abs.gt(delta_evi_co2_abs)).and(delta_evi_of_abs.gt(delta_evi_cv_abs)),5)
    Map.addLayer(main_factors.updateMask(target).eq(5))


    var main_factors_sig = main_factors.clip(region).updateMask(target).where(main_factors.eq(1),co290.select("evi_co2"))
        .where(main_factors.eq(2),LU90.select("evitgs_LU"))
        .where(main_factors.eq(3),cc90.select("evitgs_cc"))
        .where(main_factors.eq(4),cv90.select("evitgs_cv"))
        .where(main_factors.eq(5),general90.select("evitgs"))
    Map.addLayer(main_factors_sig.eq(1),{},"main_factors_sig")



    Export.image.toDrive({
        image:main_factors_sig.eq(1).clip(region).updateMask(target),
        description:"CHN_main_factors_sig",
        scale:500,
        crs:"EPSG:4326",
        region:region,
        maxPixels:1e13
    })

    var region = ee.FeatureCollection("users/zhaoyanbo0712/eastAsia/china")
    var delta_evi_general_p = ee.Image("users/zhaoyanbo0712/China/CHN_delta_evi_general_p").select("evitgs")
    var target = ee.Image("users/zhaoyanbo0712/China/target_area_CHN")
    var desert_freq = ee.Image("users/zhaoyanbo0712/China/desert_freq_CHN")
    var PGZ = desert_freq.updateMask(target).lte(1)
    var PDZ = desert_freq.updateMask(target).gte(20)
    var TZ = desert_freq.updateMask(target).where(desert_freq.gte(20),1).gt(1)
    var greening = delta_evi_general.gt(0);
    var browning = delta_evi_general.lt(0);

    main_factors = main_factors.updateMask(main_factors_sig.eq(1))

    var result = ee.Image.pixelArea().addBands(main_factors).reduceRegions({
        collection:region,
        reducer:ee.Reducer.sum().group({
            groupField: 1,
            groupName: "dynamic"
        }),
        scale:500
    })
    print(result,"xj")

    var result = ee.Image.pixelArea().addBands(main_factors.updateMask(TZ)).reduceRegions({
        collection:region,
        reducer:ee.Reducer.sum().group({
            groupField: 1,
            groupName: "dynamic"
        }),
        scale:500
    })
    print(result,"xj")

    //with significance
    // delta_evi_LU_abs = delta_evi_LU_abs.updateMask(LU90)
    // delta_evi_cc_abs = delta_evi_cc_abs.updateMask(cc90)
    // delta_evi_cv_abs = delta_evi_cv_abs.updateMask(cv90)
    // delta_evi_co2_abs = delta_evi_co2_abs.updateMask(co290)

    // var main_factors = ee.Image(1).updateMask(general90).where(delta_evi_LU_abs.gt(delta_evi_cc_abs).and(delta_evi_LU_abs.gt(delta_evi_cv_abs))
    //                                     .and(delta_evi_LU_abs.gt(delta_evi_co2_abs)).and(delta_evi_LU_abs.gt(delta_evi_of_abs)),2)
    // main_factors = main_factors.where(delta_evi_cc_abs.gt(delta_evi_LU_abs).and(delta_evi_cc_abs.gt(delta_evi_cv_abs))
    //                                     .and(delta_evi_cc_abs.gt(delta_evi_co2_abs)).and(delta_evi_cc_abs.gt(delta_evi_of_abs)),3)
    // main_factors = main_factors.where(delta_evi_cv_abs.gt(delta_evi_LU_abs).and(delta_evi_cv_abs.gt(delta_evi_cc_abs))
    //                                     .and(delta_evi_cv_abs.gt(delta_evi_co2_abs)).and(delta_evi_cv_abs.gt(delta_evi_of_abs)),4)
    // main_factors = main_factors.where(delta_evi_of_abs.gt(delta_evi_LU_abs).and(delta_evi_of_abs.gt(delta_evi_cc_abs))
    //                                     .and(delta_evi_of_abs.gt(delta_evi_co2_abs)).and(delta_evi_of_abs.gt(delta_evi_cv_abs)),5)
    // Map.addLayer(main_factors.updateMask(target).eq(5))
    // Export.image.toDrive({
    //   image:main_factors.clip(region).updateMask(target),
    //   description:"main_factors_withSig",
    //   folder:"result3",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })
    // Map.addLayer(delta_evi_of_abs.updateMask(target).lt(0.01))
    // var delta_evi_general_abs = delta_evi_general.abs()
    // var delta_evi_co2_abs = delta_evi_co2.abs()
    // var delta_evi_LU_abs = delta_evi_LU.abs()
    // var delta_evi_cc_abs = delta_evi_cc.abs()
    // var delta_evi_cv_abs = delta_evi_cv.abs()
    // var delta_evi_of_abs = delta_evi_of.abs()

    // Export.image.toDrive({
    //   image:delta_evi_general,
    //   description:"delta_evi_observation",
    //   folder:"result3",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })

    // Export.image.toDrive({
    //   image:delta_evi_co2,
    //   description:"delta_evi_co2",
    //   folder:"result3",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })

    // Export.image.toDrive({
    //   image:delta_evi_LU,
    //   description:"delta_evi_LU",
    //   folder:"result3",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })

    // Export.image.toDrive({
    //   image:delta_evi_cc,
    //   description:"delta_evi_cc",
    //   folder:"result3",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })

    // Export.image.toDrive({
    //   image:delta_evi_cv,
    //   description:"delta_evi_cv",
    //   folder:"result3",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })

    // Export.image.toDrive({
    //   image:delta_evi_of,
    //   description:"delta_evi_of",
    //   folder:"result3",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })

    // Export.image.toDrive({
    //   image:delta_evi_ac,
    //   description:"delta_evi_ac",
    //   folder:"result3",
    //   scale:500,
    //   crs:"EPSG:4326",
    //   region:region,
    //   maxPixels:1e13
    // })




}














//////==================(2) Functions============
////////attribution analyst
function delta(slope,yearNum){
    var del = ee.Image(slope.multiply(yearNum))
    return del
}

function gpprel(CO2_current,CO2_start){
    // gpprel ≈ ((ca - 40)*(ca0 + 2*40))/((ca + 2*40)*(ca0 - 40))
    var rel_numerator = CO2_current.multiply(0.7).subtract(40).multiply(CO2_start.multiply(0.7).add(80))
    var rel_denominator = CO2_start.multiply(0.7).subtract(40).multiply(CO2_current.multiply(0.7).add(80))
    var rel = ee.Image(rel_numerator.divide(rel_denominator))
    return rel
}

function eviadj(EVITGS_current,gpprelIC){
    // gpprel ≈ NPPobs/NPPbase ≈ NDVIobs/NDVIadj ≈ EVITGS/EVITGSadj
    // EVITGSadj ≈ EVITGS/gpprel
    var yearFilter = ee.Image(EVITGS_current).date()
    var gpprel_current = gpprelIC.filterDate(yearFilter).toBands()
    var EVITGS_adj = ee.Image(EVITGS_current.divide(gpprel_current))
    return EVITGS_adj
}








function ICaddICbyImages(img_current,addIC){
    var yearFilter = ee.Image(img_current).date()
    var addImg_current = addIC.filterDate(yearFilter).toBands()
    var result = ee.Image(img_current.add(addImg_current))
    return result
}

function ICsubtractICbyImages(img_current,subIC){
    var yearFilter = ee.Image(img_current).date()
    var subImg_current = subIC.filterDate(yearFilter).toBands()
    var result = ee.Image(img_current.subtract(subImg_current))
    return result
}


function AddTime2000to2020(IC){
    var timeList = ee.List([946656000000,
        978278400000,
        1009814400000,
        1041350400000,
        1072886400000,
        1104508800000,
        1136044800000,
        1167580800000,
        1199116800000,
        1230739200000,
        1262275200000,
        1293811200000,
        1325347200000,
        1356969600000,
        1388505600000,
        1420041600000,
        1451577600000,
        1483200000000,
        1514736000000,
        1546272000000,
        1577808000000])
    var idx = ee.Number(0)
    var iniDict = {
        index:idx,
        ic:ee.List([])
    }

    var Dp = ee.Dictionary(ee.ImageCollection(IC).iterate(setDate,iniDict));
    return Dp;

    function setDate(image,dict){
        var img = ee.Image(image)
        dict = ee.Dictionary(dict)

        var index = ee.Number(dict.get("index"))
        var starttime = ee.Number(timeList.get(index)).add(ee.Number(28800000))
        img = img.set("system:time_start",starttime)

        var new_ic = ee.List(dict.get("ic")).add(img)
        var new_idx = index.add(1)
        var new_dict = {
            index:new_idx,
            ic:new_ic
        }
        return new_dict
    }
}

function addyear(image){
    var image_date = ee.Date(image.date());
    var image_doy = ee.Number.parse(image_date.format('YYYY'));
    image = image.set("year",image_doy)
    return image.addBands(ee.Image(image_doy).rename('year').toInt())
}

function sgsmooth(IC, order, window_size, times){
    var half_window = (window_size - 1)/2
    var order_range = ee.List.sequence(0,order)
    var k_range = ee.List.sequence(-half_window, half_window)
    var A = ee.Array(k_range.map(function (k) { return order_range.map(function(o) { return ee.Number(k).pow(o)})}))
    var AT = A.matrixTranspose();
    var AA= AT.matrixMultiply(A);
    var size = IC.size()
    var LIC = IC.toList(size);
    var Bandname = ee.Image(LIC.get(0)).bandNames()
    var IC2  = ee.List.sequence(1, times).iterate(sg,IC)
    // var IC = sg(1, IC)
    function sg(n,IC1){
        var IC2 = IC.combine(IC).map(function(image){return image.reduce(ee.Reducer.max()).copyProperties(image, ['system:time_start'])}).sort('system:time_start')
        var ic_size = IC2.size();
        var LIC1 = IC2.toList(ic_size);
        var firstvals = LIC1.slice(1, half_window+1).reverse().map(function(e) { return ee.Image(LIC1.get(0)).subtract(e).abs().multiply(-1).add(ee.Image(LIC1.get(0))) })
        var lastvals = LIC1.slice(-half_window-1,-1).reverse().map(function(e) { return ee.Image(LIC1.get(-1)).subtract(e).abs().add(ee.Image(LIC1.get(-1))) })
        var IC3 = ee.ImageCollection(firstvals.cat(LIC1).cat(lastvals));
        var array = IC3.toArray();
        return ee.ImageCollection(ee.List.sequence(0, size.subtract(1)).map(function(i){
            var b = array.arraySlice(0, ee.Number(i).int(), ee.Number(i).add(window_size).int());
            return ee.Image(AA).matrixSolve(ee.Image(AT).matrixMultiply(b)).arrayProject([0]).arrayGet(0).rename(Bandname).copyProperties(LIC.get(i), ['system:time_start']);
        }))
    }


    return ee.ImageCollection(IC2);
}

//freedom of 20(21-2),t -> p
function confidence90(IC,y,sen,offset){
    IC = ee.ImageCollection(IC)
    var n = IC.count()
    var x_IC = ee.ImageCollection(IC.select("year"))
    var y_IC = ee.ImageCollection(IC.select(y))
    var x_ = x_IC.reduce(ee.Reducer.mean())
    var y_ = y_IC.reduce(ee.Reducer.mean())
    var x2 = x_IC.map(function(img){
        return img.subtract(x_).multiply(img.subtract(x_))
    }).reduce(ee.Reducer.sum())
    var y2 = y_IC.map(function(img){
        return img.subtract(y_).multiply(img.subtract(y_))
    }).reduce(ee.Reducer.sum())
    var xy = IC.map(function(img){
        var x = img.select("year")
        var y = img.select(y)
        var xy = x.subtract(x_).multiply(y.subtract(y_))
        return xy
    }).reduce(ee.Reducer.sum())
    var bottom2 = IC.map(function(img){
        var temp = img.select(y).subtract(offset).subtract(sen.multiply(img.select("year")))
        return temp.multiply(temp)
    }).reduce(ee.Reducer.sum()).divide(n.subtract(2)).sqrt()
    var t_linear = sen.multiply(x2.sqrt()).divide(bottom2)
    t_linear = t_linear.abs()
    return t_linear.gt(1.729)
}