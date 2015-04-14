
function getDefaultIfNull(obj, value) {
    return obj==null? value: obj;
}

var AppConfig = {};
AppConfig.service = { 'host': location.hostname, 'port': 5007 };
//AppConfig.service = { 'host': "192.168.155.42", 'port': 8080 };

AppConfig.api = {
    reports: 'http://' + AppConfig.service.host + ':' + AppConfig.service.port + '/api/report/',
    userreport: 'http://' + AppConfig.service.host + ':' + AppConfig.service.port + '/api/userreport/',
    reportuser: 'http://' + AppConfig.service.host + ':' + AppConfig.service.port + '/api/reportuser/',
    availablereportuser: 'http://' + AppConfig.service.host + ':' + AppConfig.service.port + '/api/availablereportuser/',
    cube: 'http://' + AppConfig.service.host + ':' + AppConfig.service.port + '/api/cube/',
    chart: 'http://' + AppConfig.service.host + ':' + AppConfig.service.port + '/api/chart/',
    dimension: 'http://' + AppConfig.service.host + ':' + AppConfig.service.port + '/api/dimension/',
    file: 'http://' + "192.168.155.42" + ':' + "8080" + '/api/file',
    users: 'http://' + AppConfig.service.host + ':' + AppConfig.service.port + '/api/user/',
    auth: 'http://' + AppConfig.service.host + ':' + AppConfig.service.port + '/api/auth/',
    token: 'http://' + AppConfig.service.host + ':' + AppConfig.service.port + '/api/token',
};

