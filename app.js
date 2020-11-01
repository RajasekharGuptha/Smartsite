const express = require("express");
const app=express();
const https=require("https");
const bodyParser=require("body-parser")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var formidable = require('formidable');

const ejs = require("ejs");
app.use(express.static("public"));
const fileupload=require("express-fileupload")
const fs=require("fs")
const router=express.Router();
const md5=require("md5")
const multer=require("multer")
const mongoose=require("mongoose");
const { Schema } = mongoose;
var k=0;
//mongoose.connect("mongodb://localhost:27017/smartDB",{ useNewUrlParser:true })
mongoose.connect("mongodb+srv://admin-RosMani:rosmani@cluster0.jm46e.mongodb.net/smartDB?retryWrites=true&w=majority",{ useNewUrlParser:true })
app.set('view engine', 'ejs');
app.listen(3000,function(){
    console.log("hi")
});

const workSchema=new Schema({
    desig1:String,
    ename1:String,
    workdone1:String,
    desig2:String,
    ename2:String,
    workdone2:String,
    desig3:String,
    ename3:String,
    workdone3:String,
    desig4:String,
    ename4:String,
    workdone4:String

})
const timeSchema=new Schema({
    phase1:String,
    perc1:Number,
    phase2:String,
    perc2:Number,
    phase3:String,
    perc3:Number,
    phase4:String,
    perc4:Number,   
})
const CostSchema=new Schema({
    p1:String,
    n1:Number,
    c1:Number,
  
    p2:String,
    n2:Number,
    c2:Number,
  
    p3:String,
    n3:Number,
    c3:Number,
    p4:String,
    n4:Number,
    c4:Number
  
  })
const userSchema=new Schema({
    name:String,
    email:String,
    phone:Number,
    password:String,
    desig:String,
    details:String,
    project:String,
    typeofwork:String,
    pdesc:String,
    mdays:Number,
    area:Number,
    location:String,
    progress:Number,
    assigned:{type: Number, default: '0'},
    constr:String,
    cost:Number,
    days:Number,
    path:String,
    work:[workSchema],
    time:[timeSchema],
    costd:[CostSchema]
})


// app.use(multer({ dest: ‘./uploads/’,
//     rename: function (fieldname, filename) {
//       return filename;
//     },
//    }));

// const custSchema=new mongoose.Schema({
//     project:String,
//     area:String
// })
const User=mongoose.model("User",userSchema);
 const Time=mongoose.model("Time",timeSchema);
 const Work=mongoose.model("Work",workSchema);

 const Cost=mongoose    .model("Cost",CostSchema);
app.get('/',function(req,res){
    res.render("navbar")
         });
app.get('/login',function(req,res){
        res.sendFile(__dirname+"/login.html")
         });
         app.get('/register',function(req,res){
            res.sendFile(__dirname+"/register.html")
             });

app.post("/register",function(req,res){
console.log(req.body.desig);
const newUser=new User({
    name:req.body.name,
    email:req.body.email,
    password:md5(req.body.pwd),
    desig:req.body.desig,
    project:" ",
    area:" ",
    progress:0,
    constr:" ",
    days:0,
    projects:0

})
newUser.save(function(err){
    if(err){
        console.log(err)
    }
    else{
        res.sendFile(__dirname+"/login.html")
    }
});
})
app.get("/job",function(req,res){
    res.sendFile(__dirname+"/job.html")
    
})
app.post("/login",function(req,res){
    const emailo=req.body.user;
    const passwordo=md5(req.body.pwd);
    User.findOne({email:emailo},function(err,foundone){
        if(!err){
            console.log(foundone.password)
            console.log(passwordo)
            
            if(foundone.password==passwordo){
            if(foundone.desig==="Customer"){
                if(foundone.constr===" ")
       {         res.render("cust",{obj:foundone,constr:null})
       }
       else{
       User.findOne({name:foundone.constr},function(err,found){
        res.render("cust",{obj:foundone,constr:found})
           
       })
           
       }
            }
            else{
                const nameo=foundone;
                User.find(function(err,users){
                    if(!err){
                        User.findOne({constr:nameo.name},function(err,fou){
                            if(foundone.assigned===0){
                                res.render("const",{user:users,obj:nameo,client:null});
                            }
                           
                        else{
                            res.render("const",{user:users,obj:nameo,client:fou});
                            }
                       
                        })
} 
                       
                })
                
            }}
            
        }
    })

})
app.get("/proj",function(req,res){
    User.find(function(err,users){
        if(!err){
            res.render("proj",{user:users});
}
else{
    console.log("error");
}
    })

})    
app.post("/job",function(req,res){
    const nameo=req.body.name;
    const proj=req.body.proj;
    const locationo=req.body.location;
    const areao=req.body.area;
    const work=req.body.work;
    const projd=req.body.projd;
    const costo=req.body.cost;
    const mdayso=req.body.mdays;
    
    console.log(req.body.proj)
    console.log(req.body.area)
    console.log(nameo)
    User.updateOne({name:nameo},{project:proj,area:areao,typeofwork:work,pdesc:projd,mdays:mdayso,location:locationo,costo:cost},function(err){
        if(err){
            console.log(err)
        }
        else{
             User.findOne({name:nameo},function(err,found){
             res.render("cust",{obj:found,constr:null})
         })
        }
    })
})

