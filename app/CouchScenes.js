function solarAltitude(lat, lon, d) {
  d = d || new Date();
  var start = new Date(Date.UTC(d.getUTCFullYear(), 0, 0));
  var dayOfYear = Math.floor((d - start) / 86400000);
  var b = (360 / 365.25) * (dayOfYear - 81) * (Math.PI / 180);
  var eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  var decl = 23.45 * Math.sin(b) * (Math.PI / 180);
  var utcHours = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
  var solarTime = (utcHours + (lon / 15) + (eot / 60) + 24) % 24;
  var hourAngle = (solarTime - 12) * 15 * (Math.PI / 180);
  var latRad = lat * (Math.PI / 180);
  var sinAlt = Math.sin(latRad) * Math.sin(decl) + Math.cos(latRad) * Math.cos(decl) * Math.cos(hourAngle);
  var alt = Math.asin(Math.max(-1, Math.min(1, sinAlt))) * (180 / Math.PI);
  return { alt: alt, hourAngle: hourAngle * (180 / Math.PI) };
}

var rotation = ['night', 'golden', 'water', 'fog', 'dawn'];
var place = { latitude: 34.56476, longitude: -86.52185, label: 'Huntsville, AL 35803' };

function sceneAt(location, date, code) {
    var sun = solarAltitude(location.latitude, location.longitude, date);
    if (sun.alt < -6) return 'night';
    if (sun.alt < 10) return sun.hourAngle < 0 ? 'dawn' : 'golden';
    return [3, 45, 48, 51, 53, 55, 61, 63, 65, 80, 81, 82].indexOf(code) >= 0 ? 'fog' : 'water';
}

function sceneFor(mode, location, date, code, seconds) {
    if (mode === 'rotation') return rotation[Math.floor(date.getTime() / (seconds * 1000)) % rotation.length];
    return rotation.indexOf(mode) >= 0 ? mode : sceneAt(location, date, code);
}

function readWeather(payload, receivedAt) {
    var current = payload && payload.current;
    if (!current || typeof current.temperature_2m !== 'number' || !isFinite(current.temperature_2m) ||
        typeof current.weather_code !== 'number' || !isFinite(current.weather_code)) return null;
    return { celsius: current.temperature_2m, code: current.weather_code, receivedAt: receivedAt };
}

function isFresh(report, now) {
    return report && now - report.receivedAt < 7200000;
}

function weatherLabel(report, now, units) {
    if (!isFresh(report, now)) return '';
    var code = report.code;
    var conditions = code === 0 ? 'Clear' : code < 3 ? 'Partly cloudy' : code === 3 ? 'Overcast' :
        code <= 48 ? 'Fog' : code <= 57 ? 'Drizzle' : code <= 67 ? 'Rain' :
        code <= 77 ? 'Snow' : code <= 82 ? 'Showers' : code <= 86 ? 'Snow showers' : 'Thunderstorms';
    var temperature = units === 'C' ? report.celsius : report.celsius * 9 / 5 + 32;
    return Math.round(temperature) + '°' + units + '  ·  ' + conditions;
}
