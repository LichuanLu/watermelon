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
    res.render('applyDiagnose');
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





  app.configure('development', function() {
    app.use(express.errorHandler());
  });

  app.get('/diagnose/list', function(req, res) {
    console.log(req.query.type);

    var data = [{
        id: 1,
        diagnosenumber:'35423',
        doctorName: '张名',
        patientName: "李冰",
        date: "2014-10-29",
        section: "头部，颈部",
        status: "待审核",
        statusId: "5"
      }, {
        id: 2,
        diagnosenumber:'35443',
        doctorName: '张名1',
        patientName: "李冰1",
        date: "2014-11-29",
        section: "头部，颈部，胸部",
        status: "诊断完成",
        statusId: "6"
      }, {
        id: 3,
        diagnosenumber:'35413',
        doctorName: '张名2',
        patientName: "李冰2",
        date: "2013-10-29",
        section: "颈部",
        status: "待诊断",
        statusId: "4"
      },{
        id: 4,
        diagnosenumber:'35413',
        doctorName: '张名2',
        patientName: "李冰2",
        date: "2013-10-29",
        section: "颈部",
        status: "需要更新",
        statusId: "7"
      }

    ];
    res.send({
      code: 0,
      message: "",
      data: data
    });
  });



  app.post('/register/patient.json', function(req, res) {
    console.log(req.body);
    var result = {
      code: 0,
      message: "success"
    };
    res.send(result);

  });

  app.post('/register/doctor.json', function(req, res) {
    console.log(req.body);
    var result = {
      code: 0,
      message: "success"
    };
    res.send(result);

  });
  app.post('/login.json', function(req, res) {
    console.log(req.body);
    var result = {
      code: 0,
      message: "success"
    };
    res.send(result);

  });
  app.post('/save/diagnose/:formid', function(req, res) {
    console.log(req.params.formid);
    var formid = req.params.formid;
    var result;
    if (formid == 1) {
      result = {
        code: 0,
        message: "success",
        data: {
          formId: 2
        }
      };
    } else if (formid == 2) {
      result = {
        code: 0,
        message: "success",
        data: {
          formId: 3
        }
      };
    } else if (formid == 3) {
      result = {
        code: 0,
        message: "success",
        data: {
          formId: 4
        }
      };
    } else {
      result = {
        code: 0,
        message: "success",
        data: ""
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
      code: 0,
      message: "",
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
      code: 0,
      message: "",
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
      code: 0,
      message: "",
      data: data
    });
  });

  app.post('/doctor/diagnose/create', function(req, res) {
    console.dir(req.query);
    res.send({
      code: 0,
      message: ""
    });
  });

 app.post('/doctor/audit/create', function(req, res) {
    console.dir(req.query);
    res.send({
      code: 0,
      message: ""
    });
  });



  app.get('/diagnose/exsits', function(req, res) {
    console.dir(req.query);
    var data = {
      id: 1,
      imageDes: '左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏，左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏，左尺桡骨形态，骨密度正常，未见明确骨质增生及破坏',
      diagnoseResult: "左桡骨未见异常",
      techDes: "",
      diagnoseDoctorName:"张小",
      diagnoseDoctorTitle:"主任医师",
      diagnoseDoctorId:"122",
      patientName: "李冰1",
      date: "2014-11-29",
      section: "头部，颈部，胸部"
    };
     res.send({
      code: 0,
      message: "",
      data:data
    });

  });


  app.get('/message/list', function(req, res) {
    console.dir(req.query);
    var data = [{
      id: 1,
      url:"/test",
      type:"未读消息",
      date:"2013-12-12 13:00",
      content:"您有一条新的诊断申请。诊断号：34556 ｜ 诊断类型：MR ｜ 诊断部位：头部，颈部 ｜ 患者：李响"
    },{
      id: 2,
      url:"/test",
      type:"未读消息",
      date:"2013-11-12 13:00",
      content:"您收到一条新的咨询。咨询人：李响 ｜ 内容：Asda大是大事Asda是大事"

    }];
     res.send({
      code: 0,
      message: "",
      data:data
    });

  });



  http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
  });



})