app.get("/desc",function(req,res){
    res.sendFile(__dirname+"/desc.html")
})
app.get("/prog",function(req,res){
    res.sendFile(__dirname+"/prog.html")
})
app.post("/prog",function(req,res){
    const perc=req.body.percent;
    const pname=req.body.pname;
    const nameo=req.body.name;
    const desc=req.body.desc;
    console.log(req.body.percent)
    User.updateOne({project:pname},{progress:perc},function(err){
        if(err){
            console.log(err)
        }
        else{
            User.find(function(err,users){
                if(!err){
                    User.updateOne({name:nameo},{pdesc:desc},function(err){
                        if(!err){
                    User.findOne({project:pname},function(err,fou){
                        User.findOne({name:nameo},function(err,fou1){
             
                        res.render("const",{user:users,obj:fou1,client:fou});
                })
            })
            
            }
            })
    }
                
})
        }
})
})
app.post("/desc",function(req,res){
const proj=req.body.proj;
const nameo=req.body.name;
const dayso=req.body.days;
const costo=req.body.cost;
console.log(proj);
console.log(nameo);
console.log(dayso);
console.log(costo);
User.updateOne({project:proj},{constr:nameo,assigned:"1"},function(err){
    if(err){
        console.log(err)
    }
    else{
        User.find(function(err,users){
            if(!err){
                 User.updateOne({name:nameo},{project:proj,mdays:dayso,cost:costo,assigned:"1"},function(err){
                    if(!err){
                        User.findOne({project:proj},function(err,found){
                            User.findOne({name:nameo},function(err,fou){
                     
                            res.render("const",{user:users,obj:fou,client:found});
                    })
                })

                    }
                })
            }
        })
    }
})
})

app.get("/nav",function(req,res){
    res.render("navbar")
})


app.get("/work",function(req,res){
    res.sendFile(__dirname+"/work.html")
})

app.post("/work",function(req,res){
    const nameo=req.body.name;
    const proj=req.body.proj;
    const emp1=req.body.lname1;
    const des1=req.body.dname1;
    const w1=req.body.wname1;
    const emp2=req.body.lname2;
    const des2=req.body.dname2;
    const w2=req.body.wname2;
    const emp3=req.body.lname3;
    const des3=req.body.dname3;
    const w3=req.body.wname3;
    const emp4=req.body.lname4;
    const des4=req.body.dname4;
    const w4=req.body.wname4;
    const work1=new Work({ename1:emp1,desig1:des1,workdone1:w1,ename2:emp2,desig2:des2,workdone2:w2,ename3:emp3,desig3:des3,workdone3:w3,ename4:emp4,desig4:des4,workdone4:w4})
    work1.save();
    User.updateOne({name:nameo},{work:work1},function(err){
        if(!err){
            User.find(function(err,users){
                if(!err){
                            User.findOne({project:proj},function(err,found){
                                User.findOne({name:nameo},function(err,fou){
                         
                                res.render("const",{user:users,obj:fou,client:found});
                        })
                    })
                }
            })
                
        }
    })
})

app.get("/pay",function(req,res){
    res.sendFile(__dirname+"/payment.html")
})
app.get("/lab",function(req,res){
    res.render("lab")
})
app.post("/labor",function(req,res){
    const nameo=req.body.name;
    const proj=req.body.proj;
    const pname1=req.body.pname1;
    const percen1=req.body.percent1;
    const pname2=req.body.pname2;
    const percen2=req.body.percent2;
    const pname3=req.body.pname3;
    const percen3=req.body.percent3;
    const pname4=req.body.pname4;
    const percen4=req.body.percent4;
    const time1=new Time({
        phase1:pname1,
        perc1:percen1,
        phase2:pname2,
        perc2:percen2,
        phase3:pname3,
        perc3:percen3,
        phase4:pname4,
        perc4:percen4
    })
    time1.save();
    User.updateOne({name:nameo},{time:time1},function(err){
        if(!err){
            User.find(function(err,users){
                if(!err){
                            User.findOne({project:proj},function(err,found){
                                User.findOne({name:nameo},function(err,fou){
                         
                                res.render("const",{user:users,obj:fou,client:found});
                        })
                    })
                }
            })
                
        }
    })

})


