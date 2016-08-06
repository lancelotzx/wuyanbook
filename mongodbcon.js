//连接db,以匿名函数作为module接口，自己实现
module.exports.dbcon = function(db){

db.open(function(err, db){
    
    if(!err){
        console.log('connect db');
 
        db.createCollection('mycoll', {safe:true}, function(err, collection){
            if(err){
                console.log(err);
            }else{
                //新增数据
                // var tmp1 = {id:'1',title:'hello',number:1};
       //          collection.insert(tmp1,{safe:true},function(err, result){
       //              console.log(result);
       //          }); 
                   //更新数据
                   // collection.update({title:'hello'}, {$set:{number:3}}, {safe:true}, function(err, result){
                   //     console.log(result);
                   // });
                   // 删除数据
                       // collection.remove({title:'hello'},{safe:true},function(err,result){
        //                   console.log(result);
        //               });

                // console.log(collection);
                // 查询数据
                var tmp1 = {title:'hello'};
                   var tmp2 = {title:'world'};
                   collection.insert([tmp1,tmp2],{safe:true},function(err,result){
                   console.log(result);
                   }); 
                   collection.find().toArray(function(err,docs){
                   console.log('find');
                   console.log(docs);
                   }); 
                   collection.findOne(function(err,doc){
                    console.log('findOne');
                      console.log(doc);
                   }); 
            }

        });
        // console.log('delete ...');
        // //删除Collection
        // db.dropCollection('mycoll',{safe:true},function(err,result){

  //           if(err){
                
        //         console.log('err:');
        //         console.log(err);
        //     }else{
        //         console.log('ok:');
        //         console.log(result);
        //     }
  //       }); 
    }else{
        console.log(err);
    }
});
}
