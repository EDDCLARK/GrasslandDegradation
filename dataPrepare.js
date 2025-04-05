{
    var MCD12Q1 = ee.ImageCollection("MODIS/006/MCD12Q1")
    var MOD09A1 =  ee.ImageCollection("MODIS/006/MOD09A1")
    var MOD11A2 = ee.ImageCollection("MODIS/006/MOD11A2")
    var starttime = ee.Date("2000-01-01")
    var yearNum = 21
    var endtime = starttime.advance(yearNum,"year")
    
    // var igbp1 = ee.Image('MODIS/051/MCD12Q1/2001_01_01')
    // var igbp2 = ee.Image('MODIS/051/MCD12Q1/2002_01_01')
    // var igbp3 = ee.Image('MODIS/051/MCD12Q1/2003_01_01')
    // var igbp4 = ee.Image('MODIS/051/MCD12Q1/2004_01_01')
    // var igbp5 = ee.Image('MODIS/051/MCD12Q1/2005_01_01')
    // var igbp6 = ee.Image('MODIS/051/MCD12Q1/2006_01_01')
    // var igbp7 = ee.Image('MODIS/051/MCD12Q1/2007_01_01')
    // var igbp8 = ee.Image('MODIS/051/MCD12Q1/2008_01_01')
    // var igbp9 = ee.Image('MODIS/051/MCD12Q1/2009_01_01')
    // var igbp10 = ee.Image('MODIS/051/MCD12Q1/2010_01_01')
    // var igbp11 = ee.Image('MODIS/051/MCD12Q1/2011_01_01')
    // var igbp12 = ee.Image('MODIS/051/MCD12Q1/2012_01_01')
    // var mcd12q1 = ee.ImageCollection([igbp1,igbp2,igbp3,igbp4,igbp5,igbp6,igbp7,igbp8,igbp9,igbp10,igbp11,igbp12])
    
    var climate = ee.ImageCollection("IDAHO_EPSCOR/TERRACLIMATE")
    
    var pre = ee.Image("users/zhaoyanbo0712/image/pre_annual_2000_2020_CA")
    var pdsi = ee.Image("users/zhaoyanbo0712/image/PDSI_annual_2000_2020_CA")
    
    // var pre = ee.ImageCollection(ee.List.sequence(0,yearNum-1).map(function(year){
    //       var starttime1 = starttime.advance(year,"year")
    //       var endtime1 = starttime.advance(ee.Number(year).add(1),"year")
    //       var preImage = climate.filterDate(starttime1,endtime1).select("pr").reduce(ee.Reducer.mean())
    //       return preImage
    // }))
    // pre = pre.toBands().rename(["mean_pre_2000","mean_pre_2001","mean_pre_2002","mean_pre_2003","mean_pre_2004",
    //                     "mean_pre_2005","mean_pre_2006","mean_pre_2007","mean_pre_2008","mean_pre_2009",
    //                     "mean_pre_2010","mean_pre_2011","mean_pre_2012","mean_pre_2013","mean_pre_2014",
    //                     "mean_pre_2015","mean_pre_2016","mean_pre_2017","mean_pre_2018","mean_pre_2019","mean_pre_2020",])
    // var tmp = ee.ImageCollection(ee.List.sequence(0,yearNum-1).map(function(year){
    //       var starttime1 = starttime.advance(year,"year")
    //       var endtime1 = starttime.advance(ee.Number(year).add(1),"year")
    //       var month_mean = ee.ImageCollection(meanTmp(climate.filterDate(starttime1,endtime1))).reduce(ee.Reducer.mean())
    //       return month_mean
    // }))
    // tmp = tmp.toBands().rename(["mean_tmp_2000","mean_tmp_2001","mean_tmp_2002","mean_tmp_2003","mean_tmp_2004",
    //                     "mean_tmp_2005","mean_tmp_2006","mean_tmp_2007","mean_tmp_2008","mean_tmp_2009",
    //                     "mean_tmp_2010","mean_tmp_2011","mean_tmp_2012","mean_tmp_2013","mean_tmp_2014",
    //                     "mean_tmp_2015","mean_tmp_2016","mean_tmp_2017","mean_tmp_2018","mean_tmp_2019","mean_tmp_2020",])
    // var pdsi = ee.ImageCollection(ee.List.sequence(0,yearNum-1).map(function(year){
    //       var starttime1 = starttime.advance(year,"year")
    //       var endtime1 = starttime.advance(ee.Number(year).add(1),"year")
    //       var preImage = climate.filterDate(starttime1,endtime1).select("pdsi").reduce(ee.Reducer.mean())
    //       return preImage.multiply(0.01)
    // }))
    // pdsi = pdsi.toBands().rename(["mean_pdsi_2000","mean_pdsi_2001","mean_pdsi_2002","mean_pdsi_2003","mean_pdsi_2004",
    //                     "mean_pdsi_2005","mean_pdsi_2006","mean_pdsi_2007","mean_pdsi_2008","mean_pdsi_2009",
    //                     "mean_pdsi_2010","mean_pdsi_2011","mean_pdsi_2012","mean_pdsi_2013","mean_pdsi_2014",
    //                     "mean_pdsi_2015","mean_pdsi_2016","mean_pdsi_2017","mean_pdsi_2018","mean_pdsi_2019","mean_pdsi_2020",])
    var roi = ee.FeatureCollection("users/zhaoyanbo0712/shp/central_asia_all")
    var roi_bound = ee.FeatureCollection(getBounds(ee.FeatureCollection("users/zhaoyanbo0712/shp/central_asia_all").first()));
    roi = roi_bound
    Map.addLayer(roi)
    var roi1 = ee.Geometry.Polygon([[45.51,56],[87.42,56],[87.42,35],[45.51,35]]);
    var roi2 = ee.Geometry.Polygon([[59.55,45],[61.55,45],[61.55,46],[59.55,46]]);
    // roi = ee.Geometry(roi2,null,false);
    var collection = MCD12Q1.filterDate(starttime,endtime)
                            .map(function(image){
                              return image.select(['LC_Type1']);
    });
    
    var target_collection = collection.map(function(image){
                    var mask = image.eq(10).or(image.eq(16));
                    return image = image.updateMask(mask).clip(roi)//.reproject(crs1,null,500);
    });
    Map.addLayer(target_collection.filterDate('2019-01-01',"2020-01-01").first().eq(16))
    
  
    var collection2 = MOD09A1.filterDate(starttime,endtime).map(function(image){
                //var QA = image.select("QA");
                var stateQA = image.select("StateQA")
                //var cloudMask = 1 << 01;
                //var cloudMask1 = bitwiseExtract(stateQA,10,10).eq(0)
                var cloudMask2 = bitwiseExtract(stateQA,0,1).eq(0)
                var cloudShadowMask = bitwiseExtract(stateQA,2,2).eq(0)
                var cirrusMask = bitwiseExtract(stateQA,8,9).eq(0)
                return image.clip(roi).updateMask(cloudMask2.and(cloudShadowMask).updateMask(cirrusMask));
                          })
                          .map(function(image){
                                var blue = image.select("sur_refl_b03").divide(10000);
                                var nir = image.select("sur_refl_b02").divide(10000);
                                var ndsi = image.normalizedDifference(["sur_refl_b04","sur_refl_b06"]);
                                image = image.addBands(image.addBands(ndsi).select("nd").rename(["ndsi"]));
                                var msk1 = blue.lt(0.2)
                                var msk2 = ndsi.lte(0.4)
                                var msk3 = nir.lte(0.11)
                                var msk = msk2.or(msk3)
                                msk = msk1.and(msk)
                                image = image.updateMask(msk)
                                return image
                          });  
  
    
    collection2 = collection2.map(function(image){
              var lswi = image.normalizedDifference(["sur_refl_b02","sur_refl_b06"]).rename("lswi");
              var ndvi = image.normalizedDifference(["sur_refl_b02","sur_refl_b01"]).rename("ndvi");
              var evi = image.expression(
                '2.5 *(NIR - Red)/(NIR + 6* Red - 7.5*Blue + 1)',
        {
          Red: image.select('sur_refl_b01').divide(10000),
          NIR: image.select('sur_refl_b02').divide(10000),
          Blue: image.select('sur_refl_b03').divide(10000)
          }).rename("evi");
              var img = image.addBands(lswi)
              img = img.addBands(ndvi)
              img = img.addBands(evi)
              return img;
    });
    
    
    var lswi = collection2.select("lswi")
    var evi = collection2.select("evi")  
    //LST(℃)= value*0.02-273.15
    var LST = MOD11A2.map(function(image){
            var qc = image.select("QC_Night")
            var mask = bitwiseExtract(qc,6,7).eq(0).or(bitwiseExtract(qc,6,7).eq(1))
            return image.updateMask(mask)
    }).filterDate(starttime,endtime)
                .select("LST_Night_1km").map(function(image){
                var image2 = image.multiply(0.02).subtract(273.15);
                image2 = image2.copyProperties(image, ['system:time_start'])
                return ee.Image(image2).clip(roi);
    });  
    // var test_p = ee.Geometry.Point([55.016,45.7835])
    var test_p_barren = ee.Geometry.Point([55.0091,45.7618])
    var test_p_grass = ee.Geometry.Point([61.7712,45.7762])
    var test_p_grass1 = ee.Geometry.Point([73.305316,49.345293])
    var test_p_barren = ee.Geometry.Point([64.643772,43.100062])
    Map.addLayer(test_p_barren)
    // Map.centerObject(test_p)
    Map.addLayer(collection2.filterDate("2019-01-01","2020-01-01").select(["lswi"]).reduce(ee.Reducer.minMax()).select("lswi_max").lt(0))
    print(collection2.select(["lswi","evi","ndvi"]))
    Map.addLayer(collection2.filterDate("2018-01-01","2021-01-01").select(["lswi","evi","ndvi"]))
    Map.addLayer(LST.filterDate("2018-01-01","2021-01-01").select("LST_Night_1km"))
    var evi = linearinterp(evi).map(function(image){
     return adddoy(image)})
    var lswi = lswi.map(function(image){
     return adddoy(image)})  
    var LST = linearinterp(LST)
    // var dict_1 = ee.Dictionary(dosTGS(LST.filterDate("2019-01-01","2020-01-01")));
    // var dict_2 = ee.Dictionary(dosTGS(LST.filterDate("2019-01-01","2020-01-01").sort("system:index",false)));
    // var sos = ee.Image(dict_1.get("img2"));
    // var eos = ee.Image(dict_2.get("img2")); 
    // Map.addLayer(sos)
    // Map.addLayer(eos)
    
    var LAND = ee.ImageCollection(ee.List.sequence(0,yearNum-1).map(function(i){
      var starttime1 = starttime.advance(i,"year")
      var endtime1 = starttime.advance(ee.Number(i).add(1),"year")
      var dict1 = ee.Dictionary(dosTGS(LST.filterDate(starttime1,endtime1)));
      var dict2 = ee.Dictionary(dosTGS(LST.filterDate(starttime1,endtime1).sort("system:index",false)));
      var sos1 = ee.Image(dict1.get("img2"));
      var eos1 = ee.Image(dict2.get("img2")); 
      var lswi1 = lswi.filterDate(starttime1,endtime1)
      var evi1 = evi.filterDate(starttime1,endtime1)
      var msk1 = mask1(lswi1,sos1,eos1)
      var msk2 = mask2(evi1,sos1,eos1)
      var finalMsk1 = msk1.and(msk2)
      return ee.Image(finalMsk1).clip(roi).set("year",starttime1.format("YYYY"))
      
    }))
    var count = LAND.count()
    var sum = LAND.sum()
    var inteMask = ee.Image(0).where(count.eq(sum),1).clip(roi)
    // Map.addLayer(lswi)
    // Map.addLayer(evi)
    // Map.addLayer(LST)
    // Map.addLayer(LAND)
    // Map.addLayer(inteMask)
    // Map.addLayer(ee.Image("users/zhaoyanbo0712/image/MCD12Q1_2001").select("Land_Cover_Type_1").clip(roi))
    var igbp = ee.Image("users/zhaoyanbo0712/image/MODIS06_MCD12Q1_CA").clip(roi)
    igbp = igbp.eq(10).or(igbp.eq(16))
    var count2 = igbp.reduce(ee.Reducer.count())
    var sum2 = igbp.reduce(ee.Reducer.sum())
    var basemap = ee.Image(0).where(count2.eq(sum2),1).clip(roi)
    //Map.addLayer(basemap)
    var target_area = basemap.and(inteMask)
    //Map.addLayer(target_area)
    
    
    
    
    var SDEVI = ee.ImageCollection(ee.List.sequence(0,yearNum-1).map(function(year){
      var starttime1 = starttime.advance(year,"year")
      var endtime1 = starttime.advance(ee.Number(year).add(1),"year")
      var dict1 = ee.Dictionary(dosTGS(LST.filterDate(starttime1,endtime1)));
      var dict2 = ee.Dictionary(dosTGS(LST.filterDate(starttime1,endtime1).sort("system:index",false)));
      var sos1 = ee.Image(dict1.get("img2"));
      var eos1 = ee.Image(dict2.get("img2")); 
      var evi1 = evi.filterDate(starttime1,endtime1);
      var sdevi = sdEviTgs(evi1,sos1,eos1)
      return ee.Image(sdevi)
    }))
    
    
    var EVITGS = ee.ImageCollection(ee.List.sequence(0,yearNum-1).map(function(year){
      var starttime1 = starttime.advance(year,"year")
      var endtime1 = starttime.advance(ee.Number(year).add(1),"year")
      var dict1 = ee.Dictionary(dosTGS(LST.filterDate(starttime1,endtime1)));
      var dict2 = ee.Dictionary(dosTGS(LST.filterDate(starttime1,endtime1).sort("system:index",false)));
      var sos1 = ee.Image(dict1.get("img2"));
      var eos1 = ee.Image(dict2.get("img2")); 
      var evi1 = evi.filterDate(starttime1,endtime1);
      var evitgs = eviTgs(evi1,sos1,eos1)
      return ee.Image(evitgs)
    }))
    //Map.addLayer(SDEVI)
    // EVITGS = EVITGS.first().rename("evitgs_2000")
    // Export.image.toAsset({
    //   image:EVITGS,
    //   description:"2000-2020_evi",
    //   region:roi,
    //   crs:"EPSG:4326",
    //   assetId:"image/evi_annualTGS_2000_CA",
    //   maxPixels:1e13,
    //   scale:500
    // })
    
    
    
    
    
  }
  
  /*
    functions used in this code
  */
  
  function bitwiseExtract(input, fromBit, toBit) {
    var maskSize = ee.Number(1).add(toBit).subtract(fromBit)
    var mask = ee.Number(1).leftShift(maskSize).subtract(1)
    return input.rightShift(fromBit).bitwiseAnd(mask)
  }
  
  function adddoy(image){
     var image_date = ee.Date(image.date());
     var image_doy = ee.Number.parse(image_date.format('D'));
     return image.addBands(ee.Image(image_doy).rename('doy').toInt())  
  }
  
  //time based linear interpolate 
  function linearinterp(IC) {
    IC = IC.map(addtimeband);
    var startdate = ee.Date(IC.first().get('system:time_start'));
    var enddate = ee.Date(IC.sort('system:time_start',false).first().get('system:time_start'));
    return ee.ImageCollection(IC.map(function(img) {
            img = ee.Image(img);
            var date = img.date();
            var before = IC.filterDate(startdate, date.advance(1, 'minute')).sort('system:time_start', true).mosaic();
            var after  = IC.filterDate(date.advance(-1, 'minute'),enddate.advance(1, 'minute')).sort('system:time_start', false).mosaic();
  // constrain after or before no NA values, confirm linear Interp having result
            before = before.unmask(after);
            after  = after.unmask(before);
          // Compute the ratio between the image times.
            var x1 = before.select('time').double();
            var x2 = after.select('time').double();
            var now = img.metadata('system:time_start').double();
            var ratio = x1.subtract(now).divide(x1.subtract(x2));  // this is zero anywhere x1 = x2
            // // Compute the interpolated image.
            before = before.select(0); //remove time band now;
            after  = after.select(0);
            img    = img.select(0); 
            var interp = after.subtract(before).multiply(ratio).add(before);
            return img.unmask(interp).copyProperties(img, ['system:time_start']);
    }));
  }
  
  function addtimeband(img) {
      // make sure mask is consistent 
      return img.addBands(img.metadata('system:time_start').rename("time").mask(img.mask()));
  }
  
  //the first day of annual thermal growing season
  //IC:one year's imagecollection (ordinal/reversal)
  function dosTGS(IC){
      var iniImg = IC.first().multiply(0).add(1).rename("LST_Night_1km");
      iniImg = iniImg.addBands(IC.first().multiply(0).rename("dos"))
          .addBands(IC.first().multiply(0).rename("constant"))
          .addBands(IC.first().multiply(0).rename("doy"));
      var dosImg = IC.first().multiply(0).rename("dos");
      IC = IC.map(function(image){
          var image_date = ee.Date(image.date());
          var image_doy = ee.Number.parse(image_date.format('D'));
          image = image.addBands(ee.Image(ee.Number(0)).multiply(0).rename("dos"));
          image = image.addBands(ee.Image(ee.Number(0)).multiply(0).rename("constant"));
          return image.addBands(ee.Image(image_doy).rename('doy'));
      });
      var VIList_num = IC.size();
      var VIList = IC.toList(VIList_num);
      var iniDict = ee.Dictionary({
          img1:iniImg,
          img2:dosImg,
      });
  
      var Dp = ee.Dictionary(VIList.iterate(findDos2,iniDict));
      return Dp;
  
      function findDos2(image,dict){
          image = ee.Image(image);
          dict = ee.Dictionary(dict);
          var current_constant = image.select("constant")
          var current_dos = image.select("dos")
          var current_doy = image.select("doy")
          var current_LST = image.select("LST_Night_1km")
          var last_constant = ee.Image(dict.get("img1")).select("constant")
          var last_dos = ee.Image(dict.get("img1")).select("dos")
  
          current_dos = current_dos.where(last_constant.gte(3),last_dos)
          current_constant = current_constant.where(last_constant.gte(3),last_constant)
          current_constant = current_constant.where(last_constant.lt(3).and(current_LST.gt(0)),last_constant.add(1))
          current_constant = current_constant.where(last_constant.lt(3).and(current_LST.lte(0)),0)
          current_dos = current_dos.where(last_constant.lt(3).and(current_LST.lte(0)),last_dos)
          current_dos = current_dos.where(last_constant.lt(3).and(current_LST.gt(0)).and(current_constant.eq(1)),current_doy)
          current_dos = current_dos.where(last_constant.lt(3).and(current_LST.gt(0)).and(current_constant.gt(1)),last_dos)
  
          var image1 = current_LST.addBands(current_constant).addBands(current_dos).addBands(current_doy)
          var image2 = current_dos
          return ee.Dictionary({
              img1:image1,
              img2:image2
          });
      }
  }
  
  function mask1(IC,sos,eos){
    IC = IC.map(function(image){
      //a mask(1/0) represents the image where the doy is between sos and eos
      var mask = image.select("doy").where(image.select("doy").lt(sos),0);
      mask = mask.where(image.select("doy").gt(eos),0)
      mask = mask.where(mask.select("doy").neq(0),1);
      var img = image.select("lswi").updateMask(mask);
      image = image.addBands(img.rename("lswitgs"))
      return image;
    })
    var LSWI = IC.select("lswitgs").map(function(image){
      var count = image.where(image.gt(0),1);
      count = count.where(count.neq(1),0);
      var img = image.addBands(count.rename("count"))
      return img;
    })
    var mask = LSWI.select("count").reduce(ee.Reducer.sum());
    mask = mask.where(mask.select("count_sum").lt(10),1);
    mask = mask.where(mask.select("count_sum").gte(10),0);
    return mask
  }
  
  //calculate the mask of water body
  function mask2(IC,sos,eos){
    IC = IC.map(function(image){
      //a mask(1/0) represents the image where the doy is between sos and eos
      var mask = image.select("doy").where(image.select("doy").lt(sos),0);
      mask = mask.where(image.select("doy").gt(eos),0)
      mask = mask.where(mask.select("doy").neq(0),1);
      var img = image.select("evi").updateMask(mask);
      image = image.addBands(img.rename("evitgs"))
      return image;
    })
    var maxEVI = IC.select("evitgs").reduce(ee.Reducer.minMax()).select("evitgs_max")
    maxEVI = maxEVI.where(maxEVI.lte(0),0);
    maxEVI = maxEVI.where(maxEVI.neq(0),1);
    return maxEVI;
  }
  
  //calculate the maximum of evi in TGS
  function maxevi(IC,sos,eos){
    IC = IC.map(function(image){
      //a mask(1/0) represents the image where the doy is between sos and eos
      var mask = image.select("doy").where(image.select("doy").lt(sos),0);
      mask = mask.where(image.select("doy").gt(eos),0)
      mask = mask.where(mask.select("doy").neq(0),1);
      var img = image.select("evi").updateMask(mask);
      image = image.addBands(img.rename("evitgs"))
      return image;
    })
    var maxEVI = IC.select("evitgs").reduce(ee.Reducer.minMax()).select("evitgs_max")
    return maxEVI;
  }
  
  //calculate the count of lswi>=10 in TGS
  function lswitgs(IC,sos,eos){
    IC = IC.map(function(image){
      //a mask(1/0) represents the image where the doy is between sos and eos
      var mask = image.select("doy").where(image.select("doy").lt(sos),0);
      mask = mask.where(image.select("doy").gt(eos),0)
      mask = mask.where(mask.select("doy").neq(0),1);
      var img = image.select("lswi").updateMask(mask);
      image = image.addBands(img.rename("lswitgs"))
      return image;
    })
    var LSWI = IC.select("lswitgs").map(function(image){
      var count = image.where(image.gt(0),1);
      count = count.where(count.neq(1),0);
      var img = image.addBands(count.rename("count"))
      return img;
    })
    var count = LSWI.select("count").reduce(ee.Reducer.sum());
    return count;
  }
  
  //calculate the EVI or LSWI in the TGS of one year
  //IC includes at least two bands(evi,doy),sos、eos of this year 
  function eviTgs(IC,sos,eos){
    IC = IC.map(function(image){
      //a mask(1/0) represents the image where the doy is between sos and eos
      var mask = image.select("doy").where(image.select("doy").lt(sos),0);
      mask = mask.where(image.select("doy").gt(eos),0)
      mask = mask.where(mask.select("doy").neq(0),1);
      var img = image.select("evi").updateMask(mask);
      image = image.addBands(img.rename("evitgs"))
      return image;
    })
    return IC.select("evitgs").reduce(ee.Reducer.mean());
  }
  
  function sdEviTgs(IC,sos,eos){
    IC = IC.map(function(image){
      //a mask(1/0) represents the image where the doy is between sos and eos
      var mask = image.select("doy").where(image.select("doy").lt(sos),0);
      mask = mask.where(image.select("doy").gt(eos),0)
      mask = mask.where(mask.select("doy").neq(0),1);
      var img = image.select("evi").updateMask(mask);
      image = image.addBands(img.rename("evitgs"))
      return image;
    })
    return IC.select("evitgs").reduce(ee.Reducer.stdDev());
  }
  
  //mean temprature monthly
  function meanTmp(IC){
       var monthList = ee.List.sequence(1,12)
       var meanTmp = monthList.map(function(month){
          var tmmx = IC.filter(ee.Filter.calendarRange(month,month,"month")).select("tmmx").first().multiply(0.1).add(273.15)
          var tmmn = IC.filter(ee.Filter.calendarRange(month,month,"month")).select("tmmn").first().multiply(0.1).add(273.15)
          var mean = tmmx.multiply(tmmn)
          return mean.sqrt().subtract(273.15)
       })
       return meanTmp
  }
  
  function getBounds(Ft){
    var geo = ee.Feature(Ft).geometry()
    var bound = geo.bounds()
    return ee.FeatureCollection(bound)
  }