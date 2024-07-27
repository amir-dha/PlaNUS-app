// timezones.js
const timeZones = [
    { label: 'International Date Line West (GMT-12:00)', value: 'International Date Line West (GMT-12:00)' },
    { label: 'Coordinated Universal Time-11 (GMT-11:00)', value: 'Coordinated Universal Time-11 (GMT-11:00)' },
    { label: 'Hawaii (GMT-10:00)', value: 'Hawaii (GMT-10:00)' },
    { label: 'Alaska (GMT-09:00)', value: 'Alaska (GMT-09:00)' },
    { label: 'Pacific Time (US & Canada) (GMT-08:00)', value: 'Pacific Time (US & Canada) (GMT-08:00)' },
    { label: 'Arizona (GMT-07:00)', value: 'Arizona (GMT-07:00)' },
    { label: 'Mountain Time (US & Canada) (GMT-07:00)', value: 'Mountain Time (US & Canada) (GMT-07:00)' },
    { label: 'Central Time (US & Canada) (GMT-06:00)', value: 'Central Time (US & Canada) (GMT-06:00)' },
    { label: 'Mexico City (GMT-06:00)', value: 'Mexico City (GMT-06:00)' },
    { label: 'Saskatchewan (GMT-06:00)', value: 'Saskatchewan (GMT-06:00)' },
    { label: 'Eastern Time (US & Canada) (GMT-05:00)', value: 'Eastern Time (US & Canada) (GMT-05:00)' },
    { label: 'Bogota (GMT-05:00)', value: 'Bogota (GMT-05:00)' },
    { label: 'Lima (GMT-05:00)', value: 'Lima (GMT-05:00)' },
    { label: 'Atlantic Time (Canada) (GMT-04:00)', value: 'Atlantic Time (Canada) (GMT-04:00)' },
    { label: 'Caracas (GMT-04:00)', value: 'Caracas (GMT-04:00)' },
    { label: 'Santiago (GMT-04:00)', value: 'Santiago (GMT-04:00)' },
    { label: 'Brasilia (GMT-03:00)', value: 'Brasilia (GMT-03:00)' },
    { label: 'Buenos Aires (GMT-03:00)', value: 'Buenos Aires (GMT-03:00)' },
    { label: 'Greenland (GMT-03:00)', value: 'Greenland (GMT-03:00)' },
    { label: 'Mid-Atlantic (GMT-02:00)', value: 'Mid-Atlantic (GMT-02:00)' },
    { label: 'Azores (GMT-01:00)', value: 'Azores (GMT-01:00)' },
    { label: 'Cape Verde Is. (GMT-01:00)', value: 'Cape Verde Is. (GMT-01:00)' },
    { label: 'Casablanca (GMT+00:00)', value: 'Casablanca (GMT+00:00)' },
    { label: 'Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London (GMT+00:00)', value: 'Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London (GMT+00:00)' },
    { label: 'Monrovia (GMT+00:00)', value: 'Monrovia (GMT+00:00)' },
    { label: 'UTC (GMT+00:00)', value: 'UTC (GMT+00:00)' },
    { label: 'Amsterdam (GMT+01:00)', value: 'Amsterdam (GMT+01:00)' },
    { label: 'Belgrade (GMT+01:00)', value: 'Belgrade (GMT+01:00)' },
    { label: 'Berlin (GMT+01:00)', value: 'Berlin (GMT+01:00)' },
    { label: 'Bern (GMT+01:00)', value: 'Bern (GMT+01:00)' },
    { label: 'Bratislava (GMT+01:00)', value: 'Bratislava (GMT+01:00)' },
    { label: 'Brussels (GMT+01:00)', value: 'Brussels (GMT+01:00)' },
    { label: 'Budapest (GMT+01:00)', value: 'Budapest (GMT+01:00)' },
    { label: 'Copenhagen (GMT+01:00)', value: 'Copenhagen (GMT+01:00)' },
    { label: 'Ljubljana (GMT+01:00)', value: 'Ljubljana (GMT+01:00)' },
    { label: 'Madrid (GMT+01:00)', value: 'Madrid (GMT+01:00)' },
    { label: 'Paris (GMT+01:00)', value: 'Paris (GMT+01:00)' },
    { label: 'Prague (GMT+01:00)', value: 'Prague (GMT+01:00)' },
    { label: 'Rome (GMT+01:00)', value: 'Rome (GMT+01:00)' },
    { label: 'Sarajevo (GMT+01:00)', value: 'Sarajevo (GMT+01:00)' },
    { label: 'Skopje (GMT+01:00)', value: 'Skopje (GMT+01:00)' },
    { label: 'Stockholm (GMT+01:00)', value: 'Stockholm (GMT+01:00)' },
    { label: 'Vienna (GMT+01:00)', value: 'Vienna (GMT+01:00)' },
    { label: 'Warsaw (GMT+01:00)', value: 'Warsaw (GMT+01:00)' },
    { label: 'West Central Africa (GMT+01:00)', value: 'West Central Africa (GMT+01:00)' },
    { label: 'Zagreb (GMT+01:00)', value: 'Zagreb (GMT+01:00)' },
    { label: 'Athens (GMT+02:00)', value: 'Athens (GMT+02:00)' },
    { label: 'Bucharest (GMT+02:00)', value: 'Bucharest (GMT+02:00)' },
    { label: 'Cairo (GMT+02:00)', value: 'Cairo (GMT+02:00)' },
    { label: 'Harare (GMT+02:00)', value: 'Harare (GMT+02:00)' },
    { label: 'Helsinki (GMT+02:00)', value: 'Helsinki (GMT+02:00)' },
    { label: 'Jerusalem (GMT+02:00)', value: 'Jerusalem (GMT+02:00)' },
    { label: 'Kaliningrad (GMT+02:00)', value: 'Kaliningrad (GMT+02:00)' },
    { label: 'Kyiv (GMT+02:00)', value: 'Kyiv (GMT+02:00)' },
    { label: 'Pretoria (GMT+02:00)', value: 'Pretoria (GMT+02:00)' },
    { label: 'Riga (GMT+02:00)', value: 'Riga (GMT+02:00)' },
    { label: 'Sofia (GMT+02:00)', value: 'Sofia (GMT+02:00)' },
    { label: 'Tallinn (GMT+02:00)', value: 'Tallinn (GMT+02:00)' },
    { label: 'Vilnius (GMT+02:00)', value: 'Vilnius (GMT+02:00)' },
    { label: 'Baghdad (GMT+03:00)', value: 'Baghdad (GMT+03:00)' },
    { label: 'Istanbul (GMT+03:00)', value: 'Istanbul (GMT+03:00)' },
    { label: 'Kuwait (GMT+03:00)', value: 'Kuwait (GMT+03:00)' },
    { label: 'Minsk (GMT+03:00)', value: 'Minsk (GMT+03:00)' },
    { label: 'Moscow (GMT+03:00)', value: 'Moscow (GMT+03:00)' },
    { label: 'Nairobi (GMT+03:00)', value: 'Nairobi (GMT+03:00)' },
    { label: 'St. Petersburg (GMT+03:00)', value: 'St. Petersburg (GMT+03:00)' },
    { label: 'Tehran (GMT+03:30)', value: 'Tehran (GMT+03:30)' },
    { label: 'Abu Dhabi (GMT+04:00)', value: 'Abu Dhabi (GMT+04:00)' },
    { label: 'Baku (GMT+04:00)', value: 'Baku (GMT+04:00)' },
    { label: 'Muscat (GMT+04:00)', value: 'Muscat (GMT+04:00)' },
    { label: 'Tbilisi (GMT+04:00)', value: 'Tbilisi (GMT+04:00)' },
    { label: 'Yerevan (GMT+04:00)', value: 'Yerevan (GMT+04:00)' },
    { label: 'Kabul (GMT+04:30)', value: 'Kabul (GMT+04:30)' },
    { label: 'Ekaterinburg (GMT+05:00)', value: 'Ekaterinburg (GMT+05:00)' },
    { label: 'Islamabad (GMT+05:00)', value: 'Islamabad (GMT+05:00)' },
    { label: 'Karachi (GMT+05:00)', value: 'Karachi (GMT+05:00)' },
    { label: 'Tashkent (GMT+05:00)', value: 'Tashkent (GMT+05:00)' },
    { label: 'Chennai (GMT+05:30)', value: 'Chennai (GMT+05:30)' },
    { label: 'Kolkata (GMT+05:30)', value: 'Kolkata (GMT+05:30)' },
    { label: 'Mumbai (GMT+05:30)', value: 'Mumbai (GMT+05:30)' },
    { label: 'New Delhi (GMT+05:30)', value: 'New Delhi (GMT+05:30)' },
    { label: 'Sri Jayawardenepura (GMT+05:30)', value: 'Sri Jayawardenepura (GMT+05:30)' },
    { label: 'Kathmandu (GMT+05:45)', value: 'Kathmandu (GMT+05:45)' },
    { label: 'Almaty (GMT+06:00)', value: 'Almaty (GMT+06:00)' },
    { label: 'Astana (GMT+06:00)', value: 'Astana (GMT+06:00)' },
    { label: 'Dhaka (GMT+06:00)', value: 'Dhaka (GMT+06:00)' },
    { label: 'Urumqi (GMT+06:00)', value: 'Urumqi (GMT+06:00)' },
    { label: 'Rangoon (GMT+06:30)', value: 'Rangoon (GMT+06:30)' },
    { label: 'Bangkok (GMT+07:00)', value: 'Bangkok (GMT+07:00)' },
    { label: 'Hanoi (GMT+07:00)', value: 'Hanoi (GMT+07:00)' },
    { label: 'Jakarta (GMT+07:00)', value: 'Jakarta (GMT+07:00)' },
    { label: 'Krasnoyarsk (GMT+07:00)', value: 'Krasnoyarsk (GMT+07:00)' },
    { label: 'Beijing (GMT+08:00)', value: 'Beijing (GMT+08:00)' },
    { label: 'Chongqing (GMT+08:00)', value: 'Chongqing (GMT+08:00)' },
    { label: 'Hong Kong (GMT+08:00)', value: 'Hong Kong (GMT+08:00)' },
    { label: 'Irkutsk (GMT+08:00)', value: 'Irkutsk (GMT+08:00)' },
    { label: 'Kuala Lumpur (GMT+08:00)', value: 'Kuala Lumpur (GMT+08:00)' },
    { label: 'Perth (GMT+08:00)', value: 'Perth (GMT+08:00)' },
    { label: 'Asia/Singapore (GMT+08:00)', value: 'Asia/Singapore (GMT+08:00)' },
    { label: 'Taipei (GMT+08:00)', value: 'Taipei (GMT+08:00)' },
    { label: 'Ulaan Bataar (GMT+08:00)', value: 'Ulaan Bataar (GMT+08:00)' },
    { label: 'Osaka (GMT+09:00)', value: 'Osaka (GMT+09:00)' },
    { label: 'Sapporo (GMT+09:00)', value: 'Sapporo (GMT+09:00)' },
    { label: 'Seoul (GMT+09:00)', value: 'Seoul (GMT+09:00)' },
    { label: 'Tokyo (GMT+09:00)', value: 'Tokyo (GMT+09:00)' },
    { label: 'Yakutsk (GMT+09:00)', value: 'Yakutsk (GMT+09:00)' },
    { label: 'Adelaide (GMT+09:30)', value: 'Adelaide (GMT+09:30)' },
    { label: 'Darwin (GMT+09:30)', value: 'Darwin (GMT+09:30)' },
    { label: 'Brisbane (GMT+10:00)', value: 'Brisbane (GMT+10:00)' },
    { label: 'Canberra (GMT+10:00)', value: 'Canberra (GMT+10:00)' },
    { label: 'Guam (GMT+10:00)', value: 'Guam (GMT+10:00)' },
    { label: 'Hobart (GMT+10:00)', value: 'Hobart (GMT+10:00)' },
    { label: 'Melbourne (GMT+10:00)', value: 'Melbourne (GMT+10:00)' },
    { label: 'Port Moresby (GMT+10:00)', value: 'Port Moresby (GMT+10:00)' },
    { label: 'Sydney (GMT+10:00)', value: 'Sydney (GMT+10:00)' },
    { label: 'Vladivostok (GMT+10:00)', value: 'Vladivostok (GMT+10:00)' },
    { label: 'Magadan (GMT+11:00)', value: 'Magadan (GMT+11:00)' },
    { label: 'New Caledonia (GMT+11:00)', value: 'New Caledonia (GMT+11:00)' },
    { label: 'Solomon Is. (GMT+11:00)', value: 'Solomon Is. (GMT+11:00)' },
    { label: 'Srednekolymsk (GMT+11:00)', value: 'Srednekolymsk (GMT+11:00)' },
    { label: 'Auckland (GMT+12:00)', value: 'Auckland (GMT+12:00)' },
    { label: 'Fiji (GMT+12:00)', value: 'Fiji (GMT+12:00)' },
    { label: 'Kamchatka (GMT+12:00)', value: 'Kamchatka (GMT+12:00)' },
    { label: 'Marshall Is. (GMT+12:00)', value: 'Marshall Is. (GMT+12:00)' },
    { label: 'Wellington (GMT+12:00)', value: 'Wellington (GMT+12:00)' },
    { label: 'Chatham Is. (GMT+12:45)', value: 'Chatham Is. (GMT+12:45)' },
    { label: 'Nuku\'alofa (GMT+13:00)', value: 'Nuku\'alofa (GMT+13:00)' },
    { label: 'Samoa (GMT+13:00)', value: 'Samoa (GMT+13:00)' },
    { label: 'Tokelau Is. (GMT+13:00)', value: 'Tokelau Is. (GMT+13:00)' },
  ];
  
  // Sort timezones alphabetically by label
  timeZones.sort((a, b) => a.label.localeCompare(b.label));
  
  export default timeZones;
  