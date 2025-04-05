{
    var region = ee.FeatureCollection("users/zhaoyanbo0712/eastAsia/china")
    var bound = getBounds(region.first())
    // Map.addLayer(bound)
    var annual = ee.Image("users/zhaoyanbo0712/image/annualClassification_00_20_CA")
    var annualIC = ee.ImageCollection.fromImages([annual.select("sdevi_annualTGS_2000_CA_constant"),
          annual.select("sdevi_annualTGS_2001_CA_constant"),annual.select("sdevi_annualTGS_2002_CA_constant"),
          annual.select("sdevi_annualTGS_2003_CA_constant"),annual.select("sdevi_annualTGS_2004_CA_constant"),
          annual.select("sdevi_annualTGS_2005_CA_constant"),annual.select("sdevi_annualTGS_2006_CA_constant"),
          annual.select("sdevi_annualTGS_2007_CA_constant"),annual.select("sdevi_annualTGS_2008_CA_constant"),
          annual.select("sdevi_annualTGS_2009_CA_constant"),annual.select("sdevi_annualTGS_2010_CA_constant"),
          annual.select("sdevi_annualTGS_2011_CA_constant"),annual.select("sdevi_annualTGS_2012_CA_constant"),
          annual.select("sdevi_annualTGS_2013_CA_constant"),annual.select("sdevi_annualTGS_2014_CA_constant"),
          annual.select("sdevi_annualTGS_2015_CA_constant"),annual.select("sdevi_annualTGS_2016_CA_constant"),
          annual.select("sdevi_annualTGS_2017_CA_constant"),annual.select("sdevi_annualTGS_2018_CA_constant"),
          annual.select("sdevi_annualTGS_2019_CA_constant"),annual.select("sdevi_annualTGS_2020_CA_constant")])
          .map(function(image){
            image = image.rename("type")
            var temp = image.multiply(0)
            image = temp.where(image.eq(0),1)
      return image
    })
    annualIC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(annualIC)).get("ic"))).map(addyear)
    // print(annualIC)
    // Map.addLayer(annualIC)
    var sdevi = ee.ImageCollection("users/zhaoyanbo0712/graduate_thesis_IC/SDEVI").map(function(image){
      return image.rename("sdevi")
    })
    // print(sdevi)
    // Map.addLayer(sdevi)
    sdevi = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(sdevi)).get("ic")))//.map(addyear)
    // print(sdevi)
    // print(ee.Number(sdevi.first().date().format("YYYY")))
    // Map.addLayer(sdevi)
    
    // var lt = ee.Algorithms.TemporalSegmentation.LandTrendr(annualIC,2)
    // var LTarray = lt.select(['LandTrendr']); // subset the LandTrendr segmentation info
    // var year = LTarray.arraySlice(0, 0, 1); // slice out the year row
    // var fitted = LTarray.arraySlice(0, 2, 3); // slice out the fitted values row
    // var vertice = LTarray.arraySlice(0, 3, 4); 
    // Map.addLayer(LTarray)
    // Map.addLayer(year)
    // Map.addLayer(fitted)
    // Map.addLayer(vertice.arraySlice(1, 0, 1))
    // Map.addLayer(vertice.toArray(1))
    // print(vertice.toArray(1))
    var target_area = ee.Image("users/zhaoyanbo0712/China/target_area_CHN")
    var sdevi00 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2000").rename("sdevi_2000")
    var sdevi01 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2001").rename("sdevi_2001")
    var sdevi02 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2002").rename("sdevi_2002")
    var sdevi03 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2003").rename("sdevi_2003")
    var sdevi04 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2004").rename("sdevi_2004")
    var sdevi05 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2005").rename("sdevi_2005")
    var sdevi06 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2006").rename("sdevi_2006")
    var sdevi07 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2007").rename("sdevi_2007")
    var sdevi08 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2008").rename("sdevi_2008")
    var sdevi09 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2009").rename("sdevi_2009")
    var sdevi10 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2010").rename("sdevi_2010")
    var sdevi11 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2011").rename("sdevi_2011")
    var sdevi12 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2012").rename("sdevi_2012")
    var sdevi13 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2013").rename("sdevi_2013")
    var sdevi14 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2014").rename("sdevi_2014")
    var sdevi15 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2015").rename("sdevi_2015")
    var sdevi16 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2016").rename("sdevi_2016")
    var sdevi17 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2017").rename("sdevi_2017")
    var sdevi18 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2018").rename("sdevi_2018")
    var sdevi19 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2019").rename("sdevi_2019")
    var sdevi20 = ee.Image("users/zhaoyanbo0712/China/SDEVI_2020").rename("sdevi_2020")
    
    var sdevi = ee.ImageCollection.fromImages([sdevi00,sdevi01,sdevi02,sdevi03,sdevi04,sdevi05,sdevi06,sdevi07,
                                                  sdevi08,sdevi09,sdevi10,sdevi11,sdevi12,sdevi13,sdevi14,sdevi15,
                                                  sdevi16,sdevi17,sdevi18,sdevi19,sdevi20])
                                                  .map(function(img){
                                                    img = img.rename("sdevi")
                                                    return img.lt(0.02)
                                                  })
    var desert_freq = sdevi.sum().add(1).toInt()
    // PGZ:1  TZ:2   PDZ:3
    var desertZone = desert_freq.where(desert_freq.lte(1),1)
    desertZone = desertZone.where(desertZone.gt(1).and(desertZone.lt(20)),2)
    desertZone = desertZone.where(desertZone.gte(20),3)
    desertZone = desertZone.toInt()
    
    Export.image.toDrive({
        image:desert_freq.toInt(),
        description:"desert_freq_CHN_added1",
        region:region,
        crs:"EPSG:4326",
        folder:"result3",
        maxPixels:1e13,
        scale:500
      }) 
      
    // Export.image.toDrive({
    //     image:desertZone.updateMask(target_area).toInt(),
    //     description:"three_zones_CHN",
    //     region:region,
    //     crs:"EPSG:4326",
    //     folder:"result3",
    //     maxPixels:1e13,
    //     scale:500
    //   }) 
    
     var pixelArea1 = ee.Image.pixelArea().addBands(sdevi20.gte(0.02)).reduceRegion({
      reducer:ee.Reducer.sum().group({
        groupField: 1, 
        groupName: "sdevi_2000"
      }),
      geometry:region,
      scale:500,
      maxPixels:1e13
    })
    // print(pixelArea1)
    // print(ee.Dictionary(ee.List(ee.Dictionary(pixelArea1).get("groups")).get(1)).get("sum"))
    
    // var basemap = ee.Image("users/zhaoyanbo0712/eastAsia/igbp_basemap_china")
    // var mask1 = ee.Image("users/zhaoyanbo0712/eastAsia/QZ_fixed_Mask_CHN_0102").eq(1)
    // var mask2 = ee.Image("users/zhaoyanbo0712/eastAsia/QZ_fixed_Mask_CHN_0304").eq(1)
    // var mask3 = ee.Image("users/zhaoyanbo0712/eastAsia/QZ_fixed_Mask_CHN_0506").eq(1)
    // var mask4 = ee.Image("users/zhaoyanbo0712/eastAsia/QZ_fixed_Mask_CHN_0708").eq(1)
    // var mask5 = ee.Image("users/zhaoyanbo0712/eastAsia/QZ_fixed_Mask_CHN_0910").eq(1)
    // var mask6 = ee.Image("users/zhaoyanbo0712/eastAsia/QZ_fixed_Mask_CHN_1112").eq(1)
    // var mask7 = ee.Image("users/zhaoyanbo0712/eastAsia/QZ_fixed_Mask_CHN_1314").eq(1)
    // var mask8 = ee.Image("users/zhaoyanbo0712/eastAsia/QZ_fixed_Mask_CHN_1516").eq(1)
    // var mask9 = ee.Image("users/zhaoyanbo0712/eastAsia/QZ_fixed_Mask_CHN_1718").eq(1)
    // var mask10 = ee.Image("users/zhaoyanbo0712/eastAsia/QZ_fixed_Mask_CHN_1920").eq(1)
  
    // var mask = ee.ImageCollection.fromImages([mask1,mask2,mask3,mask4,mask5,
    //                                         mask6,mask7,mask8,mask9,mask10])
    // var count = mask.count()
    // var sum = mask.sum()
    // var inteMask = ee.Image(0).where(count.eq(sum),1).clip(region)
  
    // var target_area = basemap.and(inteMask)
    
    
    var PGZ = desert_freq.updateMask(target_area).lte(1)
    var PDZ = desert_freq.updateMask(target_area).gte(20)
    var TZ = desert_freq.updateMask(target_area).where(desert_freq.gte(20),1).gt(1)
    var all = target_area
    
    /*trend analyst*/
    var three_zones = ee.Image("users/zhaoyanbo0712/image/three_zones")
    // var all = three_zones.multiply(0).add(1)
    // var PGZ = three_zones.multiply(0).where(three_zones.eq(0),1)
    // var TZ = three_zones.multiply(0).where(three_zones.eq(2),1)
    // var PDZ = three_zones.multiply(0).where(three_zones.eq(1),1)
    
    
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
    
    var evitgs = ee.ImageCollection.fromImages([evitgs00,evitgs01,evitgs02,evitgs03,evitgs04,
                                                      evitgs05,evitgs06,evitgs07,evitgs08,evitgs09,evitgs10,
                                                      evitgs11,evitgs12,evitgs13,evitgs14,evitgs15,evitgs16,
                                                      evitgs17,evitgs18,evitgs19,evitgs20])
                                                      .map(function(image){
                                                                return image.rename("evitgs")
                                                          })
    evitgs = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2020(evitgs)).get("ic")))
    
    /*reduceRegion*/
    var eviList = evitgs.toList(21)
    var eviInPGZ = eviList.map(function(img){
        img = ee.Image(img).updateMask(PGZ)
        var dict = img.reduceRegion({
            reducer:ee.Reducer.mean(),
            geometry:bound,
            scale:500,
            crs:"EPSG:4326",
            maxPixels:1e13
        })
    return dict
    })
    // print(eviInPGZ)
    
    var eviInPDZ = eviList.map(function(img){
        img = ee.Image(img).updateMask(PDZ)
        var dict = img.reduceRegion({
            reducer:ee.Reducer.mean(),
            geometry:bound,
            scale:500,
            crs:"EPSG:4326",
            maxPixels:1e13
        })
    return dict
    })
    // print(eviInPDZ)
    
    var eviInTZ = eviList.map(function(img){
        img = ee.Image(img).updateMask(TZ)
        var dict = img.reduceRegion({
            reducer:ee.Reducer.mean(),
            geometry:bound,
            scale:500,
            crs:"EPSG:4326",
            maxPixels:1e13
        })
    return dict
    })
    // print(eviInTZ)
    var eviInAll = eviList.map(function(img){
        img = ee.Image(img).updateMask(all)
        var dict = img.reduceRegion({
            reducer:ee.Reducer.mean(),
            geometry:bound,
            scale:500,
            crs:"EPSG:4326",
            maxPixels:1e13
        })
    return dict
    })
    // print(eviInAll)
    
    
    
    
    var tau = evitgs.reduce(ee.Reducer.kendallsCorrelation(1)).select("evitgs_tau")
    // z = 3*tau*sqrt[n*n-1]/sqrt[2*(2*n+5)]
    var n = evitgs.count()
    var top = (n.multiply(n.subtract(1))).sqrt()
    var bottom = ((n.multiply(0).add(2)).multiply(n.multiply(2).add(5))).sqrt()
    var z_kendall = tau.multiply(3).multiply(top).divide(bottom)
    z_kendall = z_kendall.abs()
    // Map.addLayer(tau,null,"tau")
    // Map.addLayer(z_kendall,null,"|z|")
    
    
    
    
    evitgs = evitgs.map(addyear)//.filterDate("2008-01-01","2021-01-01")
    // evitgs = evitgs.map(function(img){
    //         var year = img.select("year").subtract(2000)
    //         var image = img.select("evitgs").addBands(year)
    //         return image
    // })
    
    // var slope = evitgs.select(["year","evitgs"]).reduce(ee.Reducer.linearFit()).select("scale")
    // Map.addLayer(slope)
    // var sen = evitgs.select(["year","evitgs"]).reduce(ee.Reducer.linearFit()).select("scale")
    // var offset = evitgs.select(["year","evitgs"]).reduce(ee.Reducer.linearFit()).select("offset")
    var sen = evitgs.select(["year","evitgs"]).reduce(ee.Reducer.sensSlope()).select("slope")
    var offset = evitgs.select(["year","evitgs"]).reduce(ee.Reducer.sensSlope()).select("offset")
    var x_ = evitgs.select("year").reduce(ee.Reducer.mean())
    var y_ = evitgs.select("evitgs").reduce(ee.Reducer.mean())
    var x2 = evitgs.select("year").map(function(img){
        return img.subtract(x_).multiply(img.subtract(x_))
    }).reduce(ee.Reducer.sum())
    var y2 = evitgs.select("evitgs").map(function(img){
        return img.subtract(y_).multiply(img.subtract(y_))
    }).reduce(ee.Reducer.sum())
    var xy = evitgs.map(function(img){
              var x = img.select("year")
              var y = img.select("evitgs")
              var xy = x.subtract(x_).multiply(y.subtract(y_))
              return xy
    }).reduce(ee.Reducer.sum())
    // var bet1 = xy.divide(x2)
    // var bet0 = y_.subtract(bet1.multiply(x_))
    
    // var sigma2 = evitgs.map(function(img){
    //           var x = img.select("year")
    //           var y = img.select("evitgs")
    //           var si = y.subtract(bet0).subtract(bet1.multiply(x))
    //           return si.multiply(si)
    // }).reduce(ee.Reducer.sum()).divide(n.subtract(2))
    // var sigma = sigma2.sqrt()
    // var t = bet1.multiply(x2.sqrt()).divide(sigma)
    
    // var s2slope = x2.subtract(sen.multiply(sen).multiply(y2))
    // s2slope = s2slope.divide(n.subtract(2))
    // var t_linear = sen.divide(s2slope.sqrt())
    var bottom2 = evitgs.map(function(img){
        var temp = img.select("evitgs").subtract(offset).subtract(sen.multiply(img.select("year")))
        return temp.multiply(temp)
    }).reduce(ee.Reducer.sum()).divide(n.subtract(2)).sqrt()
    var t_linear = sen.multiply(x2.sqrt()).divide(bottom2)
    t_linear = t_linear.abs()
    
    // Map.addLayer(sen,null,"slope")
    // Map.addLayer(t_linear,null,"|t|")
    
    
    
    
    tau = tau.updateMask(all)
    z_kendall = z_kendall.updateMask(all)
    sen = sen.updateMask(all)
    t_linear = t_linear.updateMask(all)
    // Map.addLayer(tau.gt(0),null,"tau")
    // Map.addLayer(z_kendall.gt(1.65),null,"|z|")
    // Map.addLayer(sen.gt(0),null,"slope")
    // Map.addLayer(t_linear,null,"|t|")
      // Export.image.toDrive({
      //   image:tau,
      //   description:"tau_CHN",
      //   region:region,
      //   crs:"EPSG:4326",
      //   folder:"result3",
      //   maxPixels:1e13,
      //   scale:500
      // }) 
      
      // Export.image.toDrive({
      //   image:sen,
      //   description:"sen_CHN",
      //   region:region,
      //   crs:"EPSG:4326",
      //   folder:"result3",
      //   maxPixels:1e13,
      //   scale:500
      // })
      
      // Export.image.toDrive({
      //   image:z_kendall,
      //   description:"z_kendall_CHN",
      //   region:region,
      //   crs:"EPSG:4326",
      //   folder:"result3",
      //   maxPixels:1e13,
      //   scale:500
      // })
      
      // Export.image.toDrive({
      //   image:t_linear,
      //   description:"linear_t_CHN",
      //   region:region,
      //   crs:"EPSG:4326",
      //   folder:"result3",
      //   maxPixels:1e13,
      //   scale:500
      // }) 
    
    
    /*target area  (PGZ:   three_zones.updateMask(PGZ))
    mask1:   slope > 0  and p < 0.05
    mask2:   slope > 0  and p < 0.1
    mask3:   slope > 0
    mask4:   slope < 0  and p < 0.05
    mask5:   slope < 0  and p < 0.1
    mask6:   slope < 0
    */
    
    var linear_mask1 = all/*.updateMask(TZ)*/.multiply(0).where(sen.gt(0).and(t_linear.gt(2.093)),1) //注意自由度 
    var linear_mask2 = all/*.updateMask(TZ)*/.multiply(0).where(sen.gt(0).and(t_linear.gt(1.729)),1)
    var linear_mask3 = all/*.updateMask(TZ)*/.multiply(0).where(sen.gt(0),1)
    var linear_mask4 = all/*.updateMask(TZ)*/.multiply(0).where(sen.lt(0).and(t_linear.gt(2.093)),1)
    var linear_mask5 = all/*.updateMask(TZ)*/.multiply(0).where(sen.lt(0).and(t_linear.gt(1.729)),1)
    var linear_mask6 = all/*.updateMask(TZ)*/.multiply(0).where(sen.lt(0),1)
    var kendall_mask1 = all/*.updateMask(TZ)*/.multiply(0).where(tau.gt(0).and(z_kendall.gt(1.96)),1)
    var kendall_mask2 = all/*.updateMask(TZ)*/.multiply(0).where(tau.gt(0).and(z_kendall.gt(1.65)),1)
    var kendall_mask3 = all/*.updateMask(TZ)*/.multiply(0).where(tau.gt(0),1)
    var kendall_mask4 = all/*.updateMask(TZ)*/.multiply(0).where(tau.lt(0).and(z_kendall.gt(1.96)),1)
    var kendall_mask5 = all/*.updateMask(TZ)*/.multiply(0).where(tau.lt(0).and(z_kendall.gt(1.65)),1)
    var kendall_mask6 = all/*.updateMask(TZ)*/.multiply(0).where(tau.lt(0),1)
    
    
    
    var areaPixels1 = all.multiply(0).updateMask(linear_mask6)//change
    var areaPixels2 = all.multiply(0).updateMask(kendall_mask6)//change
    // var areaPixels1 = three_zones.multiply(0)
    // var areaPixels2 = three_zones.updateMask(PGZ).multiply(0)
    // var areaPixels1 = three_zones.updateMask(TZ).multiply(0)
    // var areaPixels2 = three_zones.updateMask(PDZ).multiply(0)
    var pixelArea1 = ee.Image.pixelArea().addBands(areaPixels1).reduceRegion({
      reducer:ee.Reducer.sum().group({
        groupField: 1, 
        groupName: "constant"
      }),
      geometry:bound,
      scale:500,
      maxPixels:1e13
    })
    print(pixelArea1)
    
    var pixelArea2 = ee.Image.pixelArea().addBands(areaPixels2).reduceRegion({
      reducer:ee.Reducer.sum().group({
        groupField: 1, 
        groupName: "constant"
      }),
      geometry:bound,
      scale:500,
      maxPixels:1e13
    })
    print(pixelArea2)
    
    
    
    tau = tau.multiply(10000).add(1)
    sen = sen.multiply(10000)
    var kendall005 = ee.Image(1).clip(bound).where(z_kendall.gt(1.96),tau)
    var linear005 = ee.Image(0).clip(bound).where(t_linear.gt(2.093),sen)
    // Map.addLayer(kendall005)
    // Map.addLayer(linear005)
    // Export.image.toDrive({
    //   image:kendall005,
    //   description:"kendall_Plt005",
    //   region:region,
    //   crs:"EPSG:4326",
    //   folder:"result",
    //   maxPixels:1e13,
    //   scale:500
    // }) 
    
    // Export.image.toDrive({
    //   image:linear005,
    //   description:"linear_Plt005",
    //   region:region,
    //   crs:"EPSG:4326",
    //   folder:"result",
    //   maxPixels:1e13,
    //   scale:500
    // }) 
    
    
    
    var pdsi = ee.Image("users/zhaoyanbo0712/eastAsia/pdsi_CHN_2000_2021")
    var pre = ee.Image("users/zhaoyanbo0712/eastAsia/pre_CHN_2000_2021")
    var tmp = ee.Image("users/zhaoyanbo0712/eastAsia/tmp_CHN_2000_2021")
    
    var pdsiIC = ee.ImageCollection.fromImages([pdsi.select("pdsi_2000"),pdsi.select("pdsi_2001"),
        pdsi.select("pdsi_2002"),pdsi.select("pdsi_2003"),pdsi.select("pdsi_2004"),
        pdsi.select("pdsi_2005"),pdsi.select("pdsi_2006"),pdsi.select("pdsi_2007"),
        pdsi.select("pdsi_2008"),pdsi.select("pdsi_2009"),pdsi.select("pdsi_2010"),
        pdsi.select("pdsi_2011"),pdsi.select("pdsi_2012"),pdsi.select("pdsi_2013"),
        pdsi.select("pdsi_2014"),pdsi.select("pdsi_2015"),pdsi.select("pdsi_2016"),
        pdsi.select("pdsi_2017"),pdsi.select("pdsi_2018"),pdsi.select("pdsi_2019"),
        pdsi.select("pdsi_2020"),pdsi.select("pdsi_2021")])
          .map(function(image){
            image = image.rename("pdsi")
            return image
    })
    pdsiIC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2021(pdsiIC)).get("ic"))).map(addyear)
    // var pdsi_slope = pdsiIC.filterDate("2008-01-01","2021-01-01").select(["year","pdsi"]).reduce(ee.Reducer.sensSlope()).select("slope").updateMask(all)
    // Map.addLayer(pdsi_slope,null,"pdsi_slope")
    
    var preIC = ee.ImageCollection.fromImages([pre.select("pre_2000"),pre.select("pre_2001"),
        pre.select("pre_2002"),pre.select("pre_2003"),pre.select("pre_2004"),
        pre.select("pre_2005"),pre.select("pre_2006"),pre.select("pre_2007"),
        pre.select("pre_2008"),pre.select("pre_2009"),pre.select("pre_2010"),
        pre.select("pre_2011"),pre.select("pre_2012"),pre.select("pre_2013"),
        pre.select("pre_2014"),pre.select("pre_2015"),pre.select("pre_2016"),
        pre.select("pre_2017"),pre.select("pre_2018"),pre.select("pre_2019"),
        pre.select("pre_2020"),pre.select("pre_2021")])
          .map(function(image){
            image = image.rename("pre")
            return image
    })
    preIC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2021(preIC)).get("ic"))).map(addyear)
    // var pre_slope = preIC.filterDate("2008-01-01","2021-01-01").select(["year","pre"]).reduce(ee.Reducer.sensSlope()).select("slope").updateMask(all)
    // Map.addLayer(pre_slope,null,"pre_slope")
    
    var tmpIC = ee.ImageCollection.fromImages([tmp.select("tmp_2000"),tmp.select("tmp_2001"),
        tmp.select("tmp_2002"),tmp.select("tmp_2003"),tmp.select("tmp_2004"),
        tmp.select("tmp_2005"),tmp.select("tmp_2006"),tmp.select("tmp_2007"),
        tmp.select("tmp_2008"),tmp.select("tmp_2009"),tmp.select("tmp_2010"),
        tmp.select("tmp_2011"),tmp.select("tmp_2012"),tmp.select("tmp_2013"),
        tmp.select("tmp_2014"),tmp.select("tmp_2015"),tmp.select("tmp_2016"),
        tmp.select("tmp_2017"),tmp.select("tmp_2018"),tmp.select("tmp_2019"),
        tmp.select("tmp_2020"),tmp.select("tmp_2021")])
          .map(function(image){
            image = image.rename("tmp")
            return image
    })
    tmpIC = ee.ImageCollection(ee.List(ee.Dictionary(AddTime2000to2021(tmpIC)).get("ic"))).map(addyear)
    // var tmp_slope = tmpIC.filterDate("2008-01-01","2021-01-01").select(["year","tmp"]).reduce(ee.Reducer.sensSlope()).select("slope").updateMask(all)
    // Map.addLayer(tmp_slope,null,"tmp_slope")
    print(preIC)
    print(pdsiIC)
    print(tmpIC)
    
    
    // Export.image.toDrive({
    //   image:pdsi_slope,
    //   description:"pdsi_slope_0820",
    //   region:region,
    //   crs:"EPSG:4326",
    //   folder:"result",
    //   maxPixels:1e13,
    //   scale:4638.3
    // }) 
    
    // Export.image.toDrive({
    //   image:pre_slope,
    //   description:"pre_slope_0820",
    //   region:region,
    //   crs:"EPSG:4326",
    //   folder:"result",
    //   maxPixels:1e13,
    //   scale:4638.3
    // })
    
    // Export.image.toDrive({
    //   image:tmp_slope,
    //   description:"tmp_slope_0820",
    //   region:region,
    //   crs:"EPSG:4326",
    //   folder:"result",
    //   maxPixels:1e13,
    //   scale:4638.3
    // })
    
    var pdsiInAll = pdsiIC.select("pdsi").toList(21).map(function(img){
        img = ee.Image(img).updateMask(all)
        var dict = img.reduceRegion({
            reducer:ee.Reducer.mean(),
            geometry:bound,
            scale:4638.3,
            crs:"EPSG:4326",
            maxPixels:1e13
        })
    return dict
    })
    // print(pdsiInAll)
    
    var preInAll = preIC.select("pre").toList(21).map(function(img){
        img = ee.Image(img).updateMask(all)
        var dict = img.reduceRegion({
            reducer:ee.Reducer.mean(),
            geometry:bound,
            scale:4638.3,
            crs:"EPSG:4326",
            maxPixels:1e13
        })
    return dict
    })
    // print(preInAll)
    
    var tmpInAll = tmpIC.select("tmp").toList(21).map(function(img){
        img = ee.Image(img).updateMask(all)
        var dict = img.reduceRegion({
            reducer:ee.Reducer.mean(),
            geometry:bound,
            scale:4638.3,
            crs:"EPSG:4326",
            maxPixels:1e13
        })
    return dict
    })
    // print(tmpInAll)
    
    // pdsiIC = pdsiIC//.filterDate("2008-01-01","2021-01-01")
    // preIC = preIC//.filterDate("2008-01-01","2021-01-01")
    // tmpIC = tmpIC//.filterDate("2002-01-01","2009-01-01")
    // var pdsi_offset = pdsiIC.select(["year","pdsi"]).reduce(ee.Reducer.sensSlope()).select("offset").updateMask(all)
    // var x_1 = pdsiIC.select("year").reduce(ee.Reducer.mean())
    // var y_1 = pdsiIC.select("pdsi").reduce(ee.Reducer.mean())
    // var x2_1 = pdsiIC.select("year").map(function(img){
    //     return img.subtract(x_1).multiply(img.subtract(x_1))
    // }).reduce(ee.Reducer.sum())
    // var y2_1 = pdsiIC.select("pdsi").map(function(img){
    //     return img.subtract(y_1).multiply(img.subtract(y_1))
    // }).reduce(ee.Reducer.sum())
    // var bottom2_1 = pdsiIC.map(function(img){
    //     var temp = img.select("pdsi").subtract(pdsi_offset).subtract(pdsi_slope.multiply(img.select("year")))
    //     return temp.multiply(temp)
    // }).reduce(ee.Reducer.sum()).divide(n.subtract(2)).sqrt()
    // var t_pdsi = pdsi_slope.multiply(x2_1.sqrt()).divide(bottom2_1)
    // t_pdsi = t_pdsi.abs()
    // // Map.addLayer(t_pdsi.gt(2.093))
    
    // var pre_offset = preIC.select(["year","pre"]).reduce(ee.Reducer.sensSlope()).select("offset").updateMask(all)
    // var x_2 = preIC.select("year").reduce(ee.Reducer.mean())
    // var y_2 = preIC.select("pre").reduce(ee.Reducer.mean())
    // var x2_2 = preIC.select("year").map(function(img){
    //     return img.subtract(x_2).multiply(img.subtract(x_2))
    // }).reduce(ee.Reducer.sum())
    // var y2_2 = preIC.select("pre").map(function(img){
    //     return img.subtract(y_2).multiply(img.subtract(y_2))
    // }).reduce(ee.Reducer.sum())
    // var bottom2_2 = preIC.map(function(img){
    //     var temp = img.select("pre").subtract(pre_offset).subtract(pre_slope.multiply(img.select("year")))
    //     return temp.multiply(temp)
    // }).reduce(ee.Reducer.sum()).divide(n.subtract(2)).sqrt()
    // var t_pre = pre_slope.multiply(x2_2.sqrt()).divide(bottom2_2)
    // t_pre = t_pre.abs()
    // // Map.addLayer(t_pre.gt(2.093))
    
    // var tmp_offset = tmpIC.select(["year","tmp"]).reduce(ee.Reducer.sensSlope()).select("offset").updateMask(all)
    // var x_3 = tmpIC.select("year").reduce(ee.Reducer.mean())
    // var y_3 = tmpIC.select("tmp").reduce(ee.Reducer.mean())
    // var x2_3 = tmpIC.select("year").map(function(img){
    //     return img.subtract(x_3).multiply(img.subtract(x_3))
    // }).reduce(ee.Reducer.sum())
    // var y2_3 = tmpIC.select("tmp").map(function(img){
    //     return img.subtract(y_3).multiply(img.subtract(y_3))
    // }).reduce(ee.Reducer.sum())
    // var bottom2_3 = tmpIC.map(function(img){
    //     var temp = img.select("tmp").subtract(tmp_offset).subtract(tmp_slope.multiply(img.select("year")))
    //     return temp.multiply(temp)
    // }).reduce(ee.Reducer.sum()).divide(n.subtract(2)).sqrt()
    // var t_tmp = tmp_slope.multiply(x2_3.sqrt()).divide(bottom2_3)
    // t_tmp = t_tmp.abs()
    // Map.addLayer(t_tmp.gt(2.201))
    
    

    
    
    
    
    
    
    
    
    /*attribution analyst*/
    // .filterDate("2002-01-01","2009-01-01")
    //.filterDate("2008-01-01","2021-01-01")
    var evitgs_pdsi = evitgs.select("evitgs").map(function(evi){
        var start_date = evi.date().format("YYYY-MM-DD")
        var end_date = evi.date().advance(1,"year").format("YYYY-MM-DD")
        pdsi = pdsiIC.select("pdsi").filterDate(start_date,end_date).toBands().rename("pdsi")
        evi = evi.addBands(pdsi)
        return evi
    })
    // print(pdsiIC.select("pdsi").filterDate("2020","2021").first().date().format("YYYY-MM-DD"))
    var evitgs_pre = evitgs.select("evitgs").map(function(evi){
        var start_date = evi.date().format("YYYY-MM-DD")
        var end_date = evi.date().advance(1,"year").format("YYYY-MM-DD")
        pre = preIC.select("pre").filterDate(start_date,end_date).toBands().rename("pre")
        evi = evi.addBands(pre)
        return evi
    })
    
    var evitgs_tmp = evitgs.select("evitgs").map(function(evi){
        var start_date = evi.date().format("YYYY-MM-DD")
        var end_date = evi.date().advance(1,"year").format("YYYY-MM-DD")
        tmp = tmpIC.select("tmp").filterDate(start_date,end_date).toBands().rename("tmp")
        evi = evi.addBands(tmp)
        return evi
    })
    
    var r_evi_pdsi = evitgs_pdsi.reduce(ee.Reducer.pearsonsCorrelation()).updateMask(all)
    var r_evi_pre = evitgs_pre.reduce(ee.Reducer.pearsonsCorrelation()).updateMask(all)
    var r_evi_tmp = evitgs_tmp.reduce(ee.Reducer.pearsonsCorrelation()).updateMask(all)
    
    var pdsi_005_mask = all.multiply(0).where(r_evi_pdsi.select("p-value").lt(0.05),1)
    var pre_005_mask = all.multiply(0).where(r_evi_pre.select("p-value").lt(0.05),1)
    var tmp_005_mask = all.multiply(0).where(r_evi_tmp.select("p-value").lt(0.05),1)
    // Map.addLayer(pdsi_005_mask)
    // Map.addLayer(pre_005_mask)
    // Map.addLayer(tmp_005_mask)
    // Map.addLayer(r_evi_pdsi.select("p-value"))
    // Map.addLayer(r_evi_pre.select("p-value"))
    // Map.addLayer(r_evi_tmp.select("p-value"))
    
    Export.image.toDrive({
      image:r_evi_pdsi.select("p-value"),
      description:"pdsi_correlation_CHN_p-value",
      region:region,
      crs:"EPSG:4326",
      folder:"result",
      maxPixels:1e13,
      scale:500
    }) 
    
    Export.image.toDrive({
      image:r_evi_pre.select("p-value"),
      description:"pre_correlation_CHN_p-value",
      region:region,
      crs:"EPSG:4326",
      folder:"result",
      maxPixels:1e13,
      scale:500
    })
    
    Export.image.toDrive({
      image:r_evi_tmp.select("p-value"),
      description:"tmp_correlation_CHN_p-value",
      region:region,
      crs:"EPSG:4326",
      folder:"result",
      maxPixels:1e13,
      scale:500
    })
    
  
    
    
    
    
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
  
  
  function AddTime2000to2021(IC){
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
                              1577808000000,
                              1609430400000])
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
  
  function getBounds(Ft){
    var geo = ee.Feature(Ft).geometry()
    var bound = geo.bounds()
    return ee.FeatureCollection(bound)
  }