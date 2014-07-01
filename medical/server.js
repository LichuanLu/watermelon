//template can be refer to https://github.com/chovy/express-template-demo/blob/master/demo/app.js
//var gaModel = require('./models/generalAdminModel');
//console.log("load models"+gaModel);
"use strict";
var template_engine = 'dust',
  domain = 'localhost';
var express = require('express'),
  http = require('http'),
  path = require('path');
var fs = require('fs');
//var engines = require('consolidate');
//var dust = require('express-dust-linkedin');

var app = module.exports = express();


//var dust = require('dustjs-linkedin'), cons = require('consolidate');

//app.engine('dust',cons.dust);
if (template_engine == 'dust') {
  var dust = require('dustjs-linkedin'),
    cons = require('consolidate');

  app.engine('dust', cons.dust);

} else if (template_engine == 'ejs') {
  app.engine('ejs', engine);
} else if (template_engine == 'swig') {
  var swig = require('swig'),
    cons = require('consolidate');

  app.engine('swig', cons.swig);
  //app.set('view engine', 'html');
}



app.configure(function() {
  // body...
  //app.set('template_engine','dust');
  app.set('template_engine', template_engine);
  app.set('domain', domain);
  app.set('port', 3333);

  //app.use(express.static(__dirname + '/'));

  // app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/server_template');
  app.set('view engine', template_engine);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  //app.use(express.cookieParser('wigglybits'));
  //app.use(express.session({ secret: 'whatever', store: store }));
  //app.use(express.session());
  //app.use(app.router);
  //app.use(require('less-middleware')({ src: __dirname + '/public' }));
  //app.use(express.static(path.join(__dirname, 'static/')));
  app.use(express.static(path.join(__dirname, '/')));

  app.get('/homepage', function(req, res) {
    res.render('home', {
      isSearch: 'true'
    });
  });

  app.get('/applyDiagnose', function(req, res) {
    res.render('applyDiagnose',{
      edit:true
    });
  });

  app.get('/register/patient', function(req, res) {
    res.render('patientRegister');
  });


  app.get('/register/doctor', function(req, res) {
    res.render('doctorRegister');
  });

  app.get('/doctorhome', function(req, res) {
    res.render('doctorHome');
  });


  app.get('/patienthome', function(req, res) {
    res.render('patientHome', {});
  });

  app.get('/report/preview', function(req, res) {
    res.render('previewDiagnoseReport', {});
  });
  app.get('/doctor/list', function(req, res) {
    res.render('doctorList', {});
  });
  app.get('/doctor/site', function(req, res) {
    res.render('doctorSite', {});
  });
  app.get('/admin/fenzhen', function(req, res) {
    res.render('adminFenzhen', {});
  });
  app.get('/admin/kefu', function(req, res) {
    res.render('adminKefu', {});
  });
  app.get('/help/doc', function(req, res) {
    res.render('helpdoc', {});
  });

  app.get('/login', function(req, res) {
    res.render('loginPage', {});
  });
   app.get('/hospital/user', function(req, res) {
    res.render('hospitalUser', {});
  });

  app.get('/error/404', function(req, res) {
    res.render('errorpage', {});
  });
  app.get('/help/center', function(req, res) {
    res.render('helpcenter', {});
  });


  app.configure('development', function() {
    app.use(express.errorHandler());
  });

  app.get('/diagnose/list', function(req, res) {
    console.log(req.query.type);
    if(req.query.type == ""){
      var data = [{
        id: 1,
        diagnosenumber: '35423',
        doctorName: '张名',
        patientName: "李冰",
        date: "2014-10-29",
        section: "头部，颈部",
        status: "待审核",
        statusId: "5"

      },{
         id: 2,
        diagnosenumber: '35443',
        doctorName: '张名1',
        patientName: "李冰1",
        date: "2014-11-29",
        section: "头部，颈部，胸部",
        status: "诊断完成",
        statusId: "6",
        isFeedback:false

      },
      {
        id: 3,
        diagnosenumber: '35443',
        doctorName: '张名1',
        patientName: "李冰1",
        date: "2014-11-29",
        section: "头部，颈部，胸部",
        status: "诊断完成",
        statusId: "0"

      }]
    }else{
       var data = [{
        id: 1,
        diagnosenumber: '35423',
        doctorName: '张名',
        patientName: "李冰",
        date: "2014-10-29",
        section: "头部，颈部",
        status: "待审核",
        statusId: "5"
      }, {
        id: 2,
        diagnosenumber: '35443',
        doctorName: '张名1',
        patientName: "李冰1",
        date: "2014-11-29",
        section: "头部，颈部，胸部",
        status: "诊断完成",
        statusId: "6"
      }, {
        id: 3,
        diagnosenumber: '35413',
        doctorName: '张名2',
        patientName: "李冰2",
        date: "2013-10-29",
        section: "颈部",
        status: "待诊断",
        statusId: "4"
      }, {
        id: 4,
        diagnosenumber: '35413',
        doctorName: '张名2',
        patientName: "李冰2",
        date: "2013-10-29",
        section: "颈部",
        status: "需要更新",
        statusId: "7"
      }

    ];

    }
   
    res.send({
      status: 0,
      msg: "",
      data: data
    });
  });



  app.post('/register/patient.json', function(req, res) {
    console.log(req.body);
    var result = {
      status: 0,
      msg: "success"
    };
    res.send(result);

  });

  app.post('/register/doctor.json', function(req, res) {
    console.log(req.body);
    var result = {
      status: 0,
      msg: "success"
    };
    res.send(result);

  });
  app.post('/login.json', function(req, res) {
    console.log(req.body);
    var result = {
      status: 0,
      msg: "success"
    };
    res.send(result);

  });
  app.post('/save/diagnose/:formid', function(req, res) {
    console.log(req.params.formid);
    var formid = req.params.formid;
    var result;
    if (formid == 1) {
      result = {
        status: 0,
        msg: "success",
        data: {
          formId: 2
        }
      };
    } else if (formid == 2) {
      result = {
        status: 0,
        msg: "success",
        data: {
          formId: 3
        }
      };
    } else if (formid == 3) {
      result = {
        status: 0,
        msg: "success",
        data: {
          formId: 4
        }
      };
    } else {
      result = {
        status: 0,
        msg: "success",
        data: {
          isFinal:true
        }
      };
    }


    res.send(result);
  });

  app.get('/doctors/list.json', function(req, res) {
    console.dir(req.query);


    var data;
    if (req.query.hospitalId == 1) {
      console.log("test");
      data = {
        pageNumber: 3,
        currentPage: 1,
        doctor: [{
          id: 1,
          doctorname: '张22名',
          doctortitle: "副主22任医师",
          hospitalname: "西22安西京医院",
          skill: "头部，22颈部",
          diagnoseNumber: "12212",
          goodFeedbackNumber: "12200",
          avatarUrl: "/static/assets/image/9-small.jpg"
        }]

      };
    } else {
      data = {
        pageNumber: 6,
        currentPage: 3,
        doctor: [{
            id: 1,
            doctorname: '张名',
            doctortitle: "副主任医师",
            hospitalname: "西安西京医院",
            skill: "头部，颈部",
            diagnoseNumber: "112",
            goodFeedbackNumber: "100",
            avatarUrl: "/static/assets/image/9-small.jpg"
          }, {
            id: 2,
            doctorname: '张名1',
            doctortitle: "副主任医师1",
            hospitalname: "西安西京医院1",
            skill: "头部，颈部，胸部",
            diagnoseNumber: "1121",
            goodFeedbackNumber: "10",
            avatarUrl: "/static/assets/image/9-small.jpg"

          }, {
            id: 3,
            doctorname: '张名2',
            doctortitle: "副主任医师2",
            hospitalname: "西安西京医院2",
            skill: "头部",
            diagnoseNumber: "12",
            goodFeedbackNumber: "10",
            avatarUrl: "/static/assets/image/9-small.jpg"

          },

        ]
      };
    }
    res.send({
      status: 0,
      msg: "",
      data: data
    });
  });

  app.get('/doctor/recommanded', function(req, res) {
    console.dir(req.query);

    var data = {
      id: 1,
      doctorname: '张22名',
      doctortitle: "副主22任医师",
      hospitalname: "西22安西京医院",
      skill: "头部，22颈部",
      diagnoseNumber: "12212",
      goodFeedbackNumber: "12200",
      avatarUrl: "/static/assets/image/9-small.jpg"
    };



    res.send({
      status: 0,
      msg: "",
      data: data
    });
  });


  app.get('/diagnose/template', function(req, res) {
    console.dir(req.query);

    var data = {
      id: 1,
      imageDes: '左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏，左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏，左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏',
      diagnoseResult: "左桡骨未见异常",
      techDes: ""
    };

    res.send({
      status: 0,
      msg: "",
      data: data
    });
  });

  app.post('/doctor/report/update', function(req, res) {
    console.dir(req.query);
    res.send({
      status: 0,
      msg: ""
    });
  });

  app.post('/doctor/audit/create', function(req, res) {
    console.dir(req.query);
    res.send({
      status: 0,
      msg: ""
    });
  });



  app.get('/diagnose/exsits', function(req, res) {
    console.dir(req.query);
    var data = {
      id: 1,
      imageDes: '左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏，左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏，左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏',
      diagnoseResult: "左桡骨未见异常",
      techDes: "",
      diagnoseDoctorName: "张小",
      diagnoseDoctorTitle: "主任医师",
      diagnoseDoctorId: "122",
      patientName: "李冰1",
      date: "2014-11-29",
      section: "头部，颈部，胸部"
    };
    res.send({
      status: 0,
      msg: "",
      data: data
    });

  });


  app.get('/message/list', function(req, res) {
    console.dir(req.query);
    if(req.query.status == 1){
      var data = [{
      id: 1,
      url: "diagnoseLink",
      title:"诊断申请",
      type: "未读消息",
      createTime: "2013-12-12 13:00",
      content: "您有一条新的诊断申请。诊断号：34556 ｜ 诊断类型：MR ｜ 诊断部位：头部，颈部 ｜ 患者：李响"
    }, {
      id: 2,
      url: "diagnoseLink",
      title:"诊断申请",
      type: "未读消息",
      createTime: "2013-12-12 13:00",
      content: "您有一条新的诊断申请。诊断号：34556 ｜ 诊断类型：MR ｜ 诊断部位：头部，颈部 ｜ 患者：李响"

    }];
  }else{
    var data = [{
      id: 1,
      url: "diagnoseLink",
      title:"诊断申请",
      type: "未读消息",
      createTime: "2013-12-12 13:00",
      content: "您有一条新的诊断申请。诊断号：34556 ｜ 诊断类型：MR ｜ 诊断部位：头部，颈部 ｜ 患者：李响"
    }];
  }
    
    res.send({
      status: 0,
      msg: "",
      data: data
    });

  });






  app.get('/patient/profile.json', function(req, res) {
    console.dir(req.query);
    var data = {
      id: 1,
      name: "利好",
      gender: "男",
      birthdate: "2013-12-12",
      identitynumber: "610103***********0818",
      phonenumber: "152****4567",
      location: "陕西，西安"
    };
    res.send({
      status: 0,
      msg: "",
      data: data
    });

  });

  app.get('/pathlogy/dicominfo.json', function(req, res) {
    console.dir(req.query);
    var data = {
      id: 1,
      position: "头部，颈部",
      type: "MT（核磁共振）",
      dicomUrl: "http://test",
      dicomFile: "bl2345-2014-03-24"
    };
    res.send({
      status: 0,
      msg: "",
      data: data
    });

  });

  app.get('/pathlogy/list.json', function(req, res) {
    console.dir(req.query);
    var data = [{
      id: 1,
      name: "bl2435-2014-04-03"
    }, {
      id: 2,
      name: "bl2435-2014-04-06"
    }];
    res.send({
      status: 0,
      msg: "",
      data: data
    });

  });


  app.get('/admin/diagnose/list/all', function(req, res) {
    console.log(req.query.type);

    var data = [{
      id: 1,
      diagnosenumber: '35423',
      doctorName: '张名',
      patientName: "李冰",
      date: "2014-10-29",
      positionName: "头部，颈部",
      status: "待分诊",
      hispital: "西安西京医院",
      statusId: "3"
    }, {
      id: 2,
      diagnosenumber: '35443',
      doctorName: '张名1',
      patientName: "李冰1",
      date: "2014-11-29",
      positionName: "头部，颈部，胸部",
      status: "待分诊",
      hispital: "西安西京医院2",
      statusId: "3"
    }];
    res.send({
      status: 0,
      msg: "",
      data: data
    });
  });

  app.get('/admin/diagnose/list/my', function(req, res) {
    console.log(req.query.status);
    if (req.query.status == 0) {
      var data = [{
        id: 1,
        diagnosenumber: '35443',
        doctorName: '张名1',
        patientName: "李冰1",
        date: "2014-11-29",
        positionName: "头部，颈部，胸部",
        status: "分诊中",
        hispital: "西安西京医院2",
        statusId: "4",
        dicomUrl: "test"
      }, {
        id: 2,
        diagnosenumber: '35433',
        doctorName: '张名2',
        patientName: "李冰2",
        date: "2014-11-28",
        positionName: "头部，颈部，胸部",
        status: "待诊断",
        hispital: "西安西京医院2",
        statusId: "5",
        dicomUrl: "Test"
      }];
    } else {
      var data = [{
        id: 3,
        diagnosenumber: '35443',
        doctorName: '张名4',
        patientName: "李冰4",
        date: "2014-11-29",
        positionName: "头部，颈部，胸部",
        status: "分诊中",
        hispital: "西安西京医院2",
        statusId: "4",
        dicomUrl: "Test"
      }, {
        id: 4,
        diagnosenumber: '35433',
        doctorName: '张名3',
        patientName: "李冰3",
        date: "2014-11-28",
        positionName: "头部，颈部，胸部",
        status: "待诊断",
        hispital: "西安西京医院2",
        statusId: "5",
        dicomUrl: "test"
      }];
    }

    res.send({
      status: 0,
      msg: "",
      data: data
    });
  });

  app.post('/admin/diagnose/update', function(req, res) {
    console.dir(req.query);
    res.send({
      status: 0,
      msg: "",
      data: ""
    });

  });

  app.get('/diagnose/reportdetail', function(req, res) {
    console.dir(req.query);
    var data = {
      id: 1,
      patientName: "李冰1",
      gender: "男",
      birthDate: "1985-06-24",
      date: "2014-11-29",
      positionName: "头部，颈部，胸部",
      diagnoseType: "MR",
      dicomUrl: "test",
      hospitalHistory: "西安西京医院",
      hospitalId: "1",
      caseHistory: "测试",
      docUrl: ["test", "test2"],
      techDes: "cesghi",
      imageDes: "tdasdsa",
      diagnoseResult: "tete",
      reportId: "3"
    };
    res.send({
      status: 0,
      msg: "",
      data: data
    });
  });



  app.get('/diagnoseTemplate/postionList', function(req, res) {
    console.dir(req.query);
    var data = ["呼吸系统","骨关节病变"];
    res.send({
      status: 0,
      msg: "",
      data: data
    });
  });

  app.get('/diagnoseTemplate/diagnoseAndImageDesc', function(req, res) {
    console.dir(req.query);
    var data = [{
      imageDesc:"左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏，左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏，左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏",
      diagnoseDesc:"心肺未见异常"
    },{
      imageDesc:"左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏，左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏，左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏",
      diagnoseDesc:"心肺未见异常"
    }];
    res.send({
      status: 0,
      msg: "",
      data: data
    });
  });


  app.post('/message/:messageId/remark.json', function(req, res) {
    console.dir(req.query);
    console.log(req.params.messageId);
    res.send({
      status: 0,
      msg: "",
      data: ""
    });
  });

 app.post('/addDiagnoseComment.json', function(req, res) {
    console.dir(req.query);
    res.send({
      status: 0,
      msg: "",
      data: ""
    });

  });


  app.get('/userFavorties/:userId/list', function(req, res) {
    console.dir(req.params.userId);
    var data = [{
        id:123,
        uid:23,
        name:"王一分",
        content:"复旦大学附属华山医院-皮肤科"

     
    },{
        id:124,
        uid:33,
        name:"力一分",
        content:"复旦大学附属华山医院-影像"
    
    }];
    res.send({
      status: 0,
      msg: "",
      data: data
    });
  });

  app.post('/userFavorties/:id/cancel', function(req, res) {
    console.dir(req.params.id);
    res.send({
      status: 0,
      msg: "",
      data: ""
    });

  });



  app.post('/userFavorties/add', function(req, res) {
    res.send({
      status: 0,
      msg: "",
      data: ""
    });

  });

 app.post('/gratitude/create', function(req, res) {
    res.send({
      status: 0,
      msg: "",
      data: ""
    });

  });


  app.get('/diagnose/actions', function(req, res) {
    console.dir(req.query);
    var data = {
      id:1,
      diagnoseStatus:7,
      diagnosenumber:"34332",
      applyTime: "2013-03-30",
      doctorName:"李响",
      patientName:"xuyan",
      gender:"nan",
      birthDate:"1999-09-09",
      positionName:"头部，颈部，胸部",
      diagnoseType:"mri",
      dicomUrl:"http://test.com",
      hospitalId:"123",
      hospitalHistory:"dsadasdasdasda",
      caseHistory:"dadasdasd",
      docUrl:"http://123.com",
      isFeedback: false,
      actions:[{
        time: "2013-02-03",
           title: "分诊医生 李响 需要就诊人更新申请信息",
           comments: "dasd啊是大事",
           name: "李响"
      },{
        time: "2013-02-04",
        title: "分诊医生 李1响 需要就诊人更新申请信息",

      }
      ]
    };  
    res.send({
      status: 0,
      msg: "",
      data: data
    });
  });


  app.get('/hospital/user/list/unfinish', function(req, res) {
    console.log(req.query.status);
      var data = [{
        id: 1,
        diagnosenumber: '35443',
        doctorName: '张名1',
        patientName: "李冰1",
        date: "2014-11-29",
        positionName: "头部，颈部，胸部",
        status: "分诊中",
        hispital: "西安西京医院2",
        statusId: "7",
        hasDicom:true,
        dicomFileName:"test",
        dicomUrl: "test"
      }, {
        id: 2,
        diagnosenumber: '35433',
        doctorName: '张名2',
        patientName: "李冰2",
        date: "2014-11-28",
        positionName: "头部，颈部，胸部",
        status: "待诊断",
        hispital: "西安西京医院2",
        statusId: "1",
        hasDicom:false
      }];
  

    res.send({
      status: 0,
      msg: "",
      data: data
    });
  });


  app.get('/hospital/user/list/all', function(req, res) {
    console.log(req.query.status);
       if (req.query.status == 0) {
      var data = [{
        id: 1,
        diagnosenumber: '35443',
        doctorName: '张名1',
        patientName: "李冰1",
        date: "2014-11-29",
        positionName: "头部，颈部，胸部",
        status: "分诊中",
        hispital: "西安西京医院2",
        statusId: "4"
      }, {
        id: 2,
        diagnosenumber: '35433',
        doctorName: '张名2',
        patientName: "李冰2",
        date: "2014-11-28",
        positionName: "头部，颈部，胸部",
        status: "待诊断",
        hispital: "西安西京医院2",
        statusId: "5"
      }];
    } else {
      var data = [{
        id: 3,
        diagnosenumber: '35443',
        doctorName: '张名4',
        patientName: "李冰4",
        date: "2014-11-29",
        positionName: "头部，颈部，胸部",
        status: "分诊中",
        hispital: "西安西京医院2",
        statusId: "4"
      }, {
        id: 4,
        diagnosenumber: '35433',
        doctorName: '张名3',
        patientName: "李冰3",
        date: "2014-11-28",
        positionName: "头部，颈部，胸部",
        status: "待诊断",
        hispital: "西安西京医院2",
        statusId: "5"
      }];
    }
  

    res.send({
      status: 0,
      msg: "",
      data: data
    });
  });

  app.post('/diagnose/rollback/:id', function(req, res) {
    console.dir(req.params.id);
    res.send({
      status: 0,
      msg: "",
      data: ""
    });

  });


  app.post('/diagnose/delete/:id', function(req, res) {
    console.dir(req.params.id);
    res.send({
      status: 0,
      msg: "",
      data: ""
    });

  });


  app.post('/doctor/register/confirm', function(req, res) {
    console.dir(req.query);
    res.send({
      status: 0,
      msg: "",
      data: ""
    });

  });



  app.get('/diagnose/paylink', function(req, res) {
    console.log(req.query);
      var data = {
        id: 1,
        paylink:"http://test"
      };
  

    res.send({
      status: 0,
      msg: "",
      data: data
    });
  });




  http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
  });



})