app.get("/cost", function(req, res){
   
    res.sendFile(__dirname + '/cost.html')
  });


  app.post("/cost",function(req,res){
    const nameo=req.body.name;
    const pname=req.body.pname;
    const p1o=req.body.p1
    const q1o=req.body.q1name
    const c1o=req.body.c1name
 
    const p2o=req.body.p2
    const q2o=req.body.q2name
    const c2o=req.body.c2name
 
    const p3o=req.body.p3
    const q3o=req.body.q3name
    const c3o=req.body.c3name
 
    const p4o=req.body.p4
    const q4o=req.body.q4name
    const c4o=req.body.c4name
 
  const item1=new Cost({
    p1:p1o,
    n1:q1o,
    c1:c1o,
 
    p2:p2o,
    n2:q2o,
    c2:c2o,
 
    p3:p3o,
    n3:q3o,
    c3:c3o,
 
    p4:p4o,
    n4:q4o,
    c4:c4o
 
    
    
  })
 
  item1.save();
 User.updateOne({name:nameo},{costd:item1},function(err){
     if(!err){
        User.find(function(err,users){
            if(!err){
                        User.findOne({project:pname},function(err,found){
                            User.findOne({name:nameo},function(err,fou){
                     
                            res.render("const",{user:users,obj:fou,client:found});
                    })
                })
            }
        })
     
     }
 })



})  

app.get("/photo",function(req,res){
    res.sendFile(__dirname+"/photo.html")
})

app.post("/photo",function(req,res){
    const nameo=req.body.name;
    const proj=req.body.pname;
    const form = formidable({ multiples: true });
    
    //var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
          next(err);
          return;
        }
        res.json({ fields });
    console.log(fields)
});
    }); 
    
    
    
    
    
    
    
    
    
    
    
    
    // var form = new formidable.IncomingForm();
    const form = formidable({ multiples: true });
    //  form.parse(req);
    // // form.parse(req, (err, fields, files) => {
    //     if (err) {
    //       next(err);
    //       return;
    //     }
    //     res.json({ fields });
    //     console.log(fields);
    //   });
    // });
    
      // form.on('fileBegin', function (name, file){
        //     file.path = __dirname + '/uploads/' + file.name;
        //     User.updateOne({name:fields.name},{constr:patho},function(err){
        //         if(!err){
        //             console.log("Success")
        //         }
        //     })
        // });
        // form.on('file', function (name, file){
        //     console.log('Uploaded ' + file.name);
        // });
        
    // form.on('fileBegin', function (name, file){
    //     file.path = __dirname + '/uploads/' + file.name;
    // });

//     console.log('name')

// console.log(req.body.name)
    // User.find(function(err,users){
    //     if(!err){
    //                 User.findOne({project:proj},function(err,found){
    //                     User.findOne({name:nameo},function(err,fou){
                 
    //                     res.render("const",{user:users,obj:fou,client:found});
    //             })
    //         })
    //     }
    // })
    
    



// const nameo=req.body.name;
// const proj=req.body.pname;

// var form = new formidable.IncomingForm();

// form.parse(req);

// form.on('fileBegin', function (name, file){

//     file.path = __dirname + '/public/images/' + file.name;
//     const patho='/public/images/' + file.name;
//     User.updateOne({name:nameo},{constr:patho},function(err){
//         if(!err){
//             console.log("Success")
//         }
//     })
// });

// form.on('file', function (name, file){
//     console.log('Uploaded ' + file.name);
// });

//     User.find(function(err,users){
//         if(!err){
//                     User.findOne({project:proj},function(err,found){
//                         User.findOne({name:nameo},function(err,fou){
                 
//                         res.render("const",{user:users,obj:fou,client:found});
//                 })
//             })
//         }
//     })


















//app.get('/',function(req,res){
    //       res.sendFile(__dirname+"/weather.html")
    //         });
    
    // app.post("/",function(req,res){
    //     console.log(req.body.lname)
    //     const city=req.body.lname;
    //     const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=f5187572cfce6b84ec17a78db252f4fb&units=metric"
    //     https.get(url,function(response){
    //         response.on("data",function(data){
    //             const weatherd=JSON.parse(data)
    //             const temp=weatherd.main.temp;
    //             const desc = weatherd.weather[0].description;
    //             console.log(temp,desc)
    //             res.write("<h1>The Temperature here is "+temp+"</h1>")
    //             res.write("<h1>The weather here is "+desc+"</h1>")
    //             res.send()
    // });
    //     });
    
    // });    